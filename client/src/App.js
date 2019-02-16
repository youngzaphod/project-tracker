import React, { Component } from 'react';
import Header from './Components/Header';
import ProjectFields from './Components/ProjectFields';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import './App.css';

class App extends Component {
  
  render() {
    return (
      <Container>
        <Header />
        <Col m={6} lg={6}>
          <br/>
          <InputGroup className='mb-3'>
            <Form.Control style={{width: '60%'}} size='lg' type='text' placeholder='Project name' />
            <Form.Control size='lg' type='text' placeholder='Start' />
            <Form.Control size='lg' type='text' placeholder='Finish' />
          </InputGroup>
        </Col>
        <Col m={6} lg={6}>
          <ProjectFields />
        </Col>
      </Container>
    );
  }
}

export default App;
