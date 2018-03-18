
import * as vscode from 'vscode';
import { SCHEME } from './extension';

export class Manager implements vscode.TextDocumentContentProvider {

  private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
  private _singleManagerSouceUri: vscode.Uri;

  constructor(
    private context: vscode.ExtensionContext,
  ) {

  }

  public provideTextDocumentContent(managerUri: vscode.Uri): string | Thenable<string> {
    const sourceUri = this._singleManagerSouceUri;

    // console.log('open manager for source: ' + sourceUri.toString())
    let initialLine: number;
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document.uri.fsPath === sourceUri.fsPath) {
      initialLine = editor.selection.active.line;
    }

    return vscode.workspace.openTextDocument(sourceUri).then(document => {
      const text = `<input value="test"/><code style="color: green"><pre>${document.getText()}</pre></code>`;
      return text;
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
    this._singleManagerSouceUri = uri;
    return managerUri;
  }

  //------------------------------------------------------------------------------------
  // GETTERS
  //------------------------------------------------------------------------------------

}