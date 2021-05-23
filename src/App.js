import React, { useState } from 'react';
import { Container } from 'semantic-ui-react';

import './App.css';
import Navbar from './components/Navbar';
import AddForm from './pages/AddForm';

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
        <AddForm />
      </Container>
    </div>
  );
}

export default App;
