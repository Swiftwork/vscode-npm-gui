
import * as ncu from 'npm-check-updates';
import * as vscode from 'vscode';

import { SCHEME } from './extension';

import * as Style from './assets/style.css';
import * as View from './assets/view.hbs';

export class Manager implements vscode.TextDocumentContentProvider {

  private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
  private _singleManagerSourceUri: vscode.Uri;

  constructor(
    private context: vscode.ExtensionContext,
  ) {
  }

  public provideTextDocumentContent(managerUri: vscode.Uri): string | Thenable<string> {
    const sourceUri = this._singleManagerSourceUri;

    // console.log('open manager for source: ' + sourceUri.toString())
    let initialLine: number;
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document.uri.fsPath === sourceUri.fsPath) {
      initialLine = editor.selection.active.line;
    }

    return vscode.workspace.openTextDocument(sourceUri).then(document => {
      const contents = document.getText();
      const metadata = JSON.parse(contents);
      ncu.run({
        packageData: contents,
      }).then((upgraded) => {
        console.log(upgraded);
      }).catch((err) => {
        console.error(err);
      });
      return `<style>${Style}</style>\n${View(metadata)}`;
    });
  }

  get onDidChange(): vscode.Event<vscode.Uri> {
    return this._onDidChange.event;
  }

  public update(uri: vscode.Uri) {
    this._onDidChange.fire(uri);
  }

  //------------------------------------------------------------------------------------
  // HELPERS
  //------------------------------------------------------------------------------------

  static isPackageJson(document: vscode.TextDocument) {
    return document.fileName.endsWith('package.json') && document.uri.scheme !== SCHEME;
  }

  public getManagerUri(uri: vscode.Uri) {
    if (uri.scheme === SCHEME) {
      return uri;
    }
    const managerUri = uri.with({
      scheme: SCHEME,
      path: 'single-preview.rendered',
    });
    this._singleManagerSourceUri = uri;
    return managerUri;
  }

  //------------------------------------------------------------------------------------
  // GETTERS
  //------------------------------------------------------------------------------------

}
