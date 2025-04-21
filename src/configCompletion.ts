import * as vscode from 'vscode';

// Список секций локализации Factorio
const sectionDescriptions: { [key: string]: string } = {
    'achievement-description': 'Описание достижения',
    'achievement-name': 'Название достижения',
    'ammo-category-name': 'Категория боеприпасов',
    'autoplace-control-names': 'Настройки автопозиционирования',
    'controls': 'Элементы управления',
    'damage-type-name': 'Тип урона',
    'decorative-name': 'Декоративные элементы',
    'entity-description': 'Описание сущности',
    'entity-name': 'Название сущности',
    'equipment-name': 'Название оборудования',
    'fluid-name': 'Название жидкости',
    'fuel-category-name': 'Категория топлива',
    'item-description': 'Описание предмета',
    'item-group-name': 'Группа предметов',
    'item-limitation': 'Ограничения предмета',
    'item-name': 'Название предмета',
    'map-gen-preset-description': 'Описание предустановки генерации карты',
    'map-gen-preset-name': 'Название предустановки генерации карты',
    'mod-description': 'Описание мода',
    'mod-name': 'Название мода',
    'modifier-description': 'Описание модификатора',
    'programmable-speaker-instrument': 'Инструмент программируемой колонки',
    'programmable-speaker-note': 'Нота программируемой колонки',
    'recipe-name': 'Название рецепта',
    'shortcut': 'Сочетание клавиш',
    'story': 'Текст истории',
    'string-mod-setting': 'Строковая настройка мода',
    'technology-description': 'Описание технологии',
    'technology-name': 'Название технологии',
    'tile-name': 'Название плитки',
    'tips-and-tricks-item-description': 'Описание совета и подсказки',
    'tips-and-tricks-item-name': 'Название совета и подсказки',
    'virtual-signal-description': 'Описание виртуального сигнала',
    'virtual-signal-name': 'Название виртуального сигнала',
  };
  
// Провайдер автодополнения для .cfg-файлов локализации
export class ConfigCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
      document: vscode.TextDocument,
      position: vscode.Position
    ): vscode.CompletionItem[] {
      const linePrefix = document.lineAt(position).text.substr(0, position.character);
  
      // Предложения для секций: при вводе '['
      if (/^\s*\[\w*$/.test(linePrefix)) {
        return Object.keys(sectionDescriptions).map(sec => {
          const item = new vscode.CompletionItem(sec, vscode.CompletionItemKind.Module);
          item.insertText = sec + ']';
          item.detail = sectionDescriptions[sec];
          return item;
        });
      }
  
      // Предложения ключей внутри секции (до '=')
      if (/^\s*\w*$/.test(linePrefix) && document.lineAt(position).text.includes('=')) {
        // Здесь можно расширить: читать реальные ключи из JSON/данных прототипов
        // Для примера возвращаем заглушку
        const stubKeys = ['example-key', 'another-key'];
        return stubKeys.map(key => new vscode.CompletionItem(key, vscode.CompletionItemKind.Field));
      }
  
      return [];
    }
  }