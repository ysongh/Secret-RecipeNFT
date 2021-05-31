import React from 'react';
import { Link } from 'react-router-dom';
import {
  Secp256k1Pen, pubkeyToAddress, encodeSecp256k1Pubkey
} from "secretjs";
import { Menu, Container, Button } from 'semantic-ui-react';

import axios from '../axios';

const key = "burner-wallet";

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

  const disconnectWallet = () => {
    setSBalance('');
    localStorage.clear();
    setWalletAddress(null);
  }

  return (
    <Menu color="black" inverted pointing>
      <Container>
        <Menu.Item
          as={Link}
          to="/"
        >
          <img src='/logo.png' style={{ width: '9rem', marginLeft: '-5px'}} />
        </Menu.Item>
        {walletAddress && (
          <Menu.Item
            as={Link}
            to="/addform"
            name='Add Recipe'
          />
        )}
        {walletAddress ? (
          <Menu.Menu position='right'>
            <Menu.Item>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={"https://explorer.secrettestnet.io/account/" + walletAddress}
              >
                {walletAddress.substring(0,8)}...{walletAddress.substring(34,42)}
              </a>
              
            </Menu.Item>
            <Menu.Item>
              <p>{sBalance} SCRT</p>
            </Menu.Item>
            <Menu.Item>
              <Button color="red" onClick={disconnectWallet}>Disconnect</Button>
            </Menu.Item>
          </Menu.Menu>
        ) : (
          <Menu.Menu position='right'>
            <Menu.Item>
              <Button color='pink' onClick={openWallet}>Open Wallet</Button>
            </Menu.Item>
          </Menu.Menu>
        )}
      </Container>
    </Menu>
  );
}

export default Navbar;