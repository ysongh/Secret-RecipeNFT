import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'semantic-ui-react';

function AddForm() {
  const [title, setTitle] = useState('');
  const [image, setImageURL] = useState('');
  const [body, setBody] = useState('');

  return (
    <Container>
      <Card centered style={{ width: '100%'}}>
        <Card.Content>
          <Form>
            <Form.Field>
              <label>Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </Form.Field>
            <Form.Field>
              <label>Image URL</label>
              <input value={image} onChange={(e) => setImageURL(e.target.value)} />
            </Form.Field>
            <Form.TextArea label='Detail' value={body} onChange={(e) => setBody(e.target.value)} />
            <Button
              type='submit'
              color="black"
            >Submit</Button>
          </Form>
        </Card.Content>
      </Card>
      
    </Container>
  );
}

export default AddForm;