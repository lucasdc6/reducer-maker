module.exports = function(variables = {}) {
  const { name, directory } = variables;
  const data =
`export default {
  ${name}: null,
  disabled: false,
  error: null,
  isValid: false,
  isFetching: false,
};
`;

  return data;
}
