# ENS Offchain Registrar

This repo builds on top of [ensdomains/offchain-resolver](https://github.com/ensdomains/offchain-resolver) to demonstrate what is effectively an offchain subname registrar for ENS names.

Note: This repo does not include a resolver contract. You can [find that here](https://github.com/ensdomains/offchain-resolver/blob/main/packages/contracts), or use [ccip.tools](https://ccip.tools/) to easily deploy it to Goerli.

## [Gateway](worker/README.md)

[Cloudflare Worker](https://developers.cloudflare.com/workers/) is used as the [CCIP Read](https://eips.ethereum.org/EIPS/eip-3668) gateway. [Cloudflare D1](https://developers.cloudflare.com/d1/) is used to store name data.

These choices allow for a scalable namespace with low cost (store up to 1M names for free), low latency, and high availability.

## [Frontend](web/README.md)

A bare bones Next.js app that allows users to easily register subnames (i.e. POST to the Cloudflare worker's API) by signing a message with their wallet.

## URLs

### [Resolver](https://sepolia.etherscan.io/address/0x73b52440c81a307f55a076d99ad1c563161b27b1)

### [Gateway](https://ens-gateway.tnk-biz-dev.workers.dev/)

### [Domain](https://app.ens.domains/offchain-resolver.eth)

### [CCIP TOOlS](https://ccip.tools/)

### [Docs](https://docs.ens.domains/resolvers/ccip-read)

### [YouTube](https://youtu.be/Y2XioueU2uQ?si=M9kYKzxF_KNL-7CR&t=929)

Huge thanks to [Greg](https://github.com/gskril)

## Flow
1. deploy worker (follow tutorial)
2. deploy resolver contract 
3. get ens name
4. set resolver contract for ens name
5. register name on frontend