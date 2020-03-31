import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import '../App.css';



function Contact(props) {
  const [errors, setErrors] = useState([]); 
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  //Check for errors on each field and add to error array
  const handleSubmit = () => {
    console.log("Handling submit");
    var errorArray = [];

    
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      errorArray.push("You must enter a valid email address!");
    }
    
    if (subject ==='') {
      errorArray.push("You must enter a subject!");
    }

    if (message ==='') {
      errorArray.push("You must enter a message!");
    }

    
    
    // If no errors, move on to updating story
    if (errorArray.length === 0) {
      sendEmail();
    } else {
      setErrors(errorArray);
    }
  }

   const sendEmail = () => {
     console.log("Sending email from contact form...");
     setSending(true);
    let errorArray = [];
    // Send email to the contributer
    let toSend = {
      subject: "FnP Contact: " + subject,
      email: "johndurso@gmail.com",
      body: message + "<br/><br/>" + email
    }
    fetch('/api/email', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toSend)
    })
    .then(response => response.json())
    .then(resJson => {
      if (resJson.success) {
        setSuccess(true);
      } else {
        setErrors(["There was an issue sending email! Try again later por favor."]);
        setSending(false);
      }
    })
    .catch(err => {
      console.log("Error sending email: ", err);
      errorArray.push(err);
      setErrors(errorArray);
      setSending(false);
    })
    
  }


    return (
      <Container fluid >
        <Row className='justify-content-center'>
            <Col lg={3}>
                <h3 align="center">So kind of you to reach out.</h3>
                <p/>
                <p>
                    If you have any questions, feature requests, bugs to report, or you just want to vent, this is the place to do it:
                </p>
                <div>
                    <Form>
                      <Form.Group controlId="formSubject">
                        <Form.Label>Subject</Form.Label>
                        <Form.Control as="input" placeholder="Be concise here" rows="20" value={subject} onChange={e => setSubject(e.target.value)} />
                      </Form.Group>

                      <Form.Group controlId="formMessage">
                        <Form.Label>
                          Message
                        </Form.Label>
                        <Form.Control as="textarea" placeholder="Be descriptive here" rows="5" value={message} onChange={e => setMessage(e.target.value)} />
                      </Form.Group>

                      <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control required type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
                      </Form.Group>
                      
                      {errors.length !== 0
                        ? <Row>
                            <Col lg={true}>
                              {
                              errors.map((msg, i) => (
                                <Alert key={i} variant='danger'>
                                  {msg}
                                </Alert>
                              ))}
                            </Col>
                          </Row>
                        : null
                      }
                      
                      {success ?

                      <Alert variant='success'>
                        <p>
                          Message sent! You'll hear back shortly.
                        </p>
                      </Alert>

                      : sending ?
                        <Button variant="primary">
                          Sending...
                        </Button>
                        :
                        <Button variant="primary" onClick={handleSubmit}>
                          Send
                        </Button>
                      }
                      
                    </Form>
                </div>
            </Col>
        </Row>
      </Container>
    );
}

export default Contact;
