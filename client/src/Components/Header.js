import React, { Component } from 'react';
import { Navbar, Nav, } from 'react-bootstrap';


class Header extends Component {
  
  render() {
    return (
      <Navbar bg='dark' variant='dark' expand='lg'>
        <Navbar.Brand href='#home'>Story Lab</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='mr-auto'>
            <Nav.Link href='#home'>Start a story</Nav.Link>
            <Nav.Link href='#open'>Open stories</Nav.Link>
            <Nav.Link href='#finished'>Finished stories</Nav.Link>
            <Nav.Link href='#contact'>Contact</Nav.Link>
            <Nav.Link href='#about'>What's the deal here?</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;