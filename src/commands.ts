import * as npm from 'npm';
import * as vscode from 'vscode';

import { Dependencies, DependencyType } from './dependencies';
import { SCHEME } from './extension';

export class Commands {

  constructor(
    private dependencies: Dependencies,
  ) {
  }

  /* OPEN MANAGER PANE */

  public async openManager(uri?: vscode.Uri) {
    const editor = vscode.window.activeTextEditor;
    const document = editor.document || await vscode.workspace.openTextDocument(uri);
    uri = document.uri;
    console.log('[open]\t', uri.toString());
    return vscode.commands.executeCommand(
      'vscode.previewHtml',
      uri.with({ scheme: SCHEME }),
      vscode.ViewColumn.Two,
      'NPM GUI Manager',
    ).then(undefined,
      (reason) => {
        vscode.window.showErrorMessage(reason);
      },
    );
  }

  //------------------------------------------------------------------------------------
  // DEPENDENCIES
  //------------------------------------------------------------------------------------

  public async install() {
    npm.load((err, data) => {
      if (err) throw err;

      npm.commands.install([], (err, data) => {
        if (err) throw err;
      });

      npm.on('log', (message) => {
        console.log(message);
      });
    });
  }

  public async updateDependency({ uri, dependency }) {
    console.log('[upd]\t', uri);
    const schemeUri = vscode.Uri.parse(uri);
    const fileUri = schemeUri.with({ scheme: 'file' });
    const updated = this.dependencies.update(schemeUri, dependency);
    await Commands.WriteDocument(fileUri, updated);
  }

  public updateAllDependencies() {

  }

  public switchDependencyType(name: string, type: DependencyType) {

  }

  //------------------------------------------------------------------------------------
  // HELPERS
  //------------------------------------------------------------------------------------

  static async WriteDocument(uri: vscode.Uri, contents: string) {
    const document = await vscode.workspace.openTextDocument(uri);
    const edit = new vscode.WorkspaceEdit();
    edit.replace(uri, Commands.GetFullRange(document), contents);
    await vscode.workspace.applyEdit(edit);
    await document.save();
  }

  static GetFullRange(document: vscode.TextDocument) {
    return new vscode.Range(
      new vscode.Position(0, 0),
      document.lineAt(document.lineCount - 1).range.end,
    );
  }

  //------------------------------------------------------------------------------------
  // GETTERS
  //------------------------------------------------------------------------------------

  public get list(): vscode.Disposable[] {
    return [
      vscode.commands.registerCommand(`${SCHEME}.openManager`, this.openManager.bind(this)),
      vscode.commands.registerCommand(`${SCHEME}.install`, this.install.bind(this)),
      vscode.commands.registerCommand(`${SCHEME}.updateDependency`, this.updateDependency.bind(this)),
    ];
  }
}
