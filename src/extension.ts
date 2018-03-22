'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import * as vscode from 'vscode';

import { Commands } from './commands';
import { Manager } from './manager';

export const SCHEME = 'npm-gui';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  // Create and register a new manager content provider
  const manager = new Manager(context);
  const commands = new Commands(manager);
  const managerRegistration = vscode.workspace.registerTextDocumentContentProvider(SCHEME, manager);

  context.subscriptions.push(...commands.list);
  context.subscriptions.push(managerRegistration);

  vscode.workspace.onDidChangeTextDocument((event: vscode.TextDocumentChangeEvent) => {
    if (Manager.isPackageJson(event.document)) {
      manager.update(event.document.uri);
    }
  });

  vscode.window.onDidChangeTextEditorSelection((event: vscode.TextEditorSelectionChangeEvent) => {
    if (Manager.isPackageJson(event.textEditor.document)) {
      const previewUri = manager.getManagerUri(event.textEditor.document.uri);
      manager.update(previewUri);
    }
  });
}

// this method is called when your extension is deactivated
export function deactivate() {
}
