
import { Observable } from 'rxjs/Observable';
import * as vscode from 'vscode';

import { Dependencies } from './dependencies';
import { SCHEME } from './extension';
import { IDependencies, IDependency } from './interfaces';

import * as Script from './pane/script.mjs';
import * as Style from './pane/style.css';
import * as View from './pane/view.hbs';

export class Renderer implements vscode.TextDocumentContentProvider {

  private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
  private _singleManagerSourceUri: vscode.Uri;
  private _nonce = new Date().getTime() + '' + new Date().getMilliseconds();

  private _dependencies: Map<string, IDependency>;
  private _uri: vscode.Uri;

  constructor(
    private context: vscode.ExtensionContext,
    private dependencies: Dependencies,
  ) {
    dependencies.map.subscribe((dependencies) => {
      if (!dependencies) return;
      console.log(dependencies);
      this._dependencies = dependencies;
      this.update(this._uri);
    });
  }

  public provideTextDocumentContent(uri: vscode.Uri): string | Thenable<string> {
    console.log('provide', uri);
    this._uri = uri;
    /*return vscode.workspace.openTextDocument(uri.with({
      scheme: 'file',
    })).then(document => {
      const contents = document.getText();
      const metadata = JSON.parse(contents);
      */
    const dependencies = this._dependencies ? Array.from(this._dependencies.values()) : [];
    const view = View({
      base: uri.toString(true),
      nonce: this._nonce,
      script: this.context.asAbsolutePath(Script),
      style: this.context.asAbsolutePath(Style),
      dependencies: dependencies,
    });
    return view;
    //});
  }

  get onDidChange(): vscode.Event<vscode.Uri> {
    console.log('change');
    return this._onDidChange.event;
  }

  public update(uri: vscode.Uri) {
    console.log('update', uri);
    this._onDidChange.fire(uri);
  }

  //------------------------------------------------------------------------------------
  // GETTERS
  //------------------------------------------------------------------------------------

}
