import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Secp256k1Pen, pubkeyToAddress, encodeSecp256k1Pubkey
} from "secretjs";
import { Menu, Button } from 'semantic-ui-react';
import { Bip39, Random } from "@iov/crypto";

import axios from '../axios';

function Navbar({ walletAddress, setWalletAddress, sBalance, setSBalance }) {
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    async function burnerWallet(mnemonic){
      const pen = await Secp256k1Pen.fromMnemonic(mnemonic);
      const pubkey = encodeSecp256k1Pubkey(pen.pubkey);
      const address = pubkeyToAddress(pubkey, "secret");
      const signer = (signBytes) => pen.sign(signBytes);
      console.log({ address, signer });
      setWalletAddress(address);
    }

    async function getBalance(mnemonic){
      if(mnemonic){
        const { data } = await axios.put('/network/balance', {mnemonic});
        console.log(data);
        setSBalance(+data.data.balance[0].amount / 10000000);
      }
    }

    const key = "burner-wallet";
    const loaded = localStorage.getItem(key);
    if (loaded) {
      console.log(loaded);
      burnerWallet(loaded);
      getBalance(loaded);
    }
    else {
      const generated = Bip39.encode(Random.getBytes(16)).toString();
      localStorage.setItem(key, generated);
      console.log(generated);
      burnerWallet(generated);
      getBalance(generated);
    }
  }, [])

  return (
    <Menu color="blue" inverted pointing>
      <Menu.Item
        as={Link}
        to="/"
        name='Secret Recipe NFT'
      />
      <Menu.Item
        as={Link}
        to="/addform"
        name='Add Recipe'
      />
      {walletAddress ? (
        <Menu.Menu position='right'>
          <Menu.Item>
            <p>{sBalance} SCRT</p>
          </Menu.Item>
          <Menu.Item>
            <Button secondary>Disconnect</Button>
          </Menu.Item>
        </Menu.Menu>
      ) : (
        <Menu.Menu position='right'>
          <Menu.Item>
            <Button color='green'>Open Wallet</Button>
          </Menu.Item>
        </Menu.Menu>
      )}
    </Menu>
  );
}

export default Navbar;