//Initial state from file (flag --state)
export default {
  originalUser: {
    firstName: "",
    lastName: "",
    age: 0,
    document: null,
  },
  users: null,
  error: null,
  isValid: false,
  isFetching: false,
  fields: {
    firstName: "",
    firstNameHasError: false,
    firstNameErrorMsg:"",
    lastName: "",
    lastNameHasError: false,
    lastNameErrorMsg:"",
    age: 0,
    ageHasError: false,
    ageErrorMsg:"",
    document: null,
    documentHasError: false,
    documentErrorMsg:"",
  },
};
// This file was autogenerated by reducer-maker
