import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as childProcess from 'child_process';
import AdmZip from 'adm-zip';

import { createStructure, defaultFactorioMod, StructureConfig } from './generateModStructure';
import { ConfigCompletionProvider } from './configCompletion';

import * as prototypeFields from "./data/prototypes";  // added missing semicolon
const prototypeFieldsTyped: Record<string, Record<string, string>> = prototypeFields;
const allTypes: string[] = Object.keys(prototypeFieldsTyped);

export function activate(context: vscode.ExtensionContext) {
	console.log('[FMT] activate start, applying locale schema…');
	// Обновляем схему при старте
	applyLocaleSchema(context);

	// Перерегистрируем схему при изменении настройки
	vscode.workspace.onDidChangeConfiguration(e => {
	  if (e.affectsConfiguration('factorioModdingTools.suggestionLanguage')) {
		applyLocaleSchema(context);
	  }
	});



	const disposable = vscode.commands.registerCommand(
		'factorioModHelper.createModStructure',
		async () => {
		  const uri = await vscode.window.showOpenDialog({
			canSelectFolders: true,
			openLabel: 'Select Folder to Create Mod In',
		  });
		  if (!uri?.length) {
			vscode.window.showErrorMessage('No folder selected.');
			return;
		  }
	
		  const modRoot = uri[0].fsPath;
		  const modName = await vscode.window.showInputBox({
			prompt: 'Enter mod name',
			placeHolder: 'my-factorio-mod',
		  });
		  if (!modName) {
			vscode.window.showErrorMessage('Mod name is required.');
			return;
		  }
	
		  // Формируем конфиг и создаём структуру
		  const config: StructureConfig = {
			...defaultFactorioMod,
			rootName: modName,
		  };
		  try {
			createStructure(modRoot, config);
	
			// Добавляем в рабочее пространство
			const folderUri = vscode.Uri.file(path.join(modRoot, modName));
			const wf = vscode.workspace.workspaceFolders || [];
			vscode.workspace.updateWorkspaceFolders(wf.length, 0, {
			  uri: folderUri,
			  name: modName,
			});
	
			vscode.window.showInformationMessage(`Factorio mod structure created: ${modName}`);
		  } catch (err: any) {
			vscode.window.showErrorMessage(`Error: ${err.message}`);
		  }
		}
	  );
	  context.subscriptions.push(disposable);
	
	


	  const zipCommand = vscode.commands.registerCommand(
		'factorioModHelper.packageModAsZip',
		async () => {
		const uri = await vscode.window.showOpenDialog({
			canSelectFolders: true,
			openLabel: 'Select mod folder to package',
		});
		if (!uri?.length) {
			vscode.window.showErrorMessage('No folder selected.');
			return;
		}

		const modFolderPath = uri[0].fsPath;
		const modName = path.basename(modFolderPath);
		const zipFilePath = path.join(path.dirname(modFolderPath), `${modName}.zip`);

		try {
			const zip = new AdmZip();
			zip.addLocalFolder(modFolderPath);
			zip.writeZip(zipFilePath);

			vscode.window.showInformationMessage(`Mod packaged: ${zipFilePath}`);

			// Open the folder in the system's file explorer and select the ZIP file
			const folderToOpen = path.dirname(zipFilePath);
			const platform = process.platform;

			if (platform === 'win32') {
			childProcess.exec(`explorer.exe /select,"${zipFilePath}"`);
			} else if (platform === 'darwin') {
			childProcess.exec(`open "${folderToOpen}"`);
			} else {
			childProcess.exec(`xdg-open "${folderToOpen}"`);
			}
		} catch (err: any) {
			vscode.window.showErrorMessage(`Packaging error: ${err.message}`);
		}
		}
	);
	context.subscriptions.push(zipCommand);

	const provider = vscode.languages.registerCompletionItemProvider(
		{ language: 'lua', scheme: 'file' },
		new FactorioCompletionProvider(),
		'"', ',' // trigger on quote and comma
	  );
	context.subscriptions.push(provider);
	
	const providerconf = vscode.languages.registerCompletionItemProvider(
	{ pattern: '**/*.cfg', scheme: 'file' },
	new ConfigCompletionProvider(),
	'[' // trigger on '['
	);
	context.subscriptions.push(providerconf);
}

