import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
//import { FaCog } from 'react-icons/fa';

import '../App.css';



function Home(props) {
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
            <Col lg={6}>
                <h3 align="center">Miss activities with friends?</h3>
                <h4 align="center">Enjoy writing but don't have a ton of time?</h4>
                <p>
                    Having nowhere to go (thanks 'rona!) and a week of vacation, I decided to create this
                    app based on a game my friends and I used to play in Jr. High and High School. Basically,
                    someone starts a story, leaves a hanging sentence or paragraph, and passes it to the next person. I created
                    this simple app so you can play with people all over the world, friends or no.
                </p>
                <p>
                    You can do this with friends, post links to your story to social media, send via email, and post on
                    the public board here.
                </p>
            <div align="center">
                <Link to="/story/">
                    <Button variant="primary">
                        Start a story
                    </Button>
                </Link>
            </div>
            </Col>
        </Row>
        <Row className='justify-content-center'>
            <Col lg={6}>
                <h3>Add on to someone else's story</h3>
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

export default Home;
