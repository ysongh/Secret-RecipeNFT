import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import './App.css';
import Navbar from './components/Navbar';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import AddForm from './pages/AddForm';

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [sBalance, setSBalance] = useState('');

  return (
    <Router className="App">
      <Navbar
        walletAddress={walletAddress}
        setWalletAddress={setWalletAddress}
        sBalance={sBalance} 
        setSBalance={setSBalance} />
      <Switch>
        <Route path="/addform">
          <AddForm />
        </Route>
        <Route path="/recipe/:id">
          <RecipeDetail />
        </Route>
        <Route path="/">
          <Recipes />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
