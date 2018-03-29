'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import * as ncu from 'npm-check-updates';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as vscode from 'vscode';

import { Commands } from './commands';
import { IDependencies } from './interfaces';
import { Manager } from './manager';

export const SCHEME = 'npm-gui';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('activate');
  const _updates = new BehaviorSubject<IDependencies>(null);
  const updates = _updates.asObservable();

  // Create and register a new manager content provider
  const manager = new Manager(context, updates);
  const commands = new Commands(manager);
  const managerRegistration = vscode.workspace.registerTextDocumentContentProvider(SCHEME, manager);

  context.subscriptions.push(...commands.list);
  context.subscriptions.push(managerRegistration);

  vscode.workspace.onDidChangeTextDocument((event: vscode.TextDocumentChangeEvent) => {
    if (Manager.isPackageJson(event.document)) {
      const previewUri = manager.getManagerUri(event.document.uri);
      manager.update(previewUri);
    }
  });
}

function checkUpdates(contents?: string): Promise<IDependencies> {
  return ncu.run({
    packageFile: !contents ? 'package.json' : undefined,
    packageData: contents ? contents : undefined,
  });
}

// this method is called when your extension is deactivated
export function deactivate() {
}
