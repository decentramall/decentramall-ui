<div align="center">
    <img style="max-width: 900px" src="welcome.webp">
</div>


> Your Unstoppable Decentralized Shopping Destination

Decentramall is a virtual shopping platform built on Ethereum. Brands and retailers can purchase or rent their storefronts where shoppers can discover and purchase both virtual and physical products.

This is a ***work in progress*** (see warnings below), started during [HackFS](https://hackfs.com/).

## 👨‍🏭 Installation

```bash
yarn
```

## 🤹‍♂️ Usage

Requires `.env.local`, deployed smart-contracts and powergate instance.

To fill `.env.local` look at `.env.local.example` (parameters are explained below).

To deploy the smart-contracts in a localnet, see *contracts* repository.

To start a local powergate, see [here](https://docs.textile.io/powergate/localnet/#setup). Everytime you start a the local testnet, it starts with clean spaces, so you need to create an FFS. Run `pow ffs create` (see [here](https://docs.textile.io/powergate/#command-line-interface) how to install *pow cli*) anywhere on your machine and copy the token to *.env.local* file to *NEXT_PUBLIC_FFS_TOKEN* variable.

```bash
yarn dev
```

See [here](https://metamask.zendesk.com/hc/en-us/articles/360015489331-Importing-an-Account) how to import accounts into metamask and [here](https://ethereum.stackexchange.com/a/67115) how to reset if necessary.

## 🕵️‍♀️ Tests

```bash
yarn test
```

## 👷‍♀️ Build

Build static assets in `out/` directory to serve

It's possible to declare a base url, useful when creating a build for IPFS environments
```bash
BASE_URL=some/base/url yarn build
```

## 📭 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## ⏳ Work in Progress

- [x] Initial version of smart contracts
- [x] Initial version of webui
- [x] User Dashboard
- [x] Buy SPACE
- [x] Rent SPACE
- [x] Load add SPACE tokens
- [x] Get user SPACE status (price when bought, rent (if any))
- [x] Get user rent status (price, expiration, etc)
- [x] Load all rents
- [x] Render spaces on mainpage
- [x] Search mechanism
- [ ] Deploy to testnet
- [ ] ...

## ⚠️ Warnings!
***NOTE***: This are warnings from the [textile](https://textile.io/) team, that we also want to share.

1. This is an experimental service, running on an experimental stack, connected to the Filecoin Testnet.
2. Things may go wrong, things may change without much notice, and your data may go away! Before mainnet, all of this is meant to explore, have fun, and learn.
3. We cannot offer support for lost data. In fact, you should expect all data to be reset at some points between now and the end of HackFS.
4. Again, don't put production things on this service.
5. Don't put important things on this service.
6. Don't put private or potentially insecure things on this service.
7. Don't put things you shouldn't on this service (harmful, mean, illegal, private, not yours).

## License
[GPL-v3](LICENSE)


