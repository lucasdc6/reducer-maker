module.exports = function(variables = {}) {
  const { name, directory } = variables;

  const data =
`import {
  GET_${name.toUpperCase()}_REQUEST,
  GET_${name.toUpperCase()}_SUCCESS,
  GET_${name.toUpperCase()}_FAILURE,
} from ${directory.constants};

export function get${name.capitalize()}Request() {
  return {
    type: GET_${name.toUpperCase()}_REQUEST,
  };
}

export function get${name.capitalize()}Failure(error) {
  return {
    type: GET_${name.toUpperCase()}_FAILURE,
    payload: error,
  };
}

export function get${name.capitalize()}(sessionToken) {
  return (dispatch) => {
    dispatch(get${name.capitalize()}Request());
    return authToken.getSessionToken(sessionToken)
      .then(token => ${name}Request.init(token).get${name}())
      .then((data) => {
        dispatch(get${name.capitalize()}Success(data.${name}));
      })
      .catch((error) => {
        dispatch(get${name.capitalize()}Failure(errorHandler(error)));
      });
  };
}
`;

  return data;
}

