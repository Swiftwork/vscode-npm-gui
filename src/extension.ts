'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as vscode from 'vscode';

import { Commands } from './commands';
import { Dependencies } from './dependencies';
import { IDependencies } from './interfaces';
import { Renderer } from './renderer';

export const SCHEME = 'npm-gui';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('activate');

  // Create and register a new manager content provider
  const dependencies = new Dependencies();
  const commands = new Commands(dependencies);
  const renderer = new Renderer(context, dependencies);
  const rendererRegistration = vscode.workspace.registerTextDocumentContentProvider(SCHEME, renderer);

  context.subscriptions.push(...commands.list);
  context.subscriptions.push(rendererRegistration);

  vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
    if (isPackageJson(document)) {
      dependencies.checkDependencies(document.getText());
    }
  });
}

// this method is called when your extension is deactivated
export function deactivate() {
}

//------------------------------------------------------------------------------------
// HELPERS
//------------------------------------------------------------------------------------

export function isPackageJson(document: vscode.TextDocument) {
  return document.fileName.endsWith('package.json') && document.uri.scheme !== SCHEME;
}
