import * as vscode from "vscode";
import { handler } from "./removeAllComments";

export function activate(context: vscode.ExtensionContext) {

  const disposable = vscode.commands.registerTextEditorCommand("remove-all-comments-javascript.removeAllComments", (textEditor:vscode.TextEditor, edit: vscode.TextEditorEdit) => {
    handler(textEditor, edit).removeComment(); 
  });

  vscode.window.showInformationMessage("Remove successfully!");

  context.subscriptions.push(disposable);
}
