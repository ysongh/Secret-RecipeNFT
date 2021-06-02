# Secret RecipeNFT
A dapp where user can create a NFT of recipe for food or drink. Recipe are hidden on private metadata until user pay SCRT to view it

- Demo - https://youtu.be/eI9hSApKANk

## Contract deploy on Secret Network Holodeck testnet
- Secret Recipe NFT Contract Address: secret1yl82t3fxadgmsgflc2vs52g0x6fvyekuupfg3y

## Features
- User can create a NFT of secret recipe
- User can pay 1 SCRT to view the private metadata of NFT
- Image are store on Pinata

## Technologies
- React
- semantic-ui
- Node
- Express
- SNIP-721
- secretjs
- Pinata

## Running the dapp on local host
- Clone or download this repository
- Run `npm i` to install the dependencies
- Run `npm run deployandcontact` to deploy contract wasm and copy the contract address on the console when it is finsh deploying
- Create a file called '.env' on the root folder and add the following code
```
SECRET_REST_URL=https://secret-holodeck-2--lcd--full.datahub.figment.io/apikey/<your_apikey>
SECRET_CHAIN_ID=holodeck-2
ADDRESS=<your_address>
MNEMONIC=<your mnemonic>
SECRET_NFT_CONTRACT=<your secret contract address>
```
- Create a file called 'config.js' on the src folder and add the following code
```
export const pinataApiKey = "Create API key from Pinata";
export const pinataSecretApiKey = "Create API key from Pinata";
```
- Run `npm run server` to start the server
- Run `npm start` to start the dapp