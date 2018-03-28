import * as vscode from 'vscode';

import { SCHEME } from './extension';
import { DependencyType } from './interfaces';
import { Manager } from './manager';

export class Commands {

  constructor(
    private manager: Manager,
  ) {
  }

  /* OPEN MANAGER PANE */

  public openManager(uri?: vscode.Uri) {
    let resource = uri;
    if (!(resource instanceof vscode.Uri)) {
      if (vscode.window.activeTextEditor) {
        resource = vscode.window.activeTextEditor.document.uri;
      }
    }
    const managerUri = this.manager.getManagerUri(resource);
    return vscode.commands.executeCommand(
      'vscode.previewHtml',
      managerUri,
      vscode.ViewColumn.Two,
      'NPM GUI Manager',
    ).then((success) => {
    }, (reason) => {
      vscode.window.showErrorMessage(reason);
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