export function deactivate() {}


class FactorioCompletionProvider implements vscode.CompletionItemProvider {
	provideCompletionItems(
	  document: vscode.TextDocument,
	  position: vscode.Position
	): vscode.ProviderResult<vscode.CompletionItem[]> {
	  const line = document.lineAt(position.line).text;
	  const prefix = line.slice(0, position.character);
  
	  // получаем текст до курсора
	  const fullRange = new vscode.Range(new vscode.Position(0, 0), position);
	  const fullText = document.getText(fullRange);
  
	  // проверяем, что внутри data:extend({ … })
	  const extendIndex = fullText.lastIndexOf('data:extend');
	  if (extendIndex < 0) { return []; }
	  const slice = fullText.slice(extendIndex);
	  const openCount = (slice.match(/{/g) || []).length;
	  const closeCount = (slice.match(/}/g) || []).length;
	  if (openCount <= closeCount) { return []; }
  
	  const braceOpen = fullText.indexOf('{', extendIndex);
	  if (braceOpen < 0) { return []; }
  
	  // 1) сразу после type = " — только список типов
	  if (/type\s*=\s*"$/.test(prefix)) {
		return allTypes.map((typeName: string) => {
		  const item = new vscode.CompletionItem(typeName, vscode.CompletionItemKind.Value);
		  item.insertText = new vscode.SnippetString(`${typeName}"$0`);
		  item.documentation = new vscode.MarkdownString(`Прототип \`${typeName}\``);
		  return item;
		});
	  }
  
	  // 2) после того как type указан — поля
	  const allTypeMatches = Array.from(fullText.matchAll(/type\s*=\s*"([^"}]+)"/g));
	  if (allTypeMatches.length === 0) { return []; }
	  const lastMatch = allTypeMatches[allTypeMatches.length - 1];
	  const typeName = lastMatch[1];
	  const fields = prototypeFieldsTyped[typeName];
	  if (!fields) { return []; }
  
	  // триггер для полей: либо чистый отступ, либо отступ + первые буквы поля
	  if (!/^[ \t]*$/.test(prefix) && !/^[ \t]*[A-Za-z_][A-Za-z0-9_]*$/.test(prefix)) { return []; }
  
	  const tableText = fullText.slice(braceOpen);
	  const existing = Array.from(tableText.matchAll(/(\w+)\s*=/g)).map(m => m[1]);
  
	  return Object.entries(fields)
		.filter(([field]) => !existing.includes(field))
		.map(([field, snippet]: [string, string]) => {
		  const ci = new vscode.CompletionItem(field, vscode.CompletionItemKind.Property);
		  ci.insertText = new vscode.SnippetString(`${field} = ${snippet},$0`);
		  ci.documentation = new vscode.MarkdownString(`Поле \`${field}\` для \`${typeName}\``);
		  return ci;
		});
	}
  }
  
async function applyLocaleSchema(ctx: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('factorioModdingTools');
  const lang = config.get<string>('suggestionLanguage', 'en');
  const schemaFile = lang === 'ru'
    ? ctx.asAbsolutePath('schemas/info.ru.schema.json')
    : ctx.asAbsolutePath('schemas/info.schema.json');

  console.log('[FMT] applyLocaleSchema → lang =', lang, ', schemaFile =', schemaFile);

  // Выбор места записи: WORKSPACE если есть открытая папка, иначе GLOBAL
  const target = vscode.workspace.workspaceFolders?.length
    ? vscode.ConfigurationTarget.Workspace
    : vscode.ConfigurationTarget.Global;

  const jsonConfig = vscode.workspace.getConfiguration('json');
  const schemas = jsonConfig.get<any[]>('schemas', []);
  const newEntry = { fileMatch: ['info.json'], url: vscode.Uri.file(schemaFile).toString() };
  const filtered = schemas.filter(s => !s.fileMatch?.includes('info.json'));

  try {
    await jsonConfig.update('schemas', [...filtered, newEntry], target);
    console.log('[FMT] json.schemas updated in', target === vscode.ConfigurationTarget.Workspace ? 'WORKSPACE' : 'GLOBAL');
  } catch (err) {
    console.warn('[FMT] Failed to update json.schemas:', err);
    // не перебрасываем — просто логируем ошибку
  }
}
