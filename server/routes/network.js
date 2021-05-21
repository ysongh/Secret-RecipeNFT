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

router.post('/createnft', async (req, res, next) => {
  const httpUrl = process.env.SECRET_REST_URL;
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

  return res.status(200).json({
    'data': response
  });
});

module.exports = router;