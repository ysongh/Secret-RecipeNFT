import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Grid, Image, Button } from 'semantic-ui-react';

import axios from '../axios';
import Spinner from '../components/Spinner';

function RecipeDetail({ setSBalance }) {
  const { id } = useParams();
  const [recipe, setRecipe] = useState({});
  const [showRecipe, setShowRecipe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getRecipes = async () => {
      const { data } = await axios.get(`/network/nfts/${id}`);
      console.log(data);
      setRecipe(data.data.nft_dossier.public_metadata);
    }

    if(id) getRecipes();
  }, [id])

  const payToView = async () => {
    try{
      setLoading(true);
      const key = "burner-wallet";
      const loaded = localStorage.getItem(key);
      const { data } = await axios.put('/network/pay', {mnemonic: loaded});
      console.log(data);

      const res = await axios.put('/network/balance', {mnemonic: loaded});
      console.log(res);

      if(+res.data.data?.balance[0].amount){
        setSBalance(+res.data.data?.balance[0].amount / 1000000);
      }
      else{
        setSBalance(0);
      }

      setShowRecipe(true);
      setLoading(false);
    } catch(err){
      console.error(err);
      setLoading(false);
    }
   
  }

  return (
    <Container>
      <h1>Recipe Detail</h1>
      <div style={{ display: 'flex', alignItems: 'start' }}>
        <Card color='orange'>
          <Image src={'https://gateway.pinata.cloud/ipfs/' + recipe.image} wrapped />
          <Card.Content>
            <Card.Header>{recipe.name}</Card.Header>
            <Card.Description>
              {recipe.description}
            </Card.Description>
            <div style={{marginTop: '.7rem'}}>
              <Button basic color='green' onClick={payToView}>
                Pay 1 SCRT to View Secret Recipe
              </Button>
            </div>
            {loading && <Spinner text="Paying..." />}
          </Card.Content>
        </Card>
        {showRecipe && <Card color='orange'>
          <Card.Content>
            <Card.Header>Just add water</Card.Header>
          </Card.Content>
        </Card>}
      </div>
    </Container>
  );
}

export default RecipeDetail;