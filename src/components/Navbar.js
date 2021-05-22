import React, { useState } from 'react';
import { Menu, Button } from 'semantic-ui-react'

function Navbar() {
  const [loggedIn, setLoggedIn] = useState(null);

  return (
    <Menu color="blue" inverted pointing>
      <Menu.Item
        to="/"
        name='Secret Funder'
      />
      {loggedIn ? (
        <Menu.Menu position='right'>
          <Menu.Item>
            <Button secondary >Logout</Button>
          </Menu.Item>
        </Menu.Menu>

      ) : (
        <Menu.Menu position='right'>
          <Menu.Item>
            <Button color='green'>Open Wallet</Button>
          </Menu.Item>
        </Menu.Menu>
      )}
    </Menu>
  );
}

export default Navbar;