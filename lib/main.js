'use babel';

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions
import { CompositeDisposable } from 'atom';
import Path from 'path';
import * as helpers from 'atom-linter';

// Local vars
const regex = /(.+):(\d+)\t*(.+)/g;

// Settings
let executablePath;
let rulesetPath;

export default {
  activate() {
    require('atom-package-deps').install('linter-lightning');

    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      atom.config.observe('linter-lightning.executablePath', (value) => {
        executablePath = value;
      }
    ));
    this.subscriptions.add(
      atom.config.observe('linter-lightning.rulesets', (value) => {
        rulesetPath = value;
      }
    ));
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
      lint: async (textEditor) => {
        const filePath = textEditor.getPath();
        const fileText = textEditor.getText();



        const parameters = [
          "lightning:lint"
          filePath,
          '-j',
        ];

        if(rulesetPath !== null){
          parameters.push("--config "+rulesetPath);
        }

        console.log("filePath:");
        console.warn(filePath);
        debugger;
        const projectDir = atom.project.relativizePath(filePath)[0];
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
        // let match = regex.exec(output);
        // while (match !== null) {
        //   const line = Number.parseInt(match[2], 10) - 1;
        //   messages.push({
        //     type: 'Error',
        //     filePath: match[1],
        //     range: helpers.rangeFromLineNumber(textEditor, line),
        //     text: match[3],
        //   });
        //
        //   match = regex.exec(output);
        // }
        messages.push({
          type: 'Error',
          text: 'Something went wrong',
          range: [[0,0], [0,1]],
          filePath: editorPath
          }
        )
        return messages;
      },
    };
  },
};
