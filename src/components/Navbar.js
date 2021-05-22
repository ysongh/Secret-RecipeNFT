import React, { useEffect, useState } from 'react';
import {
  Secp256k1Pen, pubkeyToAddress, encodeSecp256k1Pubkey
} from "secretjs";
import { Menu, Button } from 'semantic-ui-react';
import { Bip39, Random } from "@iov/crypto";

function Navbar({ walletAddress, setWalletAddress }) {
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

    const key = "burner-wallet";
    const loaded = localStorage.getItem(key);
    if (loaded) {
      console.log(loaded);
      burnerWallet(loaded);
    }
    else {
      const generated = Bip39.encode(Random.getBytes(16)).toString();
      localStorage.setItem(key, generated);
      console.log(generated);
      burnerWallet(generated);
    }
  }, [])

  return (
    <Menu color="blue" inverted pointing>
      <Menu.Item
        to="/"
        name='Secret Funder'
      />
      {walletAddress ? (
        <Menu.Menu position='right'>
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