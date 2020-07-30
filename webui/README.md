# Decentramall web ui

## Technologies
- [Typescript](https://www.typescriptlang.org/)
- Linting with [ESLint](https://eslint.org/)
- Formatting with [Prettier](https://prettier.io/)
- Linting, typechecking and formatting on by default using [`husky`](https://github.com/typicode/husky) for commit hooks
- Testing with [Jest](https://jestjs.io/) and [`react-testing-library`](https://testing-library.com/docs/react-testing-library/intro)
## Installation

```bash
yarn
```

## Usage

Requires `.env.local`, deployed smart-contracts and powergate instance. Only then run the webui.

To fill `.env.local` look at `.env.local.example` (parameters are explained below).

To deploy the smart-contracts in a localnet, see *smart-contracts* folder README.

To start a local powergate, see [here](https://docs.textile.io/powergate/localnet/#setup). Everytime you start a the local testnet, it starts with clean spaces, so you need to create an FFS. Run `pow ffs create` (see [here](https://docs.textile.io/powergate/#command-line-interface) how to install *pow cli*) anywhere on your machine and copy the token to *.env.local* file to *NEXT_PUBLIC_FFS_TOKEN* variable.

```bash
yarn dev
```

See [here](https://metamask.zendesk.com/hc/en-us/articles/360015489331-Importing-an-Account) how to import accounts into metamask and [here](https://ethereum.stackexchange.com/a/67115) how to reset if necessary.

## Tests

```bash
yarn test
```

## Build

Build static assets in `out/` directory to serve

It's possible to declare a base url, useful when creating a build for IPFS environments
```bash
BASE_URL=some/base/url yarn build
```


