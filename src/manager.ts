
import * as vscode from 'vscode';

import { SCHEME } from './extension';

import { Observable } from 'rxjs/Observable';
import { IDependencies } from './interfaces';
import * as Script from './pane/script.mjs';
import * as Style from './pane/style.css';
import * as View from './pane/view.hbs';

export class Manager implements vscode.TextDocumentContentProvider {

  private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
  private _singleManagerSourceUri: vscode.Uri;
  private _nonce = new Date().getTime() + '' + new Date().getMilliseconds();

  constructor(
    private context: vscode.ExtensionContext,
    private updates: Observable<IDependencies>,
  ) {
  }

  public provideTextDocumentContent(managerUri: vscode.Uri): string | Thenable<string> {
    console.log('provide');
    const sourceUri = this._singleManagerSourceUri;

    let initialLine: number;
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document.uri.fsPath === sourceUri.fsPath) {
      initialLine = editor.selection.active.line;
    }

    return vscode.workspace.openTextDocument(sourceUri).then(document => {
      const contents = document.getText();
      const metadata = JSON.parse(contents);

      const view = View({
        base: document.uri.with({ scheme: SCHEME }).toString(true),
        nonce: this._nonce,
        script: this.context.asAbsolutePath(Script),
        style: this.context.asAbsolutePath(Style),
        package: metadata,
      });
      return view;
    });
  }

  get onDidChange(): vscode.Event<vscode.Uri> {
    console.log('change');
    return this._onDidChange.event;
  }

  public update(uri: vscode.Uri) {
    console.log('update');
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
