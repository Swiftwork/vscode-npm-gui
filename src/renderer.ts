
import { Observable } from 'rxjs/Observable';
import * as vscode from 'vscode';

import { Dependencies } from './dependencies';
import { SCHEME } from './extension';
import { IDependencies, IDependency } from './interfaces';

import * as View from './pane/view.hbs';

export class Renderer implements vscode.TextDocumentContentProvider {

  private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
  private _singleManagerSourceUri: vscode.Uri;
  private _nonce = new Date().getTime() + '' + new Date().getMilliseconds();

  private _cached = new Map<string, { text: string, deps: IDependency[] }>();

  constructor(
    private context: vscode.ExtensionContext,
    private dependencies: Dependencies,
  ) { }

  public provideTextDocumentContent(uri: vscode.Uri): string | Thenable<string> {
    const id = uri.toString();
    console.log('provide', id);
    return vscode.workspace.openTextDocument(uri.with({
      scheme: 'file',
    })).then(document => {
      const contents = document.getText();
      if (!this._cached.get(id) || contents !== this._cached.get(id).text) {
        return this.dependencies.checkDependencies(contents).then((dependencies) => {
          console.log('fetch');
          dependencies = Array.from(dependencies.values());
          this._cached.set(id, { text: contents, deps: dependencies });
          return this.render(uri, dependencies);
        });
      } else {
        console.log('cached');
        return this.render(uri, this._cached.get(id).deps);
      }
    });
  }

  private render(uri: vscode.Uri, dependencies: IDependency[]) {
    const view = View({
      /* Functionallity */
      base: uri.toString(true),
      nonce: this._nonce,
      javascript: this.context.asAbsolutePath('dist/assets/pane.js'),
      css: this.context.asAbsolutePath('dist/assets/pane.css'),
      /* Render */
      dependencies: dependencies,
    });
    return view;
  }

  get onDidChange(): vscode.Event<vscode.Uri> {
    console.log('change');
    return this._onDidChange.event;
  }

  public update(uri: vscode.Uri) {
    console.log('update', uri);
    this._onDidChange.fire(uri.with({ scheme: SCHEME }));
  }

  //------------------------------------------------------------------------------------
  // GETTERS
  //------------------------------------------------------------------------------------

}
