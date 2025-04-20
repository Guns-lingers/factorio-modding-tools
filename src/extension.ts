import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as childProcess from 'child_process';
import AdmZip from 'adm-zip';

import { createStructure, defaultFactorioMod, StructureConfig } from './generateModStructure';
import { allTypes, prototypeFields } from './data';

export function activate(context: vscode.ExtensionContext) {

	const disposable = vscode.commands.registerCommand(
		'factorioModHelper.createModStructure',
		async () => {
		  const uri = await vscode.window.showOpenDialog({
			canSelectFolders: true,
			openLabel: 'Select Folder to Create Mod In'
		  });
		  if (!uri?.length) {
			vscode.window.showErrorMessage('No folder selected.');
			return;
		  }
	
		  const modRoot = uri[0].fsPath;
		  const modName = await vscode.window.showInputBox({
			prompt: 'Enter mod name',
			placeHolder: 'my-factorio-mod'
		  });
		  if (!modName) {
			vscode.window.showErrorMessage('Mod name is required.');
			return;
		  }
	
		  // Формируем конфиг и создаём структуру
		  const config: StructureConfig = {
			...defaultFactorioMod,
			rootName: modName
		  };
		  try {
			createStructure(modRoot, config);
	
			// Добавляем в рабочее пространство
			const folderUri = vscode.Uri.file(path.join(modRoot, modName));
			const wf = vscode.workspace.workspaceFolders || [];
			vscode.workspace.updateWorkspaceFolders(wf.length, 0, {
			  uri: folderUri, name: modName
			});
	
			vscode.window.showInformationMessage(
			  `Factorio mod structure created: ${modName}`
			);
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
			openLabel: 'Select mod folder to package'
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
		'"' // trigger on quote
	  );
	  context.subscriptions.push(provider);
}

export function deactivate() {}


class FactorioCompletionProvider implements vscode.CompletionItemProvider {
	provideCompletionItems(
	  document: vscode.TextDocument,
	  position: vscode.Position
	): vscode.ProviderResult<vscode.CompletionItem[]> {
	  const line = document.lineAt(position.line).text;
	  const prefix = line.slice(0, position.character);
	  if (!/type\s*=\s*"$/.test(prefix)) {
		return [];
	  }
	  return allTypes.map(typeName => {
		const item = new vscode.CompletionItem(
		  typeName,
		  vscode.CompletionItemKind.Value
		);
		item.insertText = new vscode.SnippetString(this.buildSnippet(typeName));
		// Исправленная строка с правильным экранированием бэктиков
		item.documentation = new vscode.MarkdownString(`Шаблон для прототипа \`${typeName}\``);
		return item;
	  });
	}
  
	private buildSnippet(typeName: string): string {
	  const fields = prototypeFields[typeName];
	  const lines: string[] = [`"${typeName}",`];
	  for (const [field, snippet] of Object.entries(fields)) {
		lines.push(`\t${field} = ${snippet},`);
	  }
	  const last = lines.length - 1;
	  lines[last] = lines[last].replace(/,$/, '');
	  return lines.join('\n');
	}
  }