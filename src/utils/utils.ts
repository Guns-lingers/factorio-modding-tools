import * as vscode from 'vscode';
import * as path from 'path';

export function getModName(): string | undefined {
  const folders = vscode.workspace.workspaceFolders;
  if (folders && folders.length > 0) {
    return path.basename(folders[0].uri.fsPath);
  }
  return undefined;
}
