## Install

Installing reducer-maker

```js
$ yarn global add reducer-maker
// or
$ npm intall -g reducer-maker
```

## Generatig reducers

- Generate all user's reducers (add, read, list, update and delete) in root directory.

```js
$ reducer-maker -a user
```

- Generate all user's reducer in src directory.

```js
$ reducer-maker -a -d src user
```

- Generate only add and read user's reducers in src directory.

```js
$ reducer-maker -r add -r read -d src user
```

By default, reducer-maker shearch for a directory named `actions`, `constants`,
`reducers` and `states`.
