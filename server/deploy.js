const {
  EnigmaUtils, Secp256k1Pen, SigningCosmWasmClient, pubkeyToAddress, encodeSecp256k1Pubkey
} = require("secretjs");
  
const fs = require('fs');
const helper = require('./helper');
require('dotenv').config();

const customFees = {
  upload: {
    amount: [{ amount: "3000000", denom: "uscrt" }],
    gas: "3000000",
},
  init: {
      amount: [{ amount: "500000", denom: "uscrt" }],
      gas: "500000",
  },
  exec: {
      amount: [{ amount: "500000", denom: "uscrt" }],
      gas: "500000",
  },
  send: {
      amount: [{ amount: "80000", denom: "uscrt" }],
      gas: "80000",
  },
};

const deploy = async () => {
  const {client, accAddress} = await helper.getClient();

  // Upload the contract wasm
  const wasm = fs.readFileSync("contract.wasm");
  console.log('Uploading contract');
  const uploadReceipt = await client.upload(wasm, {})
    .catch((err) => { throw new Error(`Could not upload contract: ${err}`); });

  // Create an instance of the Counter contract
  // Get the code ID from the receipt
  const { codeId } = uploadReceipt;

  // Contract hash, useful for contract composition
  const contractCodeHash = await client.restClient.getCodeHashByCodeId(codeId);
  console.log(`Contract hash: ${contractCodeHash}`);

  const initMsg = {
    name: "Secret Funder NFT",
    symbol: "SFNFT",
    admin: accAddress,
    entropy: Buffer.from("Hello World").toString('base64'),
    config: {
        public_token_supply: true,
        public_owner: true,
        enable_sealed_metadata: true,
        unwrapped_metadata_is_private: true,
        minter_may_update_metadata: true,
        owner_may_update_metadata: true,
        enable_burn: true,
    }
  }
  const contract = await client.instantiate(
    codeId, initMsg, "Secret Funder" + Math.ceil(Math.random() * 10000000)
  );
  console.log('contract: ', contract);

  const contractAddress = contract.contractAddress;
  let response;

  // Query the current contract
  console.log('Querying contract info');
  response = await client.queryContractSmart(contractAddress, { "contract_info": {}});

  console.log(response);
}

deploy().catch((err) => {
  console.error(err);
});