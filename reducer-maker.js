#!/usr/bin/env node

const ff = require('node-find-folder');
const fs = require('fs');
const mkdirp = require('mkdirp');
const pluralize = require('pluralize');
const getopt = require('node-getopt');
const pjson = require('./package.json');

const templates = require('./templates');

const program = process.argv[1].split("/").pop();

var args = new getopt([
  ['r' , 'reducer=REDUCER+', 'Specify what reducer generate (CRUD)'],
  ['s' , 'state=JSON', 'Path to file with initial state in json format'],
  ['f', 'force', 'Force the execution'],
  ['w', 'workingdir=WD', 'Change working directory'],
  ['', 'examples', 'Show path to examples'],
  ['', 'actions-suffix=SUFFIX', 'Change action file suffix'],
  ['', 'constants-suffix=SUFFIX', 'Change constants file suffix'],
  ['', 'reducers-suffix=SUFFIX', 'Change reducers file suffix'],
  ['', 'states-suffix=SUFFIX', 'Change states file suffix'],
]);


args.setHelp(
  `Usage: node ${program} [OPTION]

[[OPTIONS]]

Npm: https:\/\/www.npmjs.com/package/${pjson.name}
Respository: ${pjson.homepage}
License: ${pjson.license}

Version: ${pjson.version}`
)
.bindHelp()
.parseSystem();

if (args.options['example']) {
  console.log(`${process.cwd()}/examples`);
  process.exit(0);
}

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

if (args.options['state']) {
  try {
    var stateFile = fs.readFileSync(args.options['state'], { encoding: 'utf8'});
    stateFile = JSON.parse(stateFile);
  } catch(err) {
    console.error(`Error: no such file or directory ${args.options['state']}`);
    if (args.options['force']) {
      stateFile = {}
      console.error("Set state by default\n");
    } else {
      process.exit(1);
    }
  }
}

var workingdir = "";
if (args.options['workingdir']) {
  workingdir = args.options['workingdir'];
  if (workingdir.slice(-1) !== "/") {
    workingdir += "/";
  }
  if (!fs.existsSync(workingdir)) {
    mkdirp.sync(workingdir, function (err) {
      if (err) console.error(err);
    });
  }
  process.chdir(workingdir);
}

const reducersNames = {
  actions: workingdir,
  constants: workingdir,
  reducers: workingdir,
  states: workingdir,
};

const reducersSuffix = {
  actions: args.options['actions-suffix'] || "-actions",
  constants: args.options['constants-suffix'] || ".constants",
  reducers: args.options['reducers-suffix'] || "",
  states: args.options['states-suffix'] || "-state",
}

String.prototype.capitalize = function() {
  return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

const scanDirectory = function() {
  console.log("Scanning filesystem...\n");
  Object.keys(reducersNames).forEach(function(reducer) {
    console.log(`Searching ${reducer} directory`);

    ff_result = new ff(reducer, { nottraversal: ['dist'] });

    // No reducer directory found
    if (ff_result.length == 0) {
      console.log(`${reducer} not found`);
      reducersNames[reducer] += reducer;
      console.log(`Directory setted to ${reducersNames[reducer]}\n`);
    } else {
      reducersNames[reducer] += ff_result[0];
      console.log(`${reducer} found at '${reducersNames[reducer]}'\n`)
    }
    reducersNames[reducer] += '/';
  });
}

const makeReducers = function(reducerName) {
  Object.keys(reducersNames).forEach(function(reducer) {

    reducerName = pluralize.plural(reducerName);
    let fileName = `${reducerName}${reducersSuffix[reducer]}.js`;
    let file = `${reducer}/${fileName}`;
    let state = stateFile[reducerName] ? stateFile[reducerName] : stateFile[pluralize.singular(reducerName)];

    let data = templates[`${reducer}Template`]({name: reducerName, directory: reducersNames, state, reducers});
    mkdirp.sync(reducer, function (err) {
      if (err) throw new Error(`Error creating directory ${reducersNames[reducer]}`);
    });

    if (fs.existsSync(file) && !args.options['f']) {
      throw new Error(`Reducers already exists (${file}) - You can force using the flag --force`)
    } else {
      fs.writeFile(file, data, function(err)   {
        if (err) {
          console.error(`Error generating file ${file} - ${err}`);
          return;
        }
        console.log(`Created file ${reducersNames[reducer]}${fileName}`);
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
