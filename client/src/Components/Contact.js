import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
//import { FaCog } from 'react-icons/fa';

import '../App.css';



function Contact(props) {
  const [errors, setErrors] = useState([]);
  const [stories, setStories] = useState([]);


  // Get all incomplete stories
    useEffect(() => {
        fetch(`/api/stories/incomplete`, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(theStories => {
            console.log('Got stories from db: ', theStories);
            let temp = [];
            for(let i in theStories) {
                console.log("Story", theStories[i]);
                temp.push({
                    id: theStories[i]._id,
                    title: theStories[i].title,
                    segCount: theStories[i].segCount,
                    rounds: theStories[i].rounds
                });
            }
            /*
            theStories.foreach((story, i) => {
                temp.push({id: story._id, title: story.title, segCount: story.segCount, rounds: story.rounds});
            });
            */
            console.log("temp:", temp);
            setStories(temp);
        })
        .catch(err => {
            let errorArray = [`Sorry, there was an issue loading stories: ${err}`];
            console.log('Issue loading story: ', err);
            setErrors(errorArray);
        }
        );

    }, []); // Run only one time at start
  

    return (
      <Container fluid >
        {errors.length !== 0
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
        }
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
