
# factorio-modding-tools  
_The Ultimate VS Code Extension for Factorio Modding_

🌐 **Languages**: [English](README.md) | [Русский](README.ru.md)

[![VS Code](https://img.shields.io/badge/VSCODE-Extension-blue?logo=visualstudiocode)](https://marketplace.visualstudio.com/)
[![Status](https://img.shields.io/badge/status-in--development-yellow)](https://github.com/Guns-lingers/factorio-modding-tools)
[![Version](https://img.shields.io/badge/version-0.1.0-blue)](https://github.com/Guns-lingers/factorio-modding-tools/releases)
[![Last Commit](https://img.shields.io/github/last-commit/Guns-lingers/factorio-modding-tools)](https://github.com/Guns-lingers/factorio-modding-tools/commits)
[![Stars](https://img.shields.io/github/stars/Guns-lingers/factorio-modding-tools?style=social)](https://github.com/Guns-lingers/factorio-modding-tools/stargazers)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Language: Lua](https://img.shields.io/badge/language-Lua-blue.svg)](https://www.lua.org/)\
[![Join our Discord server](https://invidget.switchblade.xyz/W9DMUwKhv7)](https://discord.gg/W9DMUwKhv7)


> ⚠️ **Attention**: This extension is under active development. Some features may be unavailable or unstable. We’re working hard to improve functionality and welcome your feedback and suggestions.

**Factorio Modding Tools** is a VS Code extension that simplifies mod development for the game [Factorio](https://factorio.com/).
It allows one-click mod structure generation, speeds up work with Lua prototypes, and enhances editing of `info.json`.

---

## 🚀 Features

### 🏗️ Create Mod Structure
- Command **Factorio Mod: Create Mod Structure** (`Ctrl+Shift+P`)
- Automatically generates the standard mod folder structure:
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
- **Only inside** `data:extend({ … })` blocks  
- Typing `type = "` instantly shows **all** prototype types (from `prototypes/index.ts`)  
- After picking a type and moving to a **new line**, suggests **only** the fields for that type **that you haven’t already entered**  

### 🌐 Localization Autocomplete
- Autocomplete support for `.cfg` localization files.
- When typing a section (e.g., `[item-name]`, `[recipe-name]` etc.) helpful examples and syntax hints are displayed.
- Keys and values are suggested to streamline translation work and reduce errors.

### 🛠️ Package Mod as ZIP
- Command **Factorio Mod: Package Mod as ZIP** (`Ctrl+Shift+P`)
- Packages the current mod into a `.zip` archive, includes all files, and opens the folder with the archive.

### 📝 JSON Autocomplete & Validation
- Built-in support for `info.json` schema
- Autocompletion for fields like:
  - `name`, `version`, `title`, `author`, `dependencies`, `description`
- Real-time validation for field types, required fields, and allowed values.

---

## 📦 Installation & Usage

### Installing from Marketplace

- Go to **VS Code** → **Extensions** → Search for: **Factorio Modding Tools**
- Install the extension by **yourusername**

Or install manually:
```bash
code --install-extension factorio-modding-tools-0.0.1.vsix
```

Or via VS Code UI:
**Extensions** → **Install from VSIX...**



### How to Use

1. **Create a new mod**:
   - Open Command Palette `Ctrl+Shift+P`
   - Type  `Create Mod Structure`
   - Enter the name of your mod

2. **Lua autocomplete:**:
   - In any `.lua` file, start typing `type = "` to see prototype suggestions

3. **JSON autocomplete:**:
   - Open `info.json`
   - Use autocomplete and validation based on the built-in schema

4. **Localization autocomplete:**:
   - Open `locale.cfg` or other localization files
   - Start typing section headers like `[item-name]`, and get key suggestions with syntax tips

5. **Package your mod:**:
   - Use `Package Mod as ZIP` from Command Palette to generate a distributable archive

---

## ⚙ Extension Settings

> Currently, there are no configurable settings via `settings.json`.  
Behavior can be adjusted via source code:

- `src/data.ts`
- `schemas/info.schema.json`

---

## 🐞 Known Issues

- Snippets only cover popular prototype fields
- Lua autocomplete works only with exact match `type = "`
- Creating a mod with an existing name may cause a conflict (files are not overwritten)
- Some prototypes may be missing
---


## 📝 Release Notes

### 0.0.1
- Create Mod Structure command
- `type = "..."` autocomplete in Lua
- `info.json` schema support

### 0.0.2
- Localization autocomplete
- Package Mod as ZIP command

### 0.1.0
- Full prototype field coverage (from Factorio’s data-raw dump)
- Context-aware Lua completion inside `data:extend`
- Filtering out fields you’ve already entered

### 0.1.1
- Added the ability to switch the language for autocomplete suggestions

---

## 📂 License

MIT

---

**Thanks for using _Factorio Modding Tools_!**  
_Happy modding and automating!_ 🤖
