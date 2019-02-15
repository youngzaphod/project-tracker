import React, { Component } from 'react';
import Header from './Components/Header';
import ProjectFields from './Components/ProjectFields';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import './App.css';

class App extends Component {
  
  render() {
    return (
      <Container>
        <Header />
        <Col m={6} lg={6}>
          <Form.Control size='lg' type='text' placeholder='Project name' />
        </Col>
        <Col m={6} lg={6}>
          <ProjectFields />
        </Col>
      </Container>
    );
  }
}

export default App;
