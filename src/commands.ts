import * as vscode from 'vscode';

import { Dependencies } from './dependencies';
import { SCHEME } from './extension';
import { DependencyType } from './interfaces';

export class Commands {

  constructor(
    private dependencies: Dependencies,
  ) {
  }

  /* OPEN MANAGER PANE */

  public openManager() {
    const editor = vscode.window.activeTextEditor;
    const document = editor.document;
    const uri = document.uri;
    console.log('open', uri);
    vscode.workspace.openTextDocument(uri).then(document => {
      return this.dependencies.checkDependencies(document.getText()).then(() => {
        return vscode.commands.executeCommand(
          'vscode.previewHtml',
          uri.with({ scheme: SCHEME }),
          vscode.ViewColumn.Two,
          'NPM GUI Manager',
        ).then((success) => {
        }, (reason) => {
          vscode.window.showErrorMessage(reason);
        });
      });
    });
  }

  //------------------------------------------------------------------------------------
  // DEPENDENCIES
  //------------------------------------------------------------------------------------

  public updateDependency() {
    console.log('update');
  }

  public updateAllDependencies() {

  }

  public switchDependencyType(name: string, type: DependencyType) {

  }

  //------------------------------------------------------------------------------------
  // GETTERS
  //------------------------------------------------------------------------------------

  public get list(): vscode.Disposable[] {
    return [
      vscode.commands.registerCommand(`${SCHEME}.openManager`, this.openManager.bind(this)),
      vscode.commands.registerCommand(`${SCHEME}.updateDependency`, this.updateDependency.bind(this)),
    ];
  }
}
