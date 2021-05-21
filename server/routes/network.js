const express = require('express');
const router = express.Router();
const {
  EnigmaUtils, Secp256k1Pen, SigningCosmWasmClient, pubkeyToAddress, encodeSecp256k1Pubkey,
} = require('secretjs');

require('dotenv').config();

const customFees = {
  upload: {
    amount: [{ amount: "2000000", denom: "uscrt" }],
    gas: "2000000",
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

const httpUrl = process.env.SECRET_REST_URL;

router.post('/createnft', async (req, res, next) => {
  const mnemonic = process.env.MNEMONIC;

  const signingPen = await Secp256k1Pen.fromMnemonic(mnemonic)
    .catch((err) => { throw new Error(`Could not get signing pen: ${err}`); });

  // Get the public key
  const pubkey = encodeSecp256k1Pubkey(signingPen.pubkey);

  // Get the wallet address
  const accAddress = pubkeyToAddress(pubkey, 'secret');

  // Initialize client
  const txEncryptionSeed = EnigmaUtils.GenerateNewSeed();
  const client = new SigningCosmWasmClient(
    httpUrl,
    accAddress,
    (signBytes) => signingPen.sign(signBytes),
    txEncryptionSeed, customFees,
  );
  console.log(`Wallet address=${accAddress}`);
  
  // Define your metadata
  const publicMetadata = "<public metadata>";
  const privateMetadata = "<private metadata>";

  // Mint a new token
  const handleMsg = {
    mint_nft: {
      owner: accAddress,
      public_metadata: {
        name: publicMetadata,
      },
      private_metadata: {
        name: privateMetadata,
      },
    },
  };

  console.log("Minting a nft");
  const response = await client
    .execute(process.env.SECRET_NFT_CONTRACT, handleMsg)
    .catch((err) => {
      throw new Error(`Could not execute contract: ${err}`);
    });
  console.log("response: ", response);

  return res.status(201).json({
    'data': response
  });
});

router.get('/nfts', async (req, res, next) => {
  const mnemonic = process.env.MNEMONIC;

  // A pen is the most basic tool you can think of for signing.
  // This wraps a single keypair and allows for signing.
  const signingPen = await Secp256k1Pen.fromMnemonic(mnemonic).catch((err) => {
    throw new Error(`Could not get signing pen: ${err}`);
  });

  // Get the public key
  const pubkey = encodeSecp256k1Pubkey(signingPen.pubkey);

  // get the wallet address
  const accAddress = pubkeyToAddress(pubkey, 'secret');

  // initialize client
  const txEncryptionSeed = EnigmaUtils.GenerateNewSeed();

  const client = new SigningCosmWasmClient(
    httpUrl,
    accAddress,
    (signBytes) => signingPen.sign(signBytes),
    txEncryptionSeed,
    customFees
  );
  console.log(`Wallet address=${accAddress}`);

  // 1. Get a list of all tokens
  let queryMsg = {
    tokens: {
      owner: accAddress,
    },
  };

  console.log("Reading all tokens");

  let response = await client
    .queryContractSmart(process.env.SECRET_NFT_CONTRACT, queryMsg)
    .catch((err) => {
      throw new Error(`Could not execute contract: ${err}`);
    });
  console.log("response: ", response.token_list.tokens);

  if(response.token_list.tokens.length == 0){
    return res.status(404).json({
      'error': 'No token was found for you account, make sure that the minting step completed successfully'
    });
  }

  const nftList = [];
  const list = response.token_list.tokens;

  for(let i = 0; i < list.length; i++){
    const token_id = list[i];

    // Query the public metadata
    queryMsg = {
      nft_info: {
        token_id: token_id,
      },
    };

    console.log(`Query public data of token #${token_id}`);
    response = await client
      .queryContractSmart(process.env.SECRET_NFT_CONTRACT, queryMsg)
      .catch((err) => {
        throw new Error(`Could not execute contract: ${err}`);
      });
    console.log("response: ", response);

    nftList.push(response.nft_info);
  }

  return res.status(200).json({
    'data': nftList
  });
});

module.exports = router;