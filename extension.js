const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const opn = require("opn");

function activate(context) {
  let disposable = vscode.commands.registerCommand("live-page.open", function () {
    let editor = vscode.window.activeTextEditor;
    if (editor.document.languageId === "html") {
      let fileUri = vscode.Uri.file(editor.document.fileName);
      console.log(fileUri);
      let url = fileUri.path;
      opn(url);
    } else {
      vscode.window.showInformationMessage("Please open an HTML file to open in browser.");
    }
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
