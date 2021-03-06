import React, { Component } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';


class Header extends Component {
  
  render() {
    return (
      <Navbar bg='primary' variant='dark' expand='lg'>
        <Container lg={6}>
        <Navbar.Brand href='/'>
          <img src={ window.location.origin + '/logo-light.png'} height='40px' className='d-inline-block align-top' alt='Fold and Pass logo' />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='mr-auto'>
            <Nav.Link href='/story/'>Start a story</Nav.Link>
            <Nav.Link href='/open/'>Open stories</Nav.Link>
            <Nav.Link href='/complete/'>Finished stories</Nav.Link>
            <Nav.Link href='/faqs/'>FAQs</Nav.Link>
            <Nav.Link href='/contact/'>Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default Header;