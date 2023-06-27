import * as vscode from "vscode";
import { isSupportLanguageCheck, removeComment } from "./removeAllComments";

export function activate(context: vscode.ExtensionContext) {

  const disposable = vscode.commands.registerTextEditorCommand("remove-all-comments-javascript.removeAllComments", (textEditor:vscode.TextEditor) => {

    const isSupportLanguage: boolean = isSupportLanguageCheck(textEditor);

    if (!isSupportLanguage) {
      vscode.window.showErrorMessage("This language is not supported!");

      return;
    }

    removeComment(textEditor);
  });

  vscode.window.showInformationMessage("Remove successfully!");

  context.subscriptions.push(disposable);
}
