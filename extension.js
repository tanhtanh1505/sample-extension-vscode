const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const opn = require("opn");

function activate(context) {
  let disposable = vscode.commands.registerCommand("live-page.open", function () {
    const workspacePath = vscode.workspace.rootPath;
    if (!workspacePath) {
      vscode.window.showErrorMessage("Không tìm thấy đường dẫn thư mục đang làm việc!");
      return;
    }

    // Read all files in workspace
    fs.readdir(workspacePath, (err, files) => {
      if (err) {
        vscode.window.showErrorMessage("Đã xảy ra lỗi khi đọc thư mục: " + err.message);
        return;
      }

      // Get all html files
      const htmlFiles = files.filter((file) => path.extname(file) === ".html");
      if (htmlFiles.length === 0) {
        vscode.window.showWarningMessage("Không tìm thấy file HTML trong thư mục đang làm việc!");
        return;
      }

      //find config file in workspace name .livepage.json
      const configFiles = fs.readFileSync(path.join(workspacePath, "lpconfig.json"), "utf8");

      let configure = {
        path: `file://${workspacePath}`,
      };

      if (configFiles) {
        const config = JSON.parse(configFiles);

        configure = {
          path: config.path || "",
        };
      }

      // Show quick pick to select file
      const items = htmlFiles.map((file) => {
        return {
          label: file,
          description: "File HTML",
          detail: path.join(workspacePath, file),
        };
      });

      vscode.window.showQuickPick(items).then((selected) => {
        if (selected) {
          // Open file in editor and open in browser
          vscode.workspace.openTextDocument(selected.detail).then((document) => {
            vscode.window.showTextDocument(document);

            const url = `${configure.path}/${selected.label}`;
            opn(url);
          });
        }
      });
    });
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
