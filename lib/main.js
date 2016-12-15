'use babel';

import {
    CompositeDisposable
} from 'atom';
import Path from 'path';
import * as helpers from 'atom-linter';

// Local vars
const regex = /(.+):(\d+)\t*(.+)/g;

// Settings
let executablePath;
let rulesetPath;

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
                const filePath = textEditor.getPath();
                const filenameIndex = filePath.lastIndexOf("/");
                const filename = filePath.substring(filenameIndex + 1);
                const fileDirectory = filePath.substring(0, filenameIndex + 1);
                const fileText = textEditor.getText();
                const projectDir = atom.project.relativizePath(filePath)[0];

                console.log("@@@@@ProjectPath" + projectDir);
                const parameters = [
                    "lightning:lint",
                    fileDirectory,
                    "-j"
                ];

                // if (rulesetPath.trim()) {
                //     parameters.push("--config " + rulesetPath);
                // }

                const options = {
                    ignoreExitCode: true,
                    cwd: projectDir || Path.dirname(filePath),
                };
                const output = await helpers.exec(executablePath, parameters, options);

                if (textEditor.getText() !== fileText) {
                    // eslint-disable-next-line no-console
                    console.warn('linter-lightning:: The file was modified since the ' +
                        'request was sent to check it. Since any results would no longer ' +
                        'be valid, they are not being updated. Please save the file ' +
                        'again to update the results.');
                    return null;
                }

                const messages = [];

                var resultArray = JSON.parse(output);
                //
                // resultArray[0].result.length;
                //
                // var messages = [];
                // var lintResult = JSON.parse(output);
                //
                //
                for (var i = 0; i < resultArray[0].result.length; i++) {
                    var result = resultArray[0].result[i];
                    console.log(result.ruleId);
                    messages.push({
                        type: 'Error',
                        filePath: filePath,
                        range: helpers.rangeFromLineNumber(textEditor, result.line - 1),
                        text: result.message
                    });
                }
                //
                // var output = '';
                //
                //
                // messages.push({
                //        type: 'Error',
                //        filePath: filePath,
                //        range: helpers.rangeFromLineNumber(textEditor, lintResult.line),
                //        text: lintResult.message,
                //        });
                //

                // }
                //debugger;
                return messages;
            },
        };
    },
};;
