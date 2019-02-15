import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Milestone from './Milestone';
import Task from './Task';
import Form from 'react-bootstrap/Form';

class ProjectFields extends Component {
  state = {
      name: '',
  }
  
  render() {
    return (
      <div>
        <ul>
          <li>
            <Milestone id='one' />
          </li>
          <ul>
              <li>
                <Task id='one' />
              </li>
              <li>
                <Task id='two' />
              </li>
              <li>
                <Task id='three' />
              </li>
            </ul>
        </ul>
        <ListGroup as='ul' variant='flush'>
          <ListGroup.Item>
            <Form.Control className='milestone-input' size='md' type='text' placeholder='New milestone' />
          </ListGroup.Item>
          <ListGroup.Item>
            <ListGroup as='ul' variant='flush'>
              <ListGroup.Item>
                <Form.Control className='task-input' size='sm' type='text' placeholder='New task' />
              </ListGroup.Item>
              <ListGroup.Item>
                <Form.Control className='task-input' size='sm' type='text' placeholder='New task' />
              </ListGroup.Item>
              <ListGroup.Item>
                <Form.Control className='task-input' size='sm' type='text' placeholder='New task' />
              </ListGroup.Item>
              <ListGroup.Item>
                <Form.Control className='task-input' size='sm' type='text' placeholder='New task' />
              </ListGroup.Item>

            </ListGroup>
          </ListGroup.Item>
          <ListGroup.Item>
            <Form.Control className='milestone-input' size='md' type='text' placeholder='New milestone' />
          </ListGroup.Item>
          <ListGroup.Item>
            <ListGroup as='ul' variant='flush'>
              <ListGroup.Item>
                <Form.Control className='task-input' size='sm' type='text' placeholder='New task' />
              </ListGroup.Item>
              <ListGroup.Item>
                <Form.Control className='task-input' size='sm' type='text' placeholder='New task' />
              </ListGroup.Item>
              <ListGroup.Item>
                <Form.Control className='task-input' size='sm' type='text' placeholder='New task' />
              </ListGroup.Item>
              <ListGroup.Item>
                <Form.Control className='task-input' size='sm' type='text' placeholder='New task' />
              </ListGroup.Item>

            </ListGroup>
          </ListGroup.Item>

        </ListGroup>

      </div>
    );
  }
}

export default ProjectFields;