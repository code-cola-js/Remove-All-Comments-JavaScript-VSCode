import vscode = require("vscode");

const supportLanguage = [
  "javascript",
  "typescript",
  "javascriptreact",
  "typescriptreact",
];

const getFileInfo = (editor:vscode.TextEditor) => {
  const { document } = editor;

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
};

const formatFile = (editor:vscode.TextEditor) => {

  const { document } = editor;

  const { endLine } = getFileInfo(editor);

  editor.edit((edit) => {
    for (let line = 0; line < endLine; line++) {
      const currentLineText = document.lineAt(line);

      if (currentLineText.isEmptyOrWhitespace) {
        edit.delete(new vscode.Selection(new vscode.Position(line, 0), new vscode.Position(line + 1, 0)));
      }
    }
  });
};

export const removeComment = (editor:vscode.TextEditor) => {
  const { selection, startLine, endLine } = getFileInfo(editor);

  const { document } = editor;

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
    .then(() => formatFile(editor));
};


export const isSupportLanguageCheck = (editor: vscode.TextEditor): boolean => {
  const language = editor.document.languageId.toString();

  if (language) {
    return supportLanguage.includes(language);
  }

  return false;
};
