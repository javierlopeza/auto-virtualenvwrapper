const { PythonExtension } = require("@vscode/python-extension");
const vscode = require("vscode");
const fs = require("fs");
const os = require("os");
const path = require("path");

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  let pythonApi = await PythonExtension.api();
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor) {
    await setupPythonEnvironment(activeEditor, pythonApi);
  }

  let disposable = vscode.window.onDidChangeActiveTextEditor(async (editor) => {
    if (editor) {
      await setupPythonEnvironment(editor, pythonApi);
    }
  });

  context.subscriptions.push(disposable);
}

async function setupPythonEnvironment(editor, pythonApi) {
  let currentDirPath = path.dirname(editor.document.uri.fsPath);
  const root = path.parse(currentDirPath).root;

  // Get .virtualenvs path, replacing "~" with home dir if needed
  const virtualenvsPath = resolveHomeDir(
    vscode.workspace
      .getConfiguration()
      .get("auto-virtualenvwrapper.virtualenvsPath")
  );
  
  // Iterate upwards through directories
  while (currentDirPath !== root) {
    const currentDirName = path.basename(currentDirPath);
    const candidatePythonPath = path.join(
      virtualenvsPath,
      currentDirName,
      "bin",
      "python"
    );
    const currentPythonPath =
      pythonApi.environments.getActiveEnvironmentPath().path;
    // If the candidate Python path for the current directory exists
    // and it is different from the active one, we try switching to it
    if (
      fs.existsSync(candidatePythonPath) &&
      currentPythonPath !== candidatePythonPath
    ) {
      try {
        await pythonApi.environments.updateActiveEnvironmentPath(
          candidatePythonPath
        );
        vscode.window.showInformationMessage(
          `auto-virtualenvwrapper: interpreter set to: ${currentDirName}`
        );
      } catch (error) {
        vscode.window.showErrorMessage(
          `auto-virtualenvwrapper: error setting Python interpreter: ${error.message}`
        );
      }
      return;
    }

    currentDirPath = path.dirname(currentDirPath);
    if (currentDirPath === ".") {
      currentDirPath = "";
    }
  }
}

function resolveHomeDir(filepath) {
  if (filepath.startsWith('~')) {
    return path.join(os.homedir(), filepath.slice(1));
  }
  return filepath;
}

function deactivate() { }

module.exports = {
  activate,
  deactivate,
};
