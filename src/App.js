import React, { useState } from 'react';
import { Container } from 'semantic-ui-react';

import './App.css';
import Navbar from './components/Navbar';

function App() {
  const [walletAddress, setWalletAddress] = useState('');

  return (
    <div className="App">
      <Navbar walletAddress={walletAddress} setWalletAddress={setWalletAddress} />
      <Container>
        <p>{walletAddress}</p>
      </Container>
    </div>
  );
}

export default App;
