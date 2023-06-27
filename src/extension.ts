import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {

  const disposable = vscode.commands.registerCommand("remove-all-comments-javascript.removeAllComments", () => {
    vscode.window.showInformationMessage("Hello World from remove-all-comments-jsOrTs!");
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
