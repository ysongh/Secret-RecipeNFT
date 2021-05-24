import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Grid, Image, Button } from 'semantic-ui-react';

import axios from '../axios';

function Recipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const getRecipes = async () => {
      const { data } = await axios.get('/network/nfts');
      console.log(data)
      setRecipes(data.data);
    }

    getRecipes();
  }, [])

  return (
    <Container>
      <h1>List of Recipe NFTs</h1>
      <Grid columns={3}>
        <Grid.Row>
          {recipes.map((recipe, index) => (
            <Grid.Column key={index} style={{marginBottom: '1rem'}}>
              <Card color='orange'>
                <Image src={'https://gateway.pinata.cloud/ipfs/' + recipe.image} wrapped />
                <Card.Content>
                  <Card.Header>{recipe.name}</Card.Header>
                  <div style={{marginTop: '.7rem'}}>
                    <Button basic color='green' as={Link} to={`/recipe/${index}`}>
                      View
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            </Grid.Column>
          ))}
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default Recipes;