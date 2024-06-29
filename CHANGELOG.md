# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-06-02

### Changed

- Moved to new scaffold, added CJS/ESM exports
- Moved default imports to named imports
   - `import { EventAsPromise } from 'event-as-promise'`
- Removed `options: { array: boolean }`, to receive all arguments from Node.js event emitter
   - `target.on((...args) => eventAsPromise.eventListener(args))`
- Integration tests ported to mocha for better test conclusiveness, in PR [#33](https://github.com/compulim/event-as-promise/pull/33)
- Bumped dependencies, in PR [#34](https://github.com/compulim/event-as-promise/pull/34)
   - Development dependencies
      - [`@babel/preset-env@7.24.7`](https://npmjs.com/package/@babel/preset-env/v/7.24.7)
      - [`@babel/preset-typescript@7.24.7`](https://npmjs.com/package/@babel/preset-typescript/v/7.24.7)
      - [`@types/node@20.14.9`](https://npmjs.com/package/@types/node/v/20.14.9)
      - [`esbuild@0.21.5`](https://npmjs.com/package/esbuild/v/0.21.5)
      - [`prettier@3.3.2`](https://npmjs.com/package/prettier/v/3.3.2)
      - [`tsup@8.1.0`](https://npmjs.com/package/tsup/v/8.1.0)
      - [`typescript@5.5.2`](https://npmjs.com/package/typescript/v/5.5.2)

## [1.1.0] - 2020-05-25

### Changed

- Bump dependencies, in PR [#8](https://github.com/compulim/event-as-promise/pull/8)
   - [`@babel/cli@7.8.4`](https://npmjs.com/package/@babel/cli)
   - [`@babel/core@7.9.6`](https://npmjs.com/package/@babel/core)
   - [`@babel/plugin-proposal-object-rest-spread@7.9.6`](https://npmjs.com/package/@babel/plugin-proposal-object-rest-spread)
   - [`@babel/preset-env@7.9.6`](https://npmjs.com/package/@babel/preset-env)
   - [`babel-plugin-add-module-exports@1.0.2`](https://npmjs.com/package/babel-plugin-add-module-exports)
   - [`get-port@5.1.1`](https://npmjs.com/package/get-port)
   - [`has-resolved@1.1.0`](https://npmjs.com/package/has-resolved)
   - [`jest@26.0.1`](https://npmjs.com/package/jest)
   - [`node-dev@4.0.0`](https://npmjs.com/package/node-dev)
   - [`node-fetch@2.6.0`](https://npmjs.com/package/node-fetch)
   - [`redux@4.0.5`](https://npmjs.com/package/redux)
   - [`redux-saga@1.1.3`](https://npmjs.com/package/redux-saga)
   - [`regenerator-runtime@0.13.5`](https://npmjs.com/package/regenerator-runtime)
- Bump dependencies, in PR [#5](https://github.com/compulim/event-as-promise/pull/5)
   - [@babel/cli@^7.5.5](https://www.npmjs.com/package/@babel/cli)
   - [@babel/core@^7.5.5](https://www.npmjs.com/package/@babel/core)
   - [@babel/plugin-proposal-object-rest-spread@^7.5.5](https://www.npmjs.com/package/@babel/plugin-proposal-object-rest-spread)
   - [@babel/preset-env@^7.5.5](https://www.npmjs.com/package/@babel/preset-env)
   - [babel-plugin-add-module-exports@^1.0.2](https://www.npmjs.com/package/babel-plugin-add-module-exports)
   - [get-port@^5.0.0](https://www.npmjs.com/package/get-port)
   - [has-resolved@^1.1.0](https://www.npmjs.com/package/has-resolved)
   - [jest@^24.8.0](https://www.npmjs.com/package/jest)
   - [node-dev@^4.0.0](https://www.npmjs.com/package/node-dev)
   - [node-fetch@^2.6.0](https://www.npmjs.com/package/node-fetch)
   - [redux@^4.0.4](https://www.npmjs.com/package/redux)
   - [redux-saga@^1.0.5](https://www.npmjs.com/package/redux-saga)
   - [rimraf@^2.6.3](https://www.npmjs.com/package/rimraf)

## [1.0.5] - 2018-10-31

### Changed

- Instead of importing `p-defer` package, we copied the code in
   - `p-defer` package published to NPM is not ES5-compliant
   - Non ES5-compliant package will fail build for `create-react-app@1`

## [1.0.4] - 2018-10-08

### Changed

- Updated to `@babel/core@7.1.2` and `jest@23.6.0`
- Use `p-defer` for deferred implementation

## [1.0.3] - 2018-06-28

### Fixed

- fix: uglify in create-react-app failed because not ES5-compliant

## [1.0.2] - 2018-03-27

### Fixed

- fix: bound `upcoming()`

## [1.0.1] - 2018-03-27

### Added

- `upcoming()` for upcoming event, regardless of futures

## [1.0.0] - 2018-03-26

### Added

- First public release

[2.0.0]: https://github.com/compulim/event-as-promise/compare/v1.1.0...v2.0.0
[1.1.0]: https://github.com/compulim/event-as-promise/compare/v1.0.5...v1.1.0
[1.0.5]: https://github.com/compulim/event-as-promise/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/compulim/event-as-promise/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/compulim/event-as-promise/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/compulim/event-as-promise/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/compulim/event-as-promise/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/compulim/event-as-promise/releases/tag/v1.0.0
