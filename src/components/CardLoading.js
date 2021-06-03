import React from 'react';
import { Card, Button, Placeholder } from 'semantic-ui-react'

function CardLoading() {
  return (
    <Card.Group doubling itemsPerRow={3} stackable>
      {Array(6).fill(1).map((el, i) => (
        <Card key={i}>
          <Placeholder style={{height: '15rem'}}>
            <Placeholder.Image square/>
          </Placeholder>
          <Card.Content>
            <Placeholder>
              <Placeholder.Header>
                <Placeholder.Line length='medium' />
              </Placeholder.Header>
            </Placeholder>
            <Button style={{marginTop: '.9rem'}} disabled color='black'>
              View
            </Button>
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  )
}

export default CardLoading;