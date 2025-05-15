
# factorio-modding-tools  
_Лучшее расширение для моддинга Factorio в VS Code_

🌐 **Языки**: [English](README.md) | [Русский](README.ru.md)

[![VS Code](https://img.shields.io/badge/VSCODE-Extension-blue?logo=visualstudiocode)](https://marketplace.visualstudio.com/)
[![Status](https://img.shields.io/badge/status-in--development-yellow)](https://github.com/Guns-lingers/factorio-modding-tools)
[![Version](https://img.shields.io/badge/version-0.1.0-blue)](https://github.com/Guns-lingers/factorio-modding-tools/releases)
[![Last Commit](https://img.shields.io/github/last-commit/Guns-lingers/factorio-modding-tools)](https://github.com/Guns-lingers/factorio-modding-tools/commits)
[![Stars](https://img.shields.io/github/stars/Guns-lingers/factorio-modding-tools?style=social)](https://github.com/Guns-lingers/factorio-modding-tools/stargazers)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Language: Lua](https://img.shields.io/badge/language-Lua-blue.svg)](https://www.lua.org/)\
[![Join our Discord server](https://invidget.switchblade.xyz/W9DMUwKhv7?language=ru)](https://discord.gg/W9DMUwKhv7)

> ⚠️ **Внимание**: Это расширение находится в активной разработке. Некоторые функции могут быть недоступны или работать нестабильно. Мы активно работаем над улучшением функциональности и будем рады вашим отзывам и предложениям.

**Factorio Modding Tools** — расширение для VS Code, упрощающее разработку модов для игры [Factorio](https://factorio.com/).
Позволяет одним кликом создать структуру мода, ускоряет работу с Lua-прототипами и улучшает редактирование `info.json`.

---

## 🚀 Возможности

### 🏗️ Создание структуры мода
- Команда **Factorio Mod: Create Mod Structure** (`Ctrl+Shift+P`)
- Автоматически генерирует каркас мода:
  ```
  my-mod/
  ├── info.json
  ├── data.lua
  ├── control.lua
  └── prototypes/
      ├── containers.lua
      ├── recipes.lua
      ├── technologies.lua
      └── items.lua
  └── locale/
        └── en
            └── locale.cfg
  └── graphics
      └── icons
  ```

### 🤠 Lua автодополнение
- Автодополнение только внутри `data:extend({ … })`
- При вводе `type = "` VS Code предлагает список всех типов прототипов (из `prototypes/index.ts`).
- После выбора типа и перехода на **новую строку** предложит только поля, **не введённые ранее** в этом объекте.

### 🌐 Автодополнение локализации
- Автозаполнение для файлов локализации `.cfg`
- При вводе секции (`[item-name]`, `[recipe-name]` и др.) выводится описание и примеры ключ=значение.

### 🛠️ Упаковка мода в ZIP
- Команда **Factorio Mod: Package Mod as ZIP** `(Ctrl+Shift+P)`
- Создает `.zip` архив с текущим модом
- В архив включаются все файлы мода
- После упаковки автоматически открывается папка с архивом — удобно для публикации или тестирования

### 📝 JSON автодополнение и валидация
- Поддержка схемы `info.json`
- Автокомплит для:
  - `name`, `version`, `title`, `author`, `dependencies`, `description`
- Валидация на лету: типы, обязательные поля и допустимые значения.

---

## 📦 Установка и использование

### Установка из Marketplace

- Перейдите в **VS Code** → **Extensions** → Поиск: **Factorio Modding Tools**
- Установите расширение от **yourusername**

Или вручную:
```bash
code --install-extension factorio-modding-tools-0.0.1.vsix
```

Или через VS Code UI:  
**Extensions** → **Install from VSIX...**



### Использование

1. **Создание мода**:
   - Откройте палитру команд `Ctrl+Shift+P`
   - Введите `Create Mod Structure`
   - Введите имя вашего мода

2. **Lua автодополнение**:
   - В любом `.lua` файле начните вводить `type = "` — появятся предложения

3. **JSON автодополнение**:
   - Откройте `info.json`
   - Используйте автоподстановку и валидацию по схеме

4. **Автодополнение локализации**
   - Откройте `locale.cfg` или аналогичный файл
   - При вводе секций (`[item-name]`, `[recipe-name]`, и др.) выводятся подсказки и примеры
   - Внутри секций предлагаются ключи и значения

5. **Упаковка мода**
   - Вызовите команду `Package Mod as ZIP` из палитры
   - Готовый архив будет сохранён и доступен для открытия

---

## ⚙ Настройки расширения

> На текущий момент не имеет пользовательских настроек через `settings.json`.  
Всё поведение регулируется через правку исходников:

- `src/data.ts`
- `schemas/info.schema.json`

---

## 🐞 Известные проблемы

- Сниппеты покрывают только популярные поля
- Lua autocomplete срабатывает только при точном шаблоне `type = "`
- При создании модов с существующим именем может возникнуть конфликт (файл не перезаписывается)
- Некоторых прототипов может не быть
---


## 📝 История версий

### 0.0.1
- Команда Create Mod Structure
- Автокомплит `type = "..."` в Lua
- Поддержка и схема `info.json`

### 0.0.2
- Автозаполнение локализации
- Команда Package Mod as ZIP

### 0.1.0
- Добавлены все возможные прототипы (использовалось официальное API Factorion и файл `data-raw-dump.json`)
- Контекстное Lua автодополнение внутри `data:extend`
- Фильтрация уже введённых полей

### 0.1.1
- Добавлена возможность смены языка для подсказок автодополнения

---

## 📂 Лицензия

MIT

---

**Спасибо за использование _Factorio Modding Tools_!**  
_Удачи в разработке модов и автоматизации!_ 🤖
