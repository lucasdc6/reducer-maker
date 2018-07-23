const pluralize = require('pluralize');

module.exports = function(variables = {}) {
  const { name, directory } = variables;

  const pluralName = pluralize.plural(name);

  const data =
`export default {
  ${pluralName}: null,
  disabled: false,
  error: null,
  isValid: false,
  isFetching: false,
};
`;

  return data;
}
