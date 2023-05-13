const vscode = require("vscode");
const opn = require("opn");

function activate(context) {
  let disposable = vscode.commands.registerCommand("live-page.open", function () {
    let editor = vscode.window.activeTextEditor;
    if (editor.document.languageId === "html" || editor.document.languageId === "php") {
      let fileUri = vscode.Uri.file(editor.document.fileName);

      let url = fileUri.path;

      const urlSetting = vscode.workspace.getConfiguration().get("livePage");
      if (urlSetting && urlSetting.oldPath && urlSetting.oldPath !== "" && urlSetting.newPath && urlSetting.newPath !== "") {
        console.log(urlSetting.oldPath, urlSetting.newPath);
        console.log(url);
        url = url.replace(urlSetting.oldPath, urlSetting.newPath);
        console.log(url);
      }
      vscode.window.showInformationMessage("Opening " + url + " in browser.");

      opn(url).catch((err) => {
        console.log(err);
      });
    } else {
      vscode.window.showInformationMessage("Please open an HTML or PHP file to open in browser.");
    }
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
