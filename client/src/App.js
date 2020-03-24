import React, { useState } from 'react';
import Header from './Components/Header';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { FaCog } from 'react-icons/fa';
import "react-datepicker/dist/react-datepicker.css";

import './App.css';

function App(props) {
  const [writerEmail, setWriterEmail] = useState('');
  const [story, setStory] = useState('');
  const [send, setSend] = useState('');
  const [nextEmail, setNextEmail] = useState('');
  const [errors, setErrors] = useState([]);

  const checkStory = (newValue) => {
    if (newValue.length > 1000) {
      errors.push("You went over the 1000 character limit, so we trunkated your text to 1000 characters. True creativity thrives with constraints");
      setErrors(errors);
    }
    setStory(newValue);
  }

  const handleSubmit = () => {
    var errorArray = [];

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(writerEmail)) {
      errorArray.push("You must enter a valid email address for yourself.");
    }
    if (send ==='') {
      errorArray.push("Choose a way to send the story to the next person!");
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(nextEmail) && send==='friend') {
      errorArray.push("You must enter a valid email address for your friend.");
    }
    if (story ==='') {
      errorArray.push("You forgot the most important part - the story!");
    }
    if (story.length < 3) {
      errorArray.push("Give the story a little more thought. You can do at least 3 characters, can't you?");
    }
    console.log(errorArray);
    errorArray.map((msg, i) => {
      console.log(msg, i);
    })
    setErrors(errorArray);
  }
  
    return (
      <Container fluid>
        <Row>
          <Col lg={true}>
            <Header />
          </Col>
        </Row>
        {errors.length !== 0
          ? <Row>
              <Col lg={true}>
                {
                errors.map((msg) => (
                  <Alert variant='danger'>
                    {msg}
                  </Alert>
                ))}
              </Col>
            </Row>
          : null
        }
      
        <Row className='justify-content-center'>
        <Col lg={4}>
          <Form>
            <Form.Group controlId="formStory">
              <Form.Label>Spin us a tale:</Form.Label>
              <Form.Control as="textarea" placeholder="What are you waiting for?" rows="10" value={story} onChange={e => checkStory(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control required type="email" placeholder="Enter email" value={writerEmail} onChange={e => setWriterEmail(e.target.value)} />
              <Form.Text className="text-muted">
                There's no signup, we just need an email to send you notifications when your story is complete! We will also send you an email
                with a unique link where you can see all the stories you have started and contributed to. Er, to which you have contributed. Sorry.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId='formRadio'>
              <Form.Label>Who do you want to continue the story?</Form.Label>
              
              <div key='sendTo' className='mb-3'>
              <Form.Check
                name='nextWriter'
                type='radio'
                label='Someone I know (enter email below)'
                id='friend'
                onClick = {() => setSend('friend')}
              />
              <Form.Check
                name='nextWriter'
                type='radio'
                label='Anyone!'
                id='public'
                onClick = {() => setSend('public')}
              />
              </div>
            </Form.Group>
            {send === 'friend' ?
              <Form.Group controlId="formNextEmail">
                <Form.Label>Email of the person to continue the story:</Form.Label>
                <Form.Control
                  placeholder="Enter friend's email"
                  type="email"
                  value={nextEmail}
                  onChange={e => setNextEmail(e.target.value)}
                />
                <Form.Text className="text-muted">
                  Enter the email address of the person you want to continue the story.
                After they write, they'll do the same, and so on until the story is finished, at which point you'll get an email notification
                to read the full story!
                </Form.Text>
              </Form.Group>
            : null }
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Form>
        </Col>
        </Row>
      </Container>
    );
}

export default App;
