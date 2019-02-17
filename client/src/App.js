import React, { Component } from 'react';
import Header from './Components/Header';
import ProjectFields from './Components/ProjectFields';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaCog } from 'react-icons/fa';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import './App.css';

class App extends Component {

  state = {
    name: '',
    start: '',
    finish: '',
    test: '',
  }

  handleName = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleDayChange = (day, which) => {
    this.setState({[which]: day});
  }
  
  render() {
    return (
      <Container fluid>
        <Row>
          <Col lg={true}>
            <Header />
          </Col>
        </Row>
        <Row noGutters className='justify-content-center'>
          <Col lg={4} md={6} sm={10}>
            <br/>
            <Form.Control onChange={this.handleName} name='name' size='lg' type='text' placeholder='Project name' />
          </Col>
          <Col lg={1} md={1}>
            <br/>
            <DayPickerInput
              onDayChange={day => this.handleDayChange(day, 'start')}
              component={props => <Form.Control {...props} size='lg' />}
              placeholder='Start'
              inputProps={{size: 6}}
            />
          </Col>
          <Col lg={1} md={1}>
            <br/>
            <DayPickerInput
              onDayChange={day => this.handleDayChange(day, 'finish')}
              component={props => <Form.Control {...props} size='lg' />}
              placeholder='Finish'
              inputProps={{size: 6}}
            />
          </Col>
          <Col sm={1}>
            <br/>
            <Button variant='light'>
              <FaCog size={26} />
            </Button>
          </Col>
        </Row>
        <Row className='justify-content-center'>
          <Col lg={6}>
            <ProjectFields />
          </Col>
        </Row>
        <Row className='justify-content-center'>
          <Col md={2}>
            <Button variant='dark'>
              Save Project
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
