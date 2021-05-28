import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'semantic-ui-react';

import { pinataApiKey, pinataSecretApiKey } from '../config';
import axios from '../axios';
import Spinner from '../components/Spinner';

function AddForm() {
  const [title, setTitle] = useState('');
  const [image, setImageURL] = useState('');
  const [body, setBody] = useState('');
  const [secretDescription, setSecretDescription] = useState('');
  const [transaction, setTransaction] = useState('');
  const [loading, setLoading] = useState(false);

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

  const createRecipeNFT = async () => {
    try{
      setLoading(true);
      const recipeData = {
        name: title,
        image,
        description: body,
        secretDescription: secretDescription
      }
  
      const {data} = await axios.post("/network/createnft", recipeData)
      setTransaction(data.data.transactionHash);
      setTitle('');
      setImageURL('');
      setBody('');
      setSecretDescription('');
      setLoading(false);
    } catch(err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <Container>
      <Card centered style={{ width: '600px'}}>
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
            <Form.TextArea label='Secret Recipe' value={secretDescription} onChange={(e) => setSecretDescription(e.target.value)} />
            {transaction && <a
              target="_blank"
              rel="noopener noreferrer"
              href={"https://explorer.secrettestnet.io/transactions/" + transaction}>Success, See transaction</a>}
            <br />
            <br />
            <Button
              type='submit'
              color="black"
              onClick={createRecipeNFT}
            >Submit</Button>
            {loading && <Spinner text="Creating NFT..." />}
          </Form>
        </Card.Content>
      </Card>
      
    </Container>
  );
}

export default AddForm;