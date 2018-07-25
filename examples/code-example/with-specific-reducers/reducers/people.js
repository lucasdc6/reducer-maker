//Import section
import {
  // Add constants not generated

  // Read constants not generated

  // List constants not generated

  // Update constants not generated

  PERSON_DELETE_REQUEST,
  PERSON_DELETE_SUCCESS,
  PERSON_DELETE_FAILURE,

  SET_STATE,
} from 'examples/code-example/with-specific-reducers/constants/';

import InitialState from 'examples/code-example/with-specific-reducers/states//person-state';

// Main reducer function
export default function peopleReducer(state = InitialState, action) {
  switch (action.type) {
    // Add case not generated

    // Read case not generated

    // List case not generated

    // Update case not generated

    case PERSON_DELETE_REQUEST:
    {
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    }

    case PERSON_DELETE_SUCCESS:
    {
      return {
        ...state,
        people: null,
        isFetching: false,
        error: null,
      };
    }

    case PERSON_DELETE_FAILURE:
    {
      return {
        ...state,
        isFetching: false,
        error: action.payload,
        success: null,
      };
    }

    case SET_STATE:
    {
      const {
        people
      } = JSON.parse(action.payload);

      return {
        ...state,
        disabled: people.disabled,
        error: people.disabled,
        isValid: people.isValid,
        isFetching: people.isFetching,
        people: people.people
      };
    }

    default:
    {
      return state;
    }
  }
}
// This file was autogenerated by reducer-maker
