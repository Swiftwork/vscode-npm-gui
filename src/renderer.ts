
import { Observable } from 'rxjs/Observable';
import * as vscode from 'vscode';

import { Dependencies, IDependency } from './dependencies';
import { SCHEME } from './extension';

import * as View from './pane/view.hbs';

export class Renderer implements vscode.TextDocumentContentProvider {

  private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
  private _singleManagerSourceUri: vscode.Uri;
  private _nonce = new Date().getTime() + '' + new Date().getMilliseconds();

  constructor(
    private context: vscode.ExtensionContext,
    private dependencies: Dependencies,
  ) { }

  public async provideTextDocumentContent(uri: vscode.Uri) {
    console.log('[prov]\t', uri.toString());
    const document = await vscode.workspace.openTextDocument(uri.with({
      scheme: 'file',
    }));
    const contents = document.getText();
    const dependencies = await this.dependencies.checkDependencies(uri, contents);
    return this.render(uri, Array.from(dependencies.values()));
  }

  private render(uri: vscode.Uri, dependencies: IDependency[]) {
    const view = View({
      /* Functionality */
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
    console.log('[change]\t');
    return this._onDidChange.event;
  }

  public update(uri: vscode.Uri) {
    console.log('[fire]\t', uri.toString());
    this._onDidChange.fire(uri.with({ scheme: SCHEME }));
  }

  //------------------------------------------------------------------------------------
  // GETTERS
  //------------------------------------------------------------------------------------

}
