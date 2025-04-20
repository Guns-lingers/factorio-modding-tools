
# factorio-modding-tools  
_The Ultimate VS Code Extension for Factorio Modding_

[![VS Code](https://img.shields.io/badge/VSCODE-Extension-blue?logo=visualstudiocode)](https://marketplace.visualstudio.com/)
[![Status](https://img.shields.io/badge/status-in--development-yellow)](https://github.com/Guns-lingers/factorio-modding-tools)
[![Version](https://img.shields.io/badge/version-0.0.2-blue)](https://github.com/Guns-lingers/factorio-modding-tools/releases)
[![Last Commit](https://img.shields.io/github/last-commit/Guns-lingers/factorio-modding-tools)](https://github.com/yourusername/factorio-modding-tools/commits)
[![Stars](https://img.shields.io/github/stars/Guns-lingers/factorio-modding-tools?style=social)](https://github.com/yourusername/factorio-modding-tools/stargazers)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Language: Lua](https://img.shields.io/badge/language-Lua-blue.svg)](https://www.lua.org/)

> ⚠️ **Внимание**: Это расширение находится в активной разработке. Некоторые функции могут быть недоступны или работать нестабильно. Мы активно работаем над улучшением функциональности и будем рады вашим отзывам и предложениям.

**Factorio Modding Tools** — расширение для VS Code, упрощающее разработку модов для игры [Factorio](https://factorio.com/).
Позволяет одним кликом создать структуру мода, ускоряет работу с Lua-прототипами и улучшает редактирование `info.json`.

---

## 🚀 Features

### 🏗️ Create Mod Structure
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

### 🤠 Lua Autocomplete
- При вводе:
  ```lua
  type = "
  ```
  VS Code предлагает список прототипов (`item`, `recipe`, `technology` и др.)
- После выбора — вставляется шаблон с обязательными полями и плейсхолдерами.

### 🌐 Localization Autocomplete
- Автозаполнение для файлов локализации `.cfg`
- При вводе секции (`[item-name]`, `[recipe-name]` и др.) выводится описание и примеры ключ=значение.

### 🛠️ Package Mod as ZIP
- Команда **Factorio Mod: Package Mod as ZIP** (`Ctrl+Shift+P`)
- Упаковывает текущий мод в `.zip`, добавляет все файлы и открывает папку с архивом.

### 📝 JSON Autocomplete & Validation
- Поддержка схемы `info.json`
- Автокомплит для:
  - `name`, `version`, `title`, `author`, `dependencies`, `description`
- Валидация на лету: типы, обязательные поля и допустимые значения.

---

## 📦 Installation & Usage

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

---

## ⚙ Extension Settings

> На текущий момент не имеет пользовательских настроек через `settings.json`.  
Всё поведение регулируется через правку исходников:

- `src/data.ts`
- `schemas/info.schema.json`

---

## 🐞 Known Issues

- Сниппеты покрывают только популярные поля
- Lua autocomplete срабатывает только при точном шаблоне `type = "`
- При создании модов с существующим именем может возникнуть конфликт (файл не перезаписывается)
- Некоторых прототипов может не быть
---


## 📝 Release Notes

### 0.0.1
- Команда Create Mod Structure
- Автокомплит `type = "..."` в Lua
- Поддержка и схема `info.json`

### 0.0.2
- Автозаполнение локализации
---

## 📂 License

MIT

---

**Спасибо за использование _Factorio Modding Tools_!**  
_Удачи в разработке модов и автоматизации!_ 🤖
