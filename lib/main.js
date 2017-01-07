'use babel';

import {
    CompositeDisposable
} from 'atom';
import Path from 'path';
import * as helpers from 'atom-linter';

// Settings
let executablePath;
let rulesetPath;
let showErrorsOnly;
let failSilently;

export default {
    activate() {
        require('atom-package-deps')
            .install('linter-lightning');

        this.subscriptions = new CompositeDisposable();
        this.subscriptions.add(
            atom.config.observe('linter-lightning.executablePath', (value) => {
                executablePath = value;
            }));
        this.subscriptions.add(
            atom.config.observe('linter-lightning.rulesets', (value) => {
                rulesetPath = value;
            }));
        this.subscriptions.add(
            atom.config.observe('linter-lightning.showErrorsOnly', (value) => {
                showErrorsOnly = value;
            }));
        this.subscriptions.add(
            atom.config.observe('linter-lightning.failSilently', (value) => {
                showErrorsOnly = value;
            }));
    },

    deactivate() {
        this.subscriptions.dispose();
    },

    provideLinter() {
        return {
            name: 'Lightning-Linter',
            grammarScopes: ['source.js'],
            scope: 'file',
            lintOnFly: false,
            lint: async(textEditor) => {
                var filePath = textEditor.getPath();
                var backslashInFilePath = false;
                // win hack v 0.7.0
                // cmd.exe also understands / for directory paths; heroku lightning:lint  fails with
                // a path like C:\Users\myUser\ due to how cmd.exe /s /c + heroku handles escaping
                // of \ in Filepath String, hence the replacement
                if (filePath.includes("\\")){
                  filePath = filePath.replace(/\\/g,'/');
                  backslashInFilePath = true;
                }


                const filenameIndex = filePath.lastIndexOf("/");
                const filename = filePath.substring(filenameIndex + 1);
                const fileDirectory = filePath.substring(0, filenameIndex + 1);
                const fileText = textEditor.getText();
                const projectDir = atom.project.relativizePath(filePath)[0];

                const parameters = [
                    "lightning:lint",
                    fileDirectory,
                    "--files",
                    filename,
                    "-j"
                ];

                if (showErrorsOnly) {
                    parameters.push("--quiet");
                }

                //TODO: implement
                // if (rulesetPath.length > 0) {
                //     parameters.push("--config " + rulesetPath);
                // }

                 const options = {
                     throwOnStdErr : failSilently ? false: true,
                     ignoreExitCode: failSilently ? true : false,
                     cwd: projectDir || Path.dirname(filePath)
                 };

                const output = await helpers.exec(executablePath, parameters, options);

                if (textEditor.getText() !== fileText) {
                    console.warn('linter-lightning:: The file was modified since the ' +
                        'request was sent to check it. Since any results would no longer ' +
                        'be valid, they are not being updated. Please save the file ' +
                        'again to update the results.');
                    return null;
                }

                const messages = [];
                if (output && output.includes("ruleId")) {
                    var resultArray = JSON.parse(output);
                    for (var i = 0; i < resultArray[0].result.length; i++) {
                        var result = resultArray[0].result[i];
                        var fix = {};
                        if (result.fix) {
                            fix = {
                                range: fix.range,
                                newText: fix.Text
                            };
                        }
                        var type = "error";
                        if (result.severity === 1) {
                            type = "warning";
                        }
                        // win hack 0.7.0
                        // revert changes back
                        if(backslashInFilePath){
                          filePath = filePath.replace(/\//g,'\\');
                        }
                        messages.push({
                            type: type,
                            filePath: filePath,
                            range: helpers.rangeFromLineNumber(textEditor, result.line - 1),
                            text: result.message + " (" + result.ruleId + ")",
                            severity: type,
                            fix: fix
                        });
                    }
                }
                return messages;
            },
        };
    },
};;
