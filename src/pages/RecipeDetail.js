import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Grid, Image, Button } from 'semantic-ui-react';

import axios from '../axios';
import Spinner from '../components/Spinner';

function RecipeDetail({ walletAddress, setSBalance }) {
  const { id } = useParams();
  const [recipe, setRecipe] = useState({});
  const [showRecipe, setShowRecipe] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getRecipes = async () => {
      const { data } = await axios.get(`/network/nfts/${id}`);
      console.log(data);
      setRecipe(data.data.nft_dossier.public_metadata);

      if(data.data.nft_dossier.private_metadata){
        setShowRecipe(data.data.nft_dossier.private_metadata.description);
      }
    }

    if(id) getRecipes();
  }, [id])

  const payToView = async () => {
    try{
      setLoading(true);
      const key = "burner-wallet";
      const loaded = localStorage.getItem(key);
      const { data } = await axios.put(`/network/pay/${id}`, {mnemonic: loaded});
      console.log(data);

      const res = await axios.put('/network/balance', {mnemonic: loaded});
      console.log(res);

      if(+res.data.data?.balance[0].amount){
        setSBalance(+res.data.data?.balance[0].amount / 1000000);
      }
      else{
        setSBalance(0);
      }

      const privateData = await axios.get(`/network/nfts/${id}`);
      console.log(privateData.data.data);

      setShowRecipe(privateData.data.data.nft_dossier.private_metadata.description);
      setLoading(false);
    } catch(err){
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <Container className="bodyHeight">
      <h1>Recipe Detail</h1>
      <Grid divided='vertically'>
        <Grid.Row columns={2}>
          <Grid.Column mobile={16} tablet={8} computer={5}>
            <Card color='orange'>
              <Image src={'https://gateway.pinata.cloud/ipfs/' + recipe.image} wrapped />
              <Card.Content>
                <Card.Header>{recipe.name}</Card.Header>
                <Card.Description>
                  {recipe.description}
                </Card.Description>
                <div style={{marginTop: '.7rem'}}>
                  {(walletAddress && !showRecipe) && <Button color='black' onClick={payToView}>
                    Pay 1 SCRT to View Secret Recipe
                  </Button>}
                </div>
                {loading && <Spinner text="Paying..." />}
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={8} computer={11}>
            {showRecipe &&
              <Card color='orange' fluid>
                <Card.Content>
                  <Card.Header>Secret Recipe</Card.Header>
                  <Card.Description>
                    {showRecipe}
                  </Card.Description>
                </Card.Content>
              </Card>
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default RecipeDetail;