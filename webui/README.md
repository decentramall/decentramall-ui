# Decentramall web ui

## Technologies
- [Typescript](https://www.typescriptlang.org/)
- Linting with [ESLint](https://eslint.org/)
- Formatting with [Prettier](https://prettier.io/)
- Linting, typechecking and formatting on by default using [`husky`](https://github.com/typicode/husky) for commit hooks
- Testing with [Jest](https://jestjs.io/) and [`react-testing-library`](https://testing-library.com/docs/react-testing-library/intro)
## How to use

Install the dependencies

```bash
yarn install
```

### Run in development

```bash
yarn dev
```

Requires powergate running. See [here](https://docs.textile.io/powergate/localnet/#setup). Everytime you start a the local testnet, it starts with clean spaces, so you need to create an FFS. Run `pow ffs create` (see [here](https://docs.textile.io/powergate/#command-line-interface) how to install *pow cli*) anywhere on your machine and copy the token to *.env.local* file to *NEXT_PUBLIC_FFS_TOKEN* variable.

### Run tests

```bash
yarn test
```

### Build assets

Build static assets in `out/` directory to serve

It's possible to declare a base url, useful when creating a build for IPFS environments
```bash
BASE_URL=some/base/url yarn build
```


