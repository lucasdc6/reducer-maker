#!/usr/bin/env node

const ff = require('node-find-folder');
const readline = require('readline');
const fs = require('fs');
const help = require('./lib/help');
const templates = require('./templates');
const mkdirp = require('mkdirp');

const program = process.argv[1].split("/").pop();

const opt = require('node-getopt');

var args = opt.create([
  ['r' , 'reducer=REDUCER+', 'Specify what reducer generate'],
  ['a' , 'all', 'Generate all reducers (CRUD).'],
  ['s' , 'state=REDUCER', 'Path to file with initial state (Check README.md)'],
])
.bindHelp()
.parseSystem();

if (args.options['all'] && args.options['reducer']) {
  console.log("Please, specify only --all or --reducer.");
  return;
}

const reducersNames = {
  actions: "actions",
  constants: "constants",
  reducers: "reducers",
  states: "state",
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

const scan_directory = function() {
  console.log("Scanning filesystem...\n");
  Object.keys(reducersNames).forEach(function(reducer, index) {
    console.log(`Searching ${reducer} directory`);

    ff_result = new ff(reducersNames[reducer], { nottraversal: ['dist'] });

    // No reducer directory found
    if (ff_result.length == 0) {
      console.log(`${reducer} not found\n`);
      reducersDir[reducer] = reducer;
    } else {
      reducersDir[reducer] = ff_result[0];
      console.log(`${reducer} found at '${ff_result}'\n`)
    }
  });
}

const make_reducers = function() {
  Object.keys(reducersDir).forEach(function(reducer) {
    let file = `${reducersDir[reducer]}/${args.argv[0]}${reducersSuffix[reducer]}.js`;
    let data = templates[`${reducer}Template`]({name: args.argv[0], directory: reducersDir});
    let file_path = file.split("/");
    file_path.pop();
    mkdirp(file_path[0], function (err) {
      if (err) console.error(err);
    });
    fs.writeFile(file, data, function(err) {
      if (err) {
        console.log("Error");
      }
      console.log(`Created file ${file}`);
    });
  });
}

scan_directory();
make_reducers();
