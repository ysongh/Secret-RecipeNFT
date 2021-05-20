const express = require('express');
const router = express.Router();
const {
  EnigmaUtils, Secp256k1Pen, SigningCosmWasmClient, pubkeyToAddress, encodeSecp256k1Pubkey,
} = require('secretjs');

require('dotenv').config();

const customFees = {
  upload: {
    amount: [{ amount: '2000000', denom: 'uscrt' }],
    gas: '2000000',
  },
  init: {
    amount: [{ amount: '500000', denom: 'uscrt' }],
    gas: '500000',
  },
  exec: {
    amount: [{ amount: '500000', denom: 'uscrt' }],
    gas: '500000',
  },
  send: {
    amount: [{ amount: '80000', denom: 'uscrt' }],
    gas: '80000',
  },
};

router.get('/getcounter', async (req, res, next) => {
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

  const contractAddress = "secret1c8cmrxuaumhefrnujc7rtrmy5dh4nn5tlafth7";
  // Query the counter
  console.log('Querying contract for current count');
  let response = await client.queryContractSmart(contractAddress, { get_count: {} })
    .catch((err) => { throw new Error(`Could not query contract: ${err}`); });

  return res.status(200).json({
    'count': response.count
  });
});

router.put('/addcounter', async (req, res, next) => {
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

  const contractAddress = "secret1c8cmrxuaumhefrnujc7rtrmy5dh4nn5tlafth7";

  // Increment the counter
  const handleMsg = { increment: {} };
  console.log('Updating count');
  response = await client.execute(contractAddress, handleMsg)
    .catch((err) => { throw new Error(`Could not execute contract: ${err}`); });
  console.log('response: ', response);
  
  // Query again to confirm it worked
  console.log('Querying contract for updated count');
  response = await client.queryContractSmart(contractAddress, { get_count: {} })
    .catch((err) => { throw new Error(`Could not query contract: ${err}`); });

  return res.status(200).json({
    'count': response.count
  });
});

module.exports = router;