## Install

Installing reducer-maker

```js
$ yarn global add reducer-maker
// or
$ npm intall -g reducer-maker
```

__Note: remember to add yarn global to path__

in your bashrc
```bash
export PATH="$PATH:$(yarn global bin)"
```

## Generatig reducers

- By default, reducer-maker genrate all (add, read, list, update and delete) in root directory.

```js
$ reducer-maker user
```

- Generate all user's reducer in src directory.

```js
$ reducer-maker -d src user
```

- Generate only add and read user's reducers in src directory.

```js
$ reducer-maker -r add -r read -d src user
```

By default, reducer-maker shearch for a directory named `actions`, `constants`,
`reducers` and `states`.

Scann for **only** for directories

```js
$ reducer-maker
```
