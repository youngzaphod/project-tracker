import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
//import Alert from 'react-bootstrap/Alert';
//import { FaCog } from 'react-icons/fa';

import '../App.css';



function Contact(props) {
  //const [errors, setErrors] = useState([]); 

    return (
      <Container fluid >
        {/*errors.length !== 0
          ? <Row className='justify-content-center'>
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
        */}
        <Row className='justify-content-center'>
            <Col lg={3}>
                <h3 align="center">So kind of you to reach out.</h3>
                <p/>
                <p>
                    I manage all communication about this site through GitHub. If you have any questions, feature requests, 
                    bugs to report, or you just want to vent, that's the place to do it:
                </p>
                <p>
                    <a href="https://github.com/youngzaphod/project-tracker/issues">GitHub Issues</a>
                </p>
            </Col>
        </Row>
      </Container>
    );
}

export default Contact;
