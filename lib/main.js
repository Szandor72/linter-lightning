'use babel';

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions
import { CompositeDisposable } from 'atom';
import Path from 'path';
import * as helpers from 'atom-linter';

// Local vars
const regex = /(.+):(\d+)\t*(.+)/g;

// Settings
let executablePath;
let rulesets;

export default {
  activate() {
    require('atom-package-deps').install('linter-phpmd');

    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      atom.config.observe('linter-phpmd.executablePath', (value) => {
        executablePath = value;
      }
    ));
    this.subscriptions.add(
      atom.config.observe('linter-phpmd.rulesets', (value) => {
        rulesets = value;
      }
    ));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter() {
    return {
      name: 'PHPMD',
      grammarScopes: ['text.html.php', 'source.php'],
      scope: 'file',
      lintOnFly: false,
      lint: async (textEditor) => {
        const filePath = textEditor.getPath();
        const fileText = textEditor.getText();

        let ruleset = rulesets;
        if (/^[a-z0-9]+\.xml$/gi.test(rulesets)) {
          const rulesetPath = await helpers.findAsync(filePath, rulesets);
          if (rulesetPath !== null) {
            ruleset = rulesetPath;
          }
        }

        const parameters = [
<<<<<<< HEAD
          "lightning:lint",
          filePath,
          "-j"
        ];

        if(rulesetPath !== null){
          parameters.push("--config "+rulesetPath);
        }

        console.log("filePath:");
        console.warn(filePath);
=======
          filePath,
          'text',
          ruleset,
        ];

>>>>>>> parent of f8a4467... Initial Commit
        const projectDir = atom.project.relativizePath(filePath)[0];
        const options = {
          ignoreExitCode: true,
          cwd: projectDir || Path.dirname(filePath),
        };
debugger;
        const output = await helpers.exec(executablePath);

        if (textEditor.getText() !== fileText) {
          // eslint-disable-next-line no-console
          console.warn('linter-phpmd:: The file was modified since the ' +
            'request was sent to check it. Since any results would no longer ' +
            'be valid, they are not being updated. Please save the file ' +
            'again to update the results.');
          return null;
        }

        const messages = [];
<<<<<<< HEAD
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
              //         var string = "[ { \"file\": \"C:\", \"result\": [ { \"ruleId\": \"no-console\", \"severity\": 2, \"message\": \"Unexpected console statement.\", \"line\": 9, \"column\": 9, \"nodeType\": \"MemberExpression\", \"source\": \" console.log('Convert Custom Apex Type to Component!');\" }, { \"ruleId\": \"comma-spacing\", \"severity\": 1, \"message\": \"A space is required after ','.\", \"line\": 11, \"column\": 64, \"nodeType\": \"Punctuator\", \"source\": \" helper.convertColumnsToDesignColumnComponents(component,columns);\", \"fix\": { \"range\": [ 451, 451 ], \"text\": \" \" } }, { \"ruleId\": \"no-unused-vars\", \"severity\": 1, \"message\": \"'helper' is defined but never used\", \"line\": 13, \"column\": 49, \"nodeType\": \"Identifier\", \"source\": \" onClickLogButton : function(component, event, helper){\" }, { \"ruleId\": \"no-console\", \"severity\": 2, \"message\": \"Unexpected console statement.\", \"line\": 14, \"column\": 9, \"nodeType\": \"MemberExpression\", \"source\": \" console.log('$A.log does not work!');\" }, { \"ruleId\": \"no-debugger\", \"severity\": 2, \"message\": \"Unexpected 'debugger' statement.\", \"line\": 15, \"column\": 9, \"nodeType\": \"DebuggerStatement\", \"source\": \" debugger;\" } ] } ]";
              //
              // var resultArray = JSON.parse(string);
              //
              // resultArray[0].result.length;
              //
              // var messages = [];
              // var lintResult = JSON.parse(output);
              //
              //
              // for(var i = 0; i < resultArray[0].result.length; i++){
              //   var result = resultArray[0].result[i];
              //   console.log(result.ruleId);
              // }
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
        messages.push({
          type: 'Error',
          text: output,
          range: [[0,0], [0,1]],
          filePath: editorPath
          }
        )
=======
        let match = regex.exec(output);
        while (match !== null) {
          const line = Number.parseInt(match[2], 10) - 1;
          messages.push({
            type: 'Error',
            filePath: match[1],
            range: helpers.rangeFromLineNumber(textEditor, line),
            text: match[3],
          });

          match = regex.exec(output);
        }
>>>>>>> parent of f8a4467... Initial Commit
        return messages;
      },
    };
  },
};
