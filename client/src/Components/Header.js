import React, { Component } from 'react';
import { Navbar, Nav, } from 'react-bootstrap';


class Header extends Component {
  
  render() {
    return (
      <Navbar bg='dark' variant='dark' expand='lg'>
        <Navbar.Brand href='#home'>Project Tracker</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='mr-auto'>
            <Nav.Link href='#home'>Home</Nav.Link>
            <Nav.Link href='#projects'>Projects</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;