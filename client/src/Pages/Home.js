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
            let temp = [];
            for(let i in theStories) {
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
                <h3 align="center">'Rona got you down?</h3>
                <p><br/></p>
                <p>
                    Shakespeare wrote Macbeth and King Lear while quarantined from the Bubonic plague, and he didn't even have any cool apps
                    like this. Imagine what you can do! Here's how it works:
                </p>
                <p>
                    Someone (possibly you!) starts a story, leaves a hanging sentence or paragraph, chooses a number of rounds,
                     and passes it via the interwebs to the next person to continue, and so on until the number of rounds is complete.
                     So simple you can do it even if you're not Shakespeare.
                </p>
                <p>
                    You can do this with friends, post links to your story to social media, send via email, and post on
                    the public board here.
                </p>
                <p></p>
                <br/>
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
