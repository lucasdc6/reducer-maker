#!/usr/bin/env node

const ff = require('node-find-folder');
const readline = require('readline');
const fs = require('fs');
const help = require('./lib/help');
const templates = require('./templates');

const args = process.argv.slice(2);
const program = process.argv[1].split("/").pop();

if (!args[0]) {
  console.log("You need specify a recuder name");
  help(program);
  return;
}

const reducersNames = {
  actions: "reducers/actions",
  constants: "reducers/constants",
  reducers: "reducers/reducers",
  states: "reducers/states",
};

var reducersDir = {};

String.prototype.capitalize = function() {
  return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

const scan_directory = function() {
  console.log("Scanning filesystem...\n");
  Object.keys(reducersNames).forEach(function(reducer, index) {
    console.log(`Searching ${reducer} directory`);

    ff_result = new ff(reducersNames[reducer], { nottraversal: ['dest'] });

    // No reducer directory found
    if (ff_result.length == 0) {
      console.log(`${reducer} not found\n`);
    } else {
      reducersDir[reducer] = ff_result[0];
      console.log(`${reducer} found at '${ff_result}'\n`)
    }
  });
}

const make_reducers = function() {
  Object.keys(reducersDir).forEach(function(reducer) {
    let file = `${reducersDir[reducer]}/${args[0]}.js`;
    let data = templates[`${reducer}Template`]({name: args[0], directory: reducersDir});
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
