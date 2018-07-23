const pluralize = require('pluralize');

const add_reducer_constants = function(name) {
  return `export const ${name.toUpperCase()}_ADD_REQUEST = '${name}-add-request';
export const ${name.toUpperCase()}_ADD_SUCCESS = '${name}-add-success';
export const ${name.toUpperCase()}_ADD_FAILURE = '${name}-add-failure';`;
}

const read_reducer_constants = function(name) {
  return `export const GET_${name.toUpperCase()}_REQUEST = 'get-${name}-request';
export const GET_${name.toUpperCase()}_SUCCESS = 'get-${name}-success';
export const GET_${name.toUpperCase()}_FAILURE = 'get-${name}-failure';`;
}

const update_reducer_constants = function(name) {
  return `export const ${name.toUpperCase()}_UPDATE_REQUEST = '${name}-update-request';
export const ${name.toUpperCase()}_UPDATE_SUCCESS = '${name}-update-success';
export const ${name.toUpperCase()}_UPDATE_FAILURE = '${name}-update-failure';`;
}

const delete_reducer_constants = function(name) {
  return `export const ${name.toUpperCase()}_DELETE_REQUEST = '${name}-delete-request';
export const ${name.toUpperCase()}_DELETE_SUCCESS = '${name}-delete-success';
export const ${name.toUpperCase()}_DELETE_FAILURE = '${name}-delete-failure';`;
}

module.exports = function(variables = {}) {
  const { name, directory, reducers } = variables;

  const singularName = pluralize.singular(name);
  const pluralName = pluralize.plural(name);

  const data =
`${reducers['add']? add_reducer_constants(singularName) : "// Add constants not generated"}

${reducers['read']? read_reducer_constants(singularName) : "// Read constants not generated"}

${reducers['list']? read_reducer_constants(pluralName) : "// List constants not generated"}

${reducers['update']? update_reducer_constants(singularName) : "// Update constants not generated"}

${reducers['delete']? delete_reducer_constants(singularName) : "// Delete constants not generated"}`;

  return data;
}
