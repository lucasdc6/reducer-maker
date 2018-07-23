const pluralize = require('pluralize');

const add_reducer_import = function(name) {
  return `${name}_ADD_REQUEST,
  ${name}_ADD_SUCCESS,
  ${name}_ADD_FAILURE,`;
}

const add_reducer_case = function(name, pluralName) {
  return `case ${name.toUpperCase()}_ADD_REQUEST:
    {
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    }

    case ${name.toUpperCase()}_ADD_SUCCESS:
    {
      return {
        ...state,
        isFetching: false,
        ${pluralName}: null,
        success: true,
      };
    }

    case ${name.toUpperCase()}_ADD_FAILURE:
    {
      return {
        ...state,
        isFetching: false,
        error: action.payload,
        success: null,
      };
    }`;
}

const read_reducer_import = function(name) {
  return `GET_${name}_REQUEST,
  GET_${name}_SUCCESS,
  GET_${name}_FAILURE,`;
}

const read_reducer_case = function(name, pluralName) {
  return `case GET_${name.toUpperCase()}_REQUEST:
    {
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    }

    case GET_${name.toUpperCase()}_SUCCESS:
    {
      return {
        ...state,
        ${pluralName}: action.payload.${pluralName},
        isFetching: false,
        error: null,
      };
    }

    case GET_${name.toUpperCase()}_FAILURE:
    {
      return {
        ...state,
        isFetching: false,
        error: action.payload,
        success: null,
      };
    }`;
}

const update_reducer_import = function(name) {
  return `${name}_UPDATE_REQUEST,
  ${name}_UPDATE_SUCCESS,
  ${name}_UPDATE_FAILURE,`;
}

const update_reducer_case = function(name, pluralName) {
  return `case ${name.toUpperCase()}_UPDATE_REQUEST:
    {
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    }

    case ${name.toUpperCase()}_UPDATE_SUCCESS:
    {
      return {
        ...state,
        ${pluralName}: null,
        isFetching: false,
        error: null,
      };
    }

    case ${name.toUpperCase()}_UPDATE_FAILURE:
    {
      return {
        ...state,
        isFetching: false,
        error: action.payload,
        success: null,
      };
    }`;
}

const delete_reducer_import = function(name) {
  return `${name}_DELETE_REQUEST,
  ${name}_DELETE_SUCCESS,
  ${name}_DELETE_FAILURE,`;
}

const delete_reducer_case = function(name, pluralName) {
  return `case ${name.toUpperCase()}_DELETE_REQUEST:
    {
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    }

    case ${name.toUpperCase()}_DELETE_SUCCESS:
    {
      return {
        ...state,
        ${pluralName}: null,
        isFetching: false,
        error: null,
      };
    }

    case ${name.toUpperCase()}_DELETE_FAILURE:
    {
      return {
        ...state,
        isFetching: false,
        error: action.payload,
        success: null,
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

  ${reducers['delete']? delete_reducer_import(singularName.toUpperCase()) : "// Deleted constants not generated"}
} from ${directory.constants};

import InitialState from '${directory.states}/${singularName}-state';

export default function ${name}Reducer(state = InitialState, action) {
  switch (action.type) {
    ${reducers['add']? add_reducer_case(singularName, pluralName) : "// Add case not generated"}

    ${reducers['read']? read_reducer_case(singularName, pluralName) : "// Read case not generated"}

    ${reducers['list']? read_reducer_case(pluralName, pluralName) : "// List case not generated"}

    ${reducers['update']? update_reducer_case(singularName, pluralName) : "// Update case not generated"}

    ${reducers['delete']? delete_reducer_case(singularName, pluralName) : "// Delete case not generated"}

    case SET_STATE:
    {
      const {
        ${name}
      } = JSON.parse(action.payload);

      return {
        ...state,
        disabled: ${pluralName}.disabled,
        error: ${pluralName}.disabled,
        isValid: ${pluralName}.isValid,
        isFetching: ${pluralName}.isFetching,
        ${pluralName}: ${pluralName}.${pluralName}
      };
    }

    default:
    {
      return state;
    }
  }
}`;

  return data;
}
