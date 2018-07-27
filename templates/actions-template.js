const pluralize = require('pluralize');

const add_reducer_import = function(name) {
  return `${name}_ADD_REQUEST,
  ${name}_ADD_SUCCESS,
  ${name}_ADD_FAILURE,`;
}

const add_reducer_states = function(name) {
  return `export function ${name}AddRequest() {
  return {
    type: ${name.toUpperCase()}_ADD_REQUEST,
  };
}

export function ${name}AddSuccess() {
  return {
    type: ${name.toUpperCase()}_ADD_SUCCESS,
  };
}

export function ${name}AddFailure(error) {
  return {
    type: {name.toUpperCase()}_ADD_FAILURE,
    payload: error,
  };
}`;
}

const read_reducer_import = function(name) {
  return `GET_${name}_REQUEST,
  GET_${name}_SUCCESS,
  GET_${name}_FAILURE,`;
}

const read_reducer_states = function(name) {
  return `export function get${name.capitalize()}Request() {
  return {
    type: GET_${name.toUpperCase()}_REQUEST,
  };
}

export function get${name.capitalize()}Success(${name}) {
  return {
    type: GET_${name.toUpperCase()}_SUCCESS,
    payload: ${name},
  };
}

export function get${name.capitalize()}Failure(error) {
  return {
    type: GET_${name.toUpperCase()}_FAILURE,
    payload: error,
  };
}`;
}

const update_reducer_import = function(name) {
  return `${name}_UPDATE_REQUEST,
  ${name}_UPDATE_SUCCESS,
  ${name}_UPDATE_FAILURE,`;
}

const update_reducer_states = function(name) {
  return `export function ${name}UpdateRequest() {
  return {
    type: ${name.toUpperCase()}_UPDATE_REQUEST,
  };
}

export function ${name}UpdateSuccess() {
  return {
    type: ${name.toUpperCase()}_UPDATE_SUCCESS,
  };
}

export function ${name}UpdateFailure(data) {
  return {
    type: ${name.toUpperCase()}_UPDATE_FAILURE,
    payload: data,
  };
}`;
}

const delete_reducer_import = function(name) {
  return `${name}_DELETE_REQUEST,
  ${name}_DELETE_SUCCESS,
  ${name}_DELETE_FAILURE,`;
}

const delete_reducer_states = function(name) {
  return `export function ${name}DeleteRequest() {
  return {
    type: ${name.toUpperCase()}_DELETE_REQUEST,
  };
}

export function ${name}DeleteSuccess() {
  return {
    type: ${name.toUpperCase()}_DELETE_SUCCESS,
  };
}

export function ${name}DeleteFailure(data) {
  return {
    type: ${name.toUpperCase()}_DELETE_FAILURE,
    payload: data,
  };
}`;
}

module.exports = function(variables = {}) {
  const { name, directory, reducers } = variables;

  const singularName = pluralize.singular(name);
  const pluralName = pluralize.plural(name);

  const data =

`//Import section
import {
  ${reducers['add']? add_reducer_import(singularName.toUpperCase()) : "// Add constants not generated"}

  ${reducers['read']? read_reducer_import(singularName.toUpperCase()) : "// Read constants not generated"}

  ${reducers['list']? read_reducer_import(pluralName.toUpperCase()) : "// List constants not generated"}

  ${reducers['update']? update_reducer_import(singularName.toUpperCase()) : "// Update constants not generated"}

  ${reducers['delete']?delete_reducer_import(singularName.toUpperCase()) : "// Deleted constants not generated"}
} from '${directory}/constants';

// Reducers change state's section
${reducers['add']? add_reducer_states(singularName) : "// Add reducer not generated"}

${reducers['read']? read_reducer_states(singularName) : "// Read reducer not generated"}

${reducers['list']? read_reducer_states(pluralName) : "// List reducer not generated"}

${reducers['update']? update_reducer_states(singularName) : "// Update reducer not generated"}

${reducers['delete']? delete_reducer_states(singularName) : "// Delete reducer not generated"}

// This file was autogenerated by reducer-maker
`;

  return data;
}
