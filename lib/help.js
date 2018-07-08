module.exports = function help(program) {
  const help =
`\nUsage: ${program} <name>
Version: test
Node version: ${process.version}
`;
  console.log(help);
}
