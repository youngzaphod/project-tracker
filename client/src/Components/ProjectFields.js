import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

const options = [
  { key: '.com', text: '.com', value: '.com' },
  { key: '.net', text: '.net', value: '.net' },
  { key: '.org', text: '.org', value: '.org' },
]

class ProjectFields extends Component {
    state = {
        name: '',
    }
  
  render() {
    return (
      <Container>
        <Form.Control size='lg' type='text' placeholder='Project name' />

      </Container>
    );
  }
}

export default ProjectFields;