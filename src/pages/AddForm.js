import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'semantic-ui-react';

import { pinataApiKey, pinataSecretApiKey } from '../config';
import axios from '../axios';

function AddForm() {
  const [title, setTitle] = useState('');
  const [image, setImageURL] = useState('');
  const [body, setBody] = useState('');

  const getFileAndUploadONPinata = async event => {
    try{
      const file = event.target.files[0];

      let formData = new FormData();
      formData.append('file', file);
  
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxContentLength: "Infinity",
        headers: {
          "Content-Type": 'multipart/form-data',
          pinata_api_key: pinataApiKey, 
          pinata_secret_api_key: pinataSecretApiKey,
        }
      })
      console.log(res);
      setImageURL(res.data.IpfsHash);
    } catch(err) {
      console.error(err);
    }
  }

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
              <input type="file" onChange={getFileAndUploadONPinata} />
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