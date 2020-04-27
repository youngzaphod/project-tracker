import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
//import { FaCog } from 'react-icons/fa';

import '../App.css';



function Author(props) {
  const [errors, setErrors] = useState([]);
  const [stories, setStories] = useState([]);


  // Get all incomplete stories
    useEffect(() => {
        fetch(`/api/authors/${props.authorEmail}`, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(theStories => {
            let temp = [];
            for(let i in theStories) {
                temp.push({
                    id: theStories[i]._id,
                    title: theStories[i].title,
                    segCount: theStories[i].segCount,
                    rounds: theStories[i].rounds
                });
            }

            console.log("temp:", temp);
            setStories(temp);
            if (temp.length === 0) {
                setErrors(["Sorry, there are no stories to display!"]);
            }
            
        })
        .catch(err => {
            let errorArray = [`Sorry, there was an issue loading stories: ${err}`];
            console.log('Issue loading story: ', err);
            setErrors(errorArray);
        }
        );

    }, [props.authorEmail]); // Run only one time at start (props.authorEmail won't change)
  

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
            <Col lg={6}>
                <h3 align="center">Showing all stories where {props.authorEmail} has contributed</h3>
            </Col>
        </Row>
        <Row className='justify-content-center'>
            <Col lg={6}>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th width="70%">Story title</th>
                            <th>Rounds left</th>
                            <th>Rounds total</th>
                        </tr>
                    </thead>
                    <tbody>
                        { stories.map((story, i) => (
                            <tr key={story.id}>
                                <td width="70%"><Link to={"/story/" + story.id}>{story.title}</Link></td>
                                <td>{story.rounds - story.segCount}</td>
                                <td>{story.rounds}</td>
                            </tr>
                        ))
                        }
                    </tbody>

                </Table>
            </Col>
        </Row>
      </Container>
    );
}

export default Author;
