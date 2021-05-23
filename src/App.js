import React, { useState } from 'react';
import { Container } from 'semantic-ui-react';

import './App.css';
import Navbar from './components/Navbar';

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [sBalance, setSBalance] = useState('');

  return (
    <div className="App">
      <Navbar
        walletAddress={walletAddress}
        setWalletAddress={setWalletAddress}
        sBalance={sBalance} 
        setSBalance={setSBalance} />
      <Container>
        <p>{walletAddress}</p>
      </Container>
    </div>
  );
}

export default App;
