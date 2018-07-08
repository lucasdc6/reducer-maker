module.exports = function(variables = {}) {
  const { name, directory } = variables;

  const data =
`import {
  GET_${name.toUpperCase()}_REQUEST,
  GET_${name.toUpperCase()}_SUCCESS,
  GET_${name.toUpperCase()}_FAILURE,
} from ${directory.constants};

import InitialState from '${directory.states}/${name}-state';

export default function ${name}Reducer(state = InitialState, action) {
  switch (action.type) {
    case GET_${name.toUpperCase()}_REQUEST:
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
        ${name},
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
      };
    }

    case SET_STATE:
    {
      const {
        ${name}
      } = JSON.parse(action.payload);

      return {
        ...state,
        disabled: ${name}.disabled,
        error: ${name}.disabled,
        isValid: ${name}.isValid,
        isFetching: ${name}.isFetching,
        ${name}: ${name}.${name}
      };
    }

    default:
    {
      return state;
    }
  }
}
`;

  return data;
}
