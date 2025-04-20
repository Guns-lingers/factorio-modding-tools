import * as fs from 'fs';
import * as path from 'path';

/**
 * Создаёт папки и файлы согласно описанию в config
 */
export function createStructure(basePath: string, config: StructureConfig) {
  const root = path.join(basePath, config.rootName);
  fs.mkdirSync(root, { recursive: true });

  // создаём все директории
  for (const dir of config.dirs) {
    fs.mkdirSync(path.join(root, dir.relativePath), { recursive: true });
  }

  // создаём все файлы
  for (const file of config.files) {
    const filePath = path.join(root, file.relativePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    const data = typeof file.content === 'function'
      ? file.content()
      : file.content || '';

    fs.writeFileSync(filePath, data);
  }

  // Теперь обновим info.json с настоящим именем мода
  const infoJsonPath = path.join(root, 'info.json');
  const infoJson = JSON.parse(fs.readFileSync(infoJsonPath, 'utf-8')); // Читаем существующий info.json
  infoJson.name = config.rootName; // Подставляем имя мода, которое передано в rootName
  fs.writeFileSync(infoJsonPath, JSON.stringify(infoJson, null, 2)); // Записываем обратно в файл
}

export interface FileDescriptor {
  /** Относительный путь от корня, например 'prototypes/items.lua' */
  relativePath: string;
  /** Либо строка с содержимым, либо функция, возвращающая строку */
  content?: string | (() => string);
}

export interface DirDescriptor {
  /** Относительный путь от корня, например 'graphics/icons' */
  relativePath: string;
}

export interface StructureConfig {
  /** Имя корневой папки (мода) */
  rootName: string;  // Имя мода, которое будет использовано
  dirs: DirDescriptor[];
  files: FileDescriptor[];
}

/**
 * Базовая структура Factorio-мода.
 * При использовании нужно скопировать и задать rootName.
 */
export const defaultFactorioMod: StructureConfig = {
  rootName: '',  // Имя мода, которое будет передано на этапе создания
  dirs: [
    { relativePath: 'locale/en' },
    { relativePath: 'graphics/icons' },
    { relativePath: 'prototypes' },
  ],
  files: [
    {
      relativePath: 'info.json',
      content: () => JSON.stringify({
        name: '',  // Пустое значение, будет заменено на rootName
        version: '0.0.1',
        title: '',
        author: '',
        description: '',
        factorio_version: '2.0',
        dependencies: ['base']
      }, null, 2),
    },
    { relativePath: 'control.lua', content: '-- control.lua\n' },
    {
      relativePath: 'data.lua',
      content: () =>
        ['items', 'containers', 'recipes', 'technologies']
          .map(m => `require("prototypes.${m}")`)
          .join('\n') + '\n',
    },
    { relativePath: 'locale/en/locale.cfg', content: '' },
    { relativePath: 'prototypes/items.lua', content: '-- items.lua\n' },
    { relativePath: 'prototypes/containers.lua', content: '-- containers.lua\n' },
    { relativePath: 'prototypes/recipes.lua', content: '-- recipes.lua\n' },
    { relativePath: 'prototypes/technologies.lua', content: '-- technologies.lua\n' },
  ],
};
