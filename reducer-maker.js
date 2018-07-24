#!/usr/bin/env node

const ff = require('node-find-folder');
const readline = require('readline');
const fs = require('fs');
const help = require('./lib/help');
const templates = require('./templates');
const mkdirp = require('mkdirp');
const pluralize = require('pluralize');

const opt = require('node-getopt');

var args = opt.create([
  ['r' , 'reducer=REDUCER+', 'Specify what reducer generate'],
  ['s' , 'state=REDUCER', 'Path to file with initial state (Check README.md)'],
  ['d', 'directory=DIR', 'Path to reducers, if not found'],
  ['f', 'force', 'Force the write.'],
])
.bindHelp()
.parseSystem();

if (!args.options['reducer']) {
  reducers = {
    add: true,
    read: true,
    list: true,
    update: true,
    delete: true,
  };
} else {
  reducers = {};
  args.options['reducer'].forEach((elem) => reducers[elem] = true);
}

const reducersNames = {
  actions: "actions",
  constants: "constants",
  reducers: "reducers",
  states: "states",
};

const reducersSuffix = {
  actions: "-actions",
  constants: ".constants",
  reducers: "",
  states: "-state",
}

var reducersDir = {};

String.prototype.capitalize = function() {
  return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

const scanDirectory = function() {
  console.log("Scanning filesystem...\n");
  Object.keys(reducersNames).forEach(function(reducer, index) {
    console.log(`Searching ${reducer} directory`);

    ff_result = new ff(reducersNames[reducer], { nottraversal: ['dist'] });

    // No reducer directory found
    if (ff_result.length == 0) {
      console.log(`${reducer} not found`);
      if (args.options['directory']) {
        console.log(`Directory setted to ${args.options['directory']}\n`);
        reducersDir[reducer] = args.options['directory'] + `/${reducer}`;
      } else {
        console.log(`Directory setted to ${reducer}\n`);
        reducersDir[reducer] = reducer;
      }
    } else {
      reducersDir[reducer] = ff_result[0];
      console.log(`${reducer} found at '${ff_result}'\n`)
    }
  });
}

const makeReducers = function(reducerName) {
  Object.keys(reducersDir).forEach(function(reducer) {
    reducerName = pluralize.plural(reducerName);
    let file = `${reducersDir[reducer]}/${reducerName}${reducersSuffix[reducer]}.js`;
    let data = templates[`${reducer}Template`]({name: reducerName, directory: reducersDir, reducers});
    let file_path = file.split("/");
    file_path.pop();
    file_path = file_path.join("/");
    mkdirp(file_path, function (err) {
      if (err) console.error(err);
    });
    if (fs.existsSync(file) && !args.options['f']) {
      throw new Error(`Reducers already exists (${file}) - You can force using the flag --force`)
    } else {
      fs.writeFile(file, data, function(err)   {
        if (err) {
          console.error(`Error generating file ${file}`);
          return;
        }
        console.log(`Created file ${file}`);
      });
    }
  });
}

scanDirectory();
try {
  args.argv.forEach(makeReducers);
} catch(err) {
  console.log(err.message)
}
