//Import section
import {
  // Add constants not generated

  // Read constants not generated

  // List constants not generated

  // Update constants not generated

  PERSON_DELETE_REQUEST,
  PERSON_DELETE_SUCCESS,
  PERSON_DELETE_FAILURE,
} from 'examples/code-example/with-specific-reducers/constants/';

// Reducers change state's section
// Add reducer not generated

// Read reducer not generated

// List reducer not generated

// Update reducer not generated

export function personDeleteRequest() {
  return {
    type: PERSON_DELETE_REQUEST,
  };
}

export function personDeleteSuccess() {
  return {
    type: PERSON_DELETE_SUCCESS,
  };
}

export function personDeleteFailure(data) {
  return {
    type: PERSON_DELETE_FAILURE,
    payload: data,
  };
}

// This file was autogenerated by reducer-maker