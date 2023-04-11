const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const opn = require("opn");

function activate(context) {
  let disposable = vscode.commands.registerCommand("sample-extension-of-tanh.helloWorld", function () {
    const workspacePath = vscode.workspace.rootPath;
    if (!workspacePath) {
      vscode.window.showErrorMessage("Không tìm thấy đường dẫn thư mục đang làm việc!");
      return;
    }

    // Đọc nội dung của thư mục
    fs.readdir(workspacePath, (err, files) => {
      if (err) {
        vscode.window.showErrorMessage("Đã xảy ra lỗi khi đọc thư mục: " + err.message);
        return;
      }

      // Lọc ra các file có phần mở rộng là .html
      const htmlFiles = files.filter((file) => path.extname(file) === ".html");

      if (htmlFiles.length === 0) {
        vscode.window.showWarningMessage("Không tìm thấy file HTML trong thư mục đang làm việc!");
        return;
      }

      // Mở QuickPick để chọn file HTML
      const items = htmlFiles.map((file) => {
        return {
          label: file,
          description: "File HTML",
          detail: path.join(workspacePath, file),
        };
      });

      vscode.window.showQuickPick(items).then((selected) => {
        if (selected) {
          // Mở tài liệu văn bản cho file HTML đã chọn
          vscode.workspace.openTextDocument(selected.detail).then((document) => {
            vscode.window.showTextDocument(document);
            // Mở trang web trong trình duyệt mặc định
            opn(`file://${selected.detail}`);
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
