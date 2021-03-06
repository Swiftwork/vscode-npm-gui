'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as vscode from 'vscode';

import { Commands } from './commands';
import { Dependencies } from './dependencies';
import { Renderer } from './renderer';

/* Assets included in bundle */
import './pane/script.js';
import './pane/style.css';

export const SCHEME = 'npm-gui';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  // Create and register a new manager content provider
  const dependencies = new Dependencies();
  const commands = new Commands(dependencies);
  const renderer = new Renderer(context, dependencies);
  const rendererRegistration = vscode.workspace.registerTextDocumentContentProvider(SCHEME, renderer);

  context.subscriptions.push(...commands.list);
  context.subscriptions.push(rendererRegistration);

  vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
    console.log('[save]\t', document.uri.toString());
    if (validFile(document)) {
      //dependencies.checkDependencies(document.getText());
      renderer.update(document.uri);
    }
  });
}

// this method is called when your extension is deactivated
export function deactivate() {
}

//------------------------------------------------------------------------------------
// HELPERS
//------------------------------------------------------------------------------------

export function validFile(document: vscode.TextDocument) {
  return document.fileName.endsWith('package.json') && document.uri.scheme !== SCHEME;
}
