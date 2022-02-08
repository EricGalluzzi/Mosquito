import React, { Component } from 'react';

import {Navbar, Container} from 'react-bootstrap';
//handle navBar

function Nav(){
    return(
        <Navbar bg="dark" variant="dark" style={{ marginBottom: '1em' }}>
          <Container>
            <Navbar.Brand className="navbar-brand mx-auto" style={{ fontSize: "1.75em" }}>
              Soil Moisture Data
</Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                Eric Galluzzi : ericbriangall2004@gmail.com
</Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        
    );




}
export default Nav;