module.exports = function(variables = {}) {
  const { name, directory } = variables;
  const data =
`export const GET_${name.toUpperCase()}_REQUEST = 'get-${name}-request';
export const GET_${name.toUpperCase()}_SUCCESS = 'get-${name}-success';
export const GET_${name.toUpperCase()}_FAILURE = 'get-${name}-failure';
`;

  return data;
}
