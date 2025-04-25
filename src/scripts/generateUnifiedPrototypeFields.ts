// scripts/generateUnifiedPrototypeFields.ts
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';

const DUMP_FILE = 'C:/Users/Artem/AppData/Roaming/Factorio/script-output/data-raw-dump.json';
const API_URL = 'https://lua-api.factorio.com/latest/prototype-api.json';
const OUT_DIR = path.resolve(__dirname, '../src/data/prototypes');

interface Property {
  name: string;
  optional?: boolean;
}

interface PrototypeJSON {
  typename: string | null;
  parent?: string;
  properties?: Property[];
}

interface API {
  prototypes: PrototypeJSON[];
}

interface FieldInfo {
  name: string;
  depth: number;
}

function collectAllProperties(
  proto: PrototypeJSON,
  map: Map<string, PrototypeJSON>,
  depth: number = 0
): FieldInfo[] {
  const fields: FieldInfo[] = [];
  let current: PrototypeJSON | undefined = proto;

  while (current) {
    if (Array.isArray(current.properties)) {
      for (const p of current.properties) {
        if (!fields.some(f => f.name === p.name)) {
          fields.push({
            name: p.name,
            depth: depth
          });
        }
      }
    }
    if (!current.parent) break;
    current = map.get(current.parent) ?? undefined;
    depth++;
  }

  return fields;
}

async function run() {
  // Загрузка данных
  if (!fs.existsSync(DUMP_FILE)) {
    throw new Error(`Dump file not found: ${DUMP_FILE}`);
  }
  const rawData = fs.readFileSync(DUMP_FILE, 'utf-8');
  const dataRaw: Record<string, any> = JSON.parse(rawData);

  const apiRes = await fetch(API_URL);
  if (!apiRes.ok) throw new Error(`Fetch failed: ${apiRes.status} ${apiRes.statusText}`);
  const apiData = (await apiRes.json()) as API;

  // Подготовка структур данных
  const protoMap = new Map<string, PrototypeJSON>();
  apiData.prototypes.forEach(p => p.typename && protoMap.set(p.typename, p));

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const indexLines: string[] = [];

  // Обработка категорий
  const categories = new Set<string>([
    ...Object.keys(dataRaw),
    ...apiData.prototypes.map(p => p.typename).filter((t): t is string => !!t)
  ]);

  for (const category of categories) {
    // Анализ дампа
    const dumpValue = dataRaw[category];
    const dumpProtos = Array.isArray(dumpValue) ? dumpValue : 
                      dumpValue && typeof dumpValue === 'object' ? Object.values(dumpValue) : [];
    
    const fieldSet = new Set<string>();
    dumpProtos.forEach(proto => {
      Object.keys(proto).forEach(k => fieldSet.add(k));
    });

    // Сбор полей из API
    const apiFields = protoMap.get(category)
      ? collectAllProperties(protoMap.get(category)!, protoMap)
      : [];

    // Объединение полей
    const allFields = new Map<string, FieldInfo>();
    
    // Добавляем поля из API
    apiFields.forEach(f => {
      allFields.set(f.name, f);
    });

    // Добавляем поля из дампа
    Array.from(fieldSet).forEach(name => {
      if (!allFields.has(name)) {
        allFields.set(name, {
          name,
          depth: Infinity
        });
      }
    });

    // Сортировка полей
    const sortedFields = Array.from(allFields.values())
      .sort((a, b) => {
        // Сначала по глубине в иерархии
        if (a.depth !== b.depth) return a.depth - b.depth;
        // Затем по алфавиту
        return a.name.localeCompare(b.name);
      });

    // Генерация сниппетов
    const snippets: Record<string, string> = {};
    sortedFields.forEach((f, i) => {
      snippets[f.name] = `\${${i + 1}:${f.name}}`;
    });

    // Запись файла
    const safeCategory = category.replace(/-/g, '_');
    const code = [
      '// AUTO‑GENERATED — do not edit',
      `export const ${safeCategory} = ${JSON.stringify(snippets, null, 2)};`,
      ''
    ].join('\n');
    
    fs.writeFileSync(path.join(OUT_DIR, `${safeCategory}.ts`), code, 'utf8');
    console.log(`✓ Generated ${category} with ${sortedFields.length} fields`);

    indexLines.push(`export { ${safeCategory} } from './${safeCategory}';`);
  }

  // Генерация индексного файла
  const indexCode = [
    '// AUTO‑GENERATED — do not edit',
    ...indexLines,
    ''
  ].join('\n');
  fs.writeFileSync(path.join(OUT_DIR, 'index.ts'), indexCode, 'utf8');
  console.log(`✓ Generated index.ts with ${indexLines.length} categories`);
}

run().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});