//Import section
import {
  USER_ADD_REQUEST,
  USER_ADD_SUCCESS,
  USER_ADD_FAILURE,

  // Read constants not generated

  // List constants not generated

  // Update constants not generated

  // Deleted constants not generated
} from 'examples/code-example/with-specific-reducers/constants/';

// Reducers change state's section
export function userAddRequest() {
  return {
    type: USER_ADD_REQUEST,
  };
}

export function userAddSuccess() {
  return {
    type: USER_ADD_SUCCESS,
  };
}

export function userAddFailure(error) {
  return {
    type: {name.toUpperCase()}_ADD_FAILURE,
    payload: error,
  };
}

// Read reducer not generated

// List reducer not generated

// Update reducer not generated

// Delete reducer not generated

// This file was autogenerated by reducer-maker
