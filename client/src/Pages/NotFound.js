import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';

import '../App.css';



function NotFound(props) {
  console.log("props.match", props.match);
  if (props.match.path) {
    
  }

    return (
      <Container fluid >
        <Row className='justify-content-center'>
            <Col lg={6}>
              <p></p>
              <Alert style={{textAlign: "center"}} variant='danger'>
                <h3 align="center">This is not the page you are looking for!</h3>
                <h4>{props.errMessage}</h4>
                <p>
                    All communication about this site is managed through the contact form. If this is an issue, please report it there:
                </p>
                <p>
                    <Link to='/contact'>Contact</Link>
                </p>
              </Alert>
            </Col>
        </Row>
        <Row className='justify-content-center'>
          <img src={window.location.origin + '/train-derailment.jpg'} alt="Complete trainwreck"/>
        </Row>
      </Container>
    );
}

export default NotFound;
