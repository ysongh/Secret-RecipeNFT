import React from 'react';
import { Link } from 'react-router-dom';
import {
  Secp256k1Pen, pubkeyToAddress, encodeSecp256k1Pubkey
} from "secretjs";
import { Menu, Button } from 'semantic-ui-react';

import axios from '../axios';

function Navbar({ walletAddress, setWalletAddress, sBalance, setSBalance, setOpenWallet }) {
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
      if(+data.data?.balance[0].amount){
        setSBalance(+data.data?.balance[0].amount / 1000000);
      }
      else{
        setSBalance(0);
      }
    }
  }

  const openWallet = () => {
    const key = "burner-wallet";
    const loaded = localStorage.getItem(key);
    if (loaded) {
      console.log(loaded);
      burnerWallet(loaded);
      getBalance(loaded);
    }
    else {
      setOpenWallet(true);
    }
  }

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
            <Button color='green' onClick={openWallet}>Open Wallet</Button>
          </Menu.Item>
        </Menu.Menu>
      )}
    </Menu>
  );
}

export default Navbar;