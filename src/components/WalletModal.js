import React, {useState} from 'react';
import { Button, Icon, Modal } from 'semantic-ui-react';
import {
  Secp256k1Pen, pubkeyToAddress, encodeSecp256k1Pubkey
} from "secretjs";
import { Bip39, Random } from "@iov/crypto";

import axios from '../axios';

const key = "burner-wallet";

function WalletModal({ setOpenWallet, openWallet, setWalletAddress, setSBalance }) {
  const [mode, setMode] = useState("start");
  const [words, setWords] = useState("");

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
        setSBalance(+data.data?.balance[0].amount / 10000000);
      }
      else{
        setSBalance(0);
      }
    }
  }

  const createWallet = () => {
    const generated = Bip39.encode(Random.getBytes(16)).toString();
    localStorage.setItem(key, generated);
    console.log(generated);
    burnerWallet(generated);
    getBalance(generated);
    setMode("create");
    setWords(generated);
  }

  return (
    <Modal
      onClose={() => setOpenWallet(false)}
      onOpen={() => setOpenWallet(true)}
      open={openWallet}
      dimmer='inverted'
      size="tiny"
    >
      <Modal.Header>Secret Network Wallet</Modal.Header>
      <Modal.Content>
        {mode === "start" && (
           <Modal.Description className="modal-body">
            <center className="modal-icon" onClick={createWallet}>
              <Icon name='add' size='massive' />
              <p>Create Wallet</p>
            </center>
            <center className="modal-icon">
              <Icon name='key' size='massive' />
              <p>Import Wallet</p>
            </center>
          </Modal.Description>
        )}
        {mode === "create" && (
          <Modal.Description>
             <h4>Your Seed Phase</h4>
            <p>{words}</p>
          </Modal.Description>
        )}
       
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpenWallet(false)}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default WalletModal