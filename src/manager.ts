
import * as vscode from 'vscode';

import { SCHEME } from './extension';
import { Renderer } from './renderer';

import { Style } from './assets/style';
import { View } from './assets/view';

export interface IDependency {
  name: string,
  version: string,
}

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
      const metadata = JSON.parse(document.getText());
      let html = View;
      const headIndex = html.indexOf('</head>');
      html = html.slice(0, headIndex) + `<style>${Style}</style>` + html.slice(headIndex);
      const bodyIndex = html.indexOf('</body>');
      for (const dependency in metadata.devDependencies) {
        const version = metadata.devDependencies[dependency];
        html = html.slice(0, bodyIndex) + Renderer.Dependency({ name: dependency, version: version }) + html.slice(bodyIndex);
      }
      return html;
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
