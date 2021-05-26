import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';
import Navbar from './components/Navbar';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import AddForm from './pages/AddForm';
import WalletModal from './components/WalletModal';

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [sBalance, setSBalance] = useState('');
  const [openWallet, setOpenWallet] = useState(false);

  return (
    <Router className="App">
      <Navbar
        walletAddress={walletAddress}
        setWalletAddress={setWalletAddress}
        sBalance={sBalance} 
        setSBalance={setSBalance}
        setOpenWallet={setOpenWallet} />
      <Switch>
        <Route path="/addform">
          <AddForm />
        </Route>
        <Route path="/recipe/:id">
          <RecipeDetail setSBalance={setSBalance}/>
        </Route>
        <Route path="/">
          <Recipes />
        </Route>
      </Switch>
      <WalletModal
        openWallet={openWallet}
        setOpenWallet={setOpenWallet}
        setWalletAddress={setWalletAddress}
        setSBalance={setSBalance} />
    </Router>
  );
}

export default App;
