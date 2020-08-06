<div align="center">
    <img style="max-width: 900px" src="welcome.webp">
</div>


> Your Unstoppable Decentralized Shopping Destination

Decentramall is a virtual shopping platform built on Ethereum. Brands and retailers can purchase or rent their storefronts where shoppers can discover and purchase both virtual and physical products.

This is a ***work in progress*** (see warnings below), started during [HackFS](https://hackfs.com/).

## 👨‍🏭 Installation

This project have many parts.

It has solidity smart-contracts at */smart-contracts* folder. For further information on how to start a local network and deploy the contracts, see the README inside.

Data for rents is saved using filecoin. To integrate with filecoin, we are currently using powergate. For further information on how to start a local powergate and create an FFS please, see the README inside.

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
- [ ] Search mechanism
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
