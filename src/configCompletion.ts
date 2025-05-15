import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// Путь до локализаций относительно корня расширения
const LOCAL_DIR = path.join(__dirname, '..', 'local');

// Читаем JSON‑файл синхронно (можно кешировать, если нужно)
function loadBundle(filename: string): Record<string, string> {
  try {
    const filePath = path.join(LOCAL_DIR, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    console.warn(`Не удалось загрузить ${filename}:`, e);
    return {};
  }
}

// Подгружаем оба словаря
const enDescriptions = loadBundle('package.nls.json');
const ruDescriptions = loadBundle('package.nls.ru.json');

// Все ключи секций, которые мы поддерживаем
const sectionKeys = Object.keys(enDescriptions);

export class ConfigCompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.CompletionItem[] {
    // Читаем настройку языка от пользователя
    const cfg = vscode.workspace.getConfiguration('factorioModdingTools');
    const lang = cfg.get<string>('suggestionLanguage', 'en');

    // Выбираем нужный словарь
    const descriptions = lang === 'ru' ? ruDescriptions : enDescriptions;

    const line = document.lineAt(position).text;
    const prefix = line.substr(0, position.character);

    // Предложения имен секций при вводе '['
    if (/^\s*\[\w*$/.test(prefix)) {
      return sectionKeys.map(key => {
        const item = new vscode.CompletionItem(key, vscode.CompletionItemKind.Module);
        item.insertText = `${key}]`;
        item.detail     = descriptions[`section.${key}`] || descriptions[key] || '';
        return item;
      });
    }

    // Предложения ключей внутри секции до '='
    if (/^\s*\w*$/.test(prefix) && line.includes('=')) {
      const stubKeys = ['example-key', 'another-key'];
      return stubKeys.map(k => new vscode.CompletionItem(k, vscode.CompletionItemKind.Field));
    }

    return [];
  }
}
