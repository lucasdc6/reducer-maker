#!/usr/bin/env node

const ff = require('node-find-folder');
const fs = require('fs');
const mkdirp = require('mkdirp');
const pluralize = require('pluralize');
const getopt = require('node-getopt');
const pjson = require('./package.json');
const _ = require('lodash');
const Mustache = require('mustache');

const program = process.argv[1].split("/").pop();

var args = new getopt([
  ['r' , 'reducer=REDUCER+', 'Specify what reducer generate (CRUD)'],
  ['', 'file=FILE+', 'Specify what file generate (actions, constants, reducers and states)'],
  ['s' , 'state=JSON', 'Path to file with initial state in json format'],
  ['f', 'force', 'Force the execution'],
  ['w', 'workingdir=WD', 'Change working directory'],
  ['', 'root=ROOT', 'Specify root directory for requires/imports'],
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

// Check for flag '--examples'
if (args.options['examples']) {
  console.log(`${process.cwd()}/examples`);
  process.exit(0);
}

// Check for reducers
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

// Check for state file
var stateFile = {};
if (args.options['state']) {
  try {
    stateFile = fs.readFileSync(args.options['state'], { encoding: 'utf8'});
    stateFile = JSON.parse(stateFile);
  } catch(err) {
    console.error(`Error: no such file or directory ${args.options['state']} - You can force using --force`);
    if (args.options['force']) {
      console.error("Set state by default\n");
    } else {
      process.exit(1);
    }
  }
}

// Check for workdir
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

// Set initial reducersNames
const reducersNames = {
  actions: workingdir,
  constants: workingdir,
  reducers: workingdir,
  states: workingdir,
};

if (args.options['file']) {
  let validFiles = Object.keys(reducersNames);
  console.info(validFiles);
  validFiles = validFiles.filter(reducerName => !args.options['file'].includes(reducerName));
  validFiles.forEach(elem => delete reducersNames[elem]);
}

// Set reducers suffixes
const reducersSuffix = {
  actions: args.options['actions-suffix'] || "-actions",
  constants: args.options['constants-suffix'] || ".constants",
  reducers: args.options['reducers-suffix'] || "",
  states: args.options['states-suffix'] || "-state",
}

function scanDirectory() {
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
      console.log(`${reducer} found at '${reducersNames[reducer]}'\n`);
    }
    reducersNames[reducer] += '/';
  });
}

function makeReducers(reducerFullName) {
  Object.keys(reducersNames).forEach(function(reducer) {
    let reducerSplit = reducerFullName.split("/");
    let reducerName = reducerSplit[0];
    let moduleName = reducerSplit[1] ? reducerSplit[1] : reducerSplit[0] ;
    let reducerDir = `${reducersNames[reducer].replace(workingdir, "")}${pluralize.plural(reducerName)}-${reducer}/`;

    reducerFullName = pluralize.plural(reducerFullName);
    let fileName = `${pluralize.plural(moduleName)}${reducersSuffix[reducer]}.js`;
    let file = `${reducerDir}${fileName}`;
    let state = stateFile[reducerFullName] ? stateFile[reducerFullName] : stateFile[pluralize.singular(reducerFullName)];

    let indent = '      ';
    let data = {
      reducerNamePluralU: pluralize.plural(reducerName).toUpperCase(),
      reducerNameSingularU: pluralize.singular(reducerName).toUpperCase(),
      reducerNameSingularC: _.camelCase(pluralize.singular(reducerName)),
      reducerNameSingularCC: _.upperFirst(_.camelCase(pluralize.singular(reducerName))),
      moduleNamePluralU: pluralize.plural(moduleName).toUpperCase(),
      moduleNameSingularU: pluralize.singular(moduleName).toUpperCase(),
      moduleNameSingularC: _.camelCase(pluralize.singular(moduleName)),
      moduleNameSingularCC: _.upperFirst(_.camelCase(pluralize.singular(moduleName))),
      moduleNamePluralC: _.camelCase(pluralize.plural(moduleName)),
      moduleNamePluralCC: _.upperFirst(_.camelCase(pluralize.plural(moduleName))),
      directoryBase: args.options['root'] ? args.options['root'] : reducersNames[reducer],
      state: Object.keys(state || {}).map ( field => `${indent}${field}: ${JSON.stringify(state[field])},`).join("\n"),
      fields: Object.keys(state || {}).map( field => `${indent}${field}: ${JSON.stringify(state[field])},\n${indent}${field}HasError: false,\n${indent}${field}ErrorMsg:"",`).join("\n"),
      reducers,
    };
    
    mkdirp.sync(reducerDir, function (err) {
      if (err) throw new Error(`Error creating directory ${reducersNames[reducer]}`);
    });
    
    if (fs.existsSync(file) && !args.options['f']) {
      throw new Error(`Reducers already exists (${file}) - You can force using the flag --force`)
    } else {
      let template = fs.readFileSync(`templates/${reducer}`, 'utf8');

      finalFile = Mustache.render(template, data);

      fs.writeFileSync(file, finalFile);
      console.log(`Created file ${reducersNames[reducer]}${fileName}`);
    }
  });
}

scanDirectory();
try {
  args.argv.forEach(makeReducers);
} catch(err) {
  console.log(err.message)
}
