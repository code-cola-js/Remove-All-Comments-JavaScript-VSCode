import vscode = require("vscode");

export function handler(editor: vscode.TextEditor) {
  const { document } = editor;

  function getFileInfo() {
    const selections = [
      new vscode.Selection(new vscode.Position(0, 0), document.positionAt(document.getText().length)),
    ];
    const selection = selections[0];
    const startLine = selection.start.line;
    const endLine = selection.end.line;

    return {
      selection,
      startLine,
      endLine
    };
  }

  function removeComment() {
    const { selection, startLine, endLine } = getFileInfo();

    editor
      .edit((edit) => {
        edit.replace(new vscode.Range(new vscode.Position(startLine, 0), new vscode.Position(endLine, selection.end.character)), document
          .getText()
          .replace(/\/\*(?<=\/\*)[^\/\*]{0,}?(?=\*\/)\*\//g, "")
          .replace(/(?<=.*".*".*)\s*\/\/\s*.*|\s*(?<!".*)\/\/\s*.*/g, "")
          .replace(/(?<!(('|"|`).*))\/\*(.*)\*\//g, "")
          .replace(/\/\*(\s*\n.*[^\/\*])+(\*\/)$/gm, "")
          .replace(/(\/\*\*|\/\*)(\s*|.*\n\s*\*.*)*(\/)$/gm, ""));
      })
      .then(formatFile);
  }

  function formatFile() {
    const { endLine } = getFileInfo();

    editor.edit((edit) => {
      for (let line = 0; line < endLine; line++) {
        const currentLineText = document.lineAt(line);

        if (currentLineText.isEmptyOrWhitespace) {
          edit.delete(new vscode.Selection(new vscode.Position(line, 0), new vscode.Position(line + 1, 0)));
        }
      }
    });
  }

  const supportLanguage = [
    "javascript",
    "typescript",
    "javascriptreact",
    "typescriptreact",
  ];
  const language = editor.document.languageId.toString();

  return {
    isSupportLanguage: !!supportLanguage.find((_supportLanguage) => _supportLanguage === language),
    removeComment,
  };
}
