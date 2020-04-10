import React, { Component } from 'react';
import { Navbar, Nav, } from 'react-bootstrap';


class TempHeader extends Component {
  
  render() {
    return (
      <Navbar bg='dark' variant='dark' expand='lg'>
        <Navbar.Brand href='/'>Fold and Pass</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />

      </Navbar>
    );
  }
}

export default TempHeader;