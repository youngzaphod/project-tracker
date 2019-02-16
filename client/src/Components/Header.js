import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';


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
            <NavDropdown title="Dat Dropdown" id='basic-nav-dropdown'>
              <NavDropdown.Item href='#action/3.1'>Action 1</NavDropdown.Item>
              <NavDropdown.Item href='#action/3.2'>Action 2</NavDropdown.Item>
              <NavDropdown.Item href='#action/3.2'>Action 3</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href='#different'>Different!</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;