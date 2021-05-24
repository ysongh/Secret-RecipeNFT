import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Grid, Image, Button } from 'semantic-ui-react';

import axios from '../axios';

function Recipes() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState({});
  const [showRecipe, setShowRecipe] = useState(false);

  useEffect(() => {
    const getRecipes = async () => {
      const { data } = await axios.get(`/network/nfts/${id}`);
      console.log(data);
      setRecipe(data.data.nft_dossier.public_metadata);
    }

    if(id) getRecipes();
  }, [id])

  const payToView = async () => {
    const key = "burner-wallet";
    const loaded = localStorage.getItem(key);
    const { data } = await axios.put('/network/pay', loaded);
    console.log(data)
    setShowRecipe(true);
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

export default Recipes;