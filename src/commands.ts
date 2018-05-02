import * as vscode from 'vscode';

import { Dependencies, DependencyType } from './dependencies';
import { SCHEME } from './extension';

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
    const schemedUri = uri.with({ scheme: SCHEME });
    console.log('open', uri);
    vscode.workspace.openTextDocument(uri).then(document => {
      return this.dependencies.checkDependencies(schemedUri, document.getText()).then(() => {
        return vscode.commands.executeCommand(
          'vscode.previewHtml',
          schemedUri,
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

  public updateDependency(dependency) {
    const editor = vscode.window.activeTextEditor;
    console.log(vscode.workspace.textDocuments);
    const document = editor.document;
    const uri = document.uri;
    const schemedUri = uri.with({ scheme: SCHEME });
    const updated = this.dependencies.update(schemedUri, dependency);
    const edit = new vscode.WorkspaceEdit();
    const entireRange = new vscode.Range(
      0,
      document.lineAt(0).range.start.character,
      document.lineCount - 1,
      document.lineAt(document.lineCount - 1).range.end.character,
    );
    edit.replace(uri, entireRange, updated);
    vscode.workspace.applyEdit(edit);
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
