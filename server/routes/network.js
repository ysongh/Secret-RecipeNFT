const express = require('express');
const router = express.Router();

const helper = require('../helper');
require('dotenv').config();

// PUT /api/network/balance
// Get balance of SCRT from the address
router.put('/balance', async (req, res, next) => {
  try{
    const {client, accAddress} = await helper.getClient(req.body.mnemonic);

    const acct = await client.getAccount();

    return res.status(200).json({
      'data': acct
    });
  } catch(err){
    console.log(err);
    return res.status(500).json({
      'err': err
    });
  }
});

// POST /api/network/createnft
// Create a NFT of recipe
router.post('/createnft', async (req, res, next) => {
  try{
    const {client, accAddress} = await helper.getClient();

    // Mint a new token
    const handleMsg = {
      mint_nft: {
        owner: accAddress,
        public_metadata: {
          name: req.body.name,
          description: req.body.description,
          image: req.body.image,
        },
        private_metadata: {
          description: req.body.secretDescription,
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
  } catch(err){
    console.log(err);
    return res.status(500).json({
      'err': err
    });
  }
});

// GET /api/network/nfts
// Get all NFTs of recipe
router.get('/nfts', async (req, res, next) => {
  try{
    const {client, accAddress} = await helper.getClient();

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
  } catch(err){
    console.log(err);
    return res.status(500).json({
      'err': err
    });
  }
});

// GET /api/network/nfts/:id
// Get NFT of recipe by Id
router.get('/nfts/:id', async (req, res, next) => {
  try{
    const {client, accAddress} = await helper.getClient();

    const token_id = req.params.id;

    queryMsg = {
      nft_dossier: {
        token_id: token_id,
      },
    };

    console.log(`Query public data of token #${token_id}`);
    const response = await client
      .queryContractSmart(process.env.SECRET_NFT_CONTRACT, queryMsg)
      .catch((err) => {
        throw new Error(`Could not execute contract: ${err}`);
      });
    console.log("response: ", response);

    return res.status(200).json({
      'data': response
    });
  } catch(err){
    console.log(err);
    return res.status(500).json({
      'err': err
    });
  }
});

// DELETE /api/network/nfts/:id
// Burn a single NFT of recipe by Id
router.delete('/nfts/:id', async (req, res, next) => {
  try{
    const {client} = await helper.getClient();

    const token_id = req.params.id;

    handleMsg = {
      burn_nft: {
        token_id: token_id,
      },
    };

    console.log(`Removing token #${token_id}`);
    const response = await client
      .execute(process.env.SECRET_NFT_CONTRACT, handleMsg)
      .catch((err) => {
        throw new Error(`Could not execute contract: ${err}`);
      });
    console.log("response: ", response);

    return res.status(200).json({
      'data': response
    });
  } catch(err){
    console.log(err);
    return res.status(500).json({
      'err': err
    });
  }
});

// PUT /api/network/addminters
// Add a minter
router.put('/addminters', async (req, res, next) => {
  try {
    const {client, accAddress} = await helper.getClient();

    handleMsg = {
      add_minters: {
        minters: [req.body.walletAddress],
      },
    };

    const response = await client
      .execute(process.env.SECRET_NFT_CONTRACT, handleMsg)
      .catch((err) => {
        throw new Error(`Could not execute contract: ${err}`);
      });
    console.log("response: ", response);

    return res.status(200).json({
      'data': response
    });
  } catch(err){
    console.log(err);
    return res.status(500).json({
      'err': err
    });
  }
});

// PUT /api/network/pay
// User pay 1 SCRT to see NFT's private metadata
router.put('/pay/:id', async (req, res, next) => {
  try {
    let {client, accAddress} = await helper.getClient(req.body.mnemonic);

    const rcpt = process.env.ADDRESS;
    const memo = 'Pay for NFT Private Metadata';

    // Send 1 SCRT / 1000000 uscrt
    const sent = await client.sendTokens(rcpt, [{ amount: '1000000', denom: 'uscrt' }], memo)
      .catch((err) => { throw new Error(`Could not send tokens: ${err}`); });
    console.log('sent', sent);

    const query = { id: sent.transactionHash };
    const tx = await client.searchTx(query)
      .catch((err) => { throw new Error(`Could not execute the search: ${err}`); });
    console.log('Transaction: ', tx);

    const newClient = await helper.getClient();
    client = newClient.client;
    const token_id = req.params.id;

    handleMsg = {
      reveal: {
        token_id: token_id,
      },
    };

    // Unwraps the sealed private metadata
    const response = await client
      .execute(process.env.SECRET_NFT_CONTRACT, handleMsg)
      .catch((err) => {
        throw new Error(`Could not execute contract: ${err}`);
      });
    console.log("response: ", response);

    return res.status(200).json({
      'data': tx
    });
  } catch(err){
    console.log(err);
    return res.status(500).json({
      'err': err
    });
  }
});

module.exports = router;