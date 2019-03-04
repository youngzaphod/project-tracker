import React, { Component } from 'react';
import Header from './Components/Header';
import ProjectFields from './Components/ProjectFields2';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { FaCog } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    // let startState = {
    //   startErrorMsg: '',
    //   finishErrorMsg: '',
    //   errMessage: ''
    // };
    // this.state = startState;

    this.state = {
      name: '',
      start: '',
      finish: '',
      startErrorMsg: '',
      finishErrorMsg: '',
      errMessage: '',
    }

  }

  componentDidMount() {
    fetch('/api/projects/5c73478fb7d151384c46798b', {
        method: 'GET',
        headers: {
          Accept: 'application/x-www-form-urlencoded',
          'Content-Type': 'x-www-form-urlencoded',
        }
      })
      .then(response => response.json())
      .then(resJson => {
        console.log('resJson id: ', resJson._id);
        this.setState({
          name: resJson.projectName,
          milestones: resJson.mstoneIds,
          projectId: resJson._id,
        }, () => console.log('state _id: ', this.state.projectId));
      })
      .catch(err => {
        this.setState({
          errMessage: `Issue loading project: ${err}`,
        });
        console.log('Issue loading project: ', err);
      });
      
  }

  handleName = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleDayChange = (date, which) => {
    let error = '';
    console.log(date);
    if ((which === 'start' && this.state.finish !== '' && date > this.state.finish) ||
      (which === 'finish' && this.state.start !== '' && date < this.state.start)) {
      error = 'Start date must come before finish date!';
    }
    this.setState({
      [which]: date,
      errMessage: error
    });
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
          <Col lg={4} md={5} sm={10}>
            <br/>
            <Form.Control onChange={this.handleName} name='name' size='lg' type='text' placeholder='Project name' />
          </Col>
          <Col lg={2} md={2} sm={5} xs={12}>
            <br/>
            <DatePicker
              maxDate={this.state.finish !== '' ? this.state.finish : null}
              placeholderText='Start'
              showMonthDropdown
              showYearDropdown
              customInput={
                <Form.Control
                  onClick={this.props.onClick}
                  size='lg'
                  value={this.props.value}
                />
              }
              onChange={date => this.handleDayChange(date, 'start')}
              selected={this.state.start !== '' ? this.state.start : null}
            />
          </Col>
          <Col lg={2} md={2} sm={5} xs={12}>
            <br/>
            <DatePicker
              minDate={this.state.start !== '' ? this.state.start : null}
              placeholderText='Finish'
              customInput={
                <Form.Control
                  onClick={this.props.onClick}
                  size='lg'
                  value={this.props.value}
                />
              }
              onChange={date => this.handleDayChange(date, 'finish')}
              selected={this.state.finish !== '' ? this.state.finish : null}
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
          <Col lg={6} md={10} sm={8} xs={12}>
            {this.state.errMessage !== '' ?
            <Alert variant='danger'>
              {this.state.errMessage}
            </Alert>
            : ''
            }
          </Col>
        </Row>
        <Row className='justify-content-center'>
          <Col lg={6}>
          {this.state.projectId && 
            <ProjectFields
              milestones={this.state.milestones}
              projectId={this.state.projectId}
            />
          }
          </Col>
        </Row>
        <Row className='justify-content-center'>
          <Col md={2} sm={3} xs={12}>
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
