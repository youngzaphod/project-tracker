import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import Collapse from 'react-bootstrap/Collapse';
import AuthorForm from '../Components/AuthorForm.js';
import { Link } from 'react-router-dom';
//import { FaCog } from 'react-icons/fa';



function Author(props) {
    const [errors, setErrors] = useState([]);
    const [stories, setStories] = useState([]);
    const [cont, setCont] = useState(false);
    const [comp, setComp] = useState(false);
    const [username, setUsername] = useState('Anonymous');
    const [loaded, setLoaded] = useState(false);
    const [success, setSuccess] = useState(false);



  // Get all incomplete stories
    useEffect(() => {
        fetch(`/api/authors/${props.authorEmail}/${props.passID}`, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(resJson => {
            if (resJson.success) {
                let temp = [];
                for(let i in resJson.stories) {
                    temp.push({
                        id: resJson.stories[i]._id,
                        title: resJson.stories[i].title,
                        segCount: resJson.stories[i].segCount,
                        rounds: resJson.stories[i].rounds
                    });
                }
                setStories(temp);
                setCont(resJson.author.contribution);
                setComp(resJson.author.completion);
                setUsername(resJson.author.username);
                setLoaded(true);
                if (temp.length === 0) {
                    setErrors(["There are no stories to display!"]);
                }
            } else {
                setErrors([resJson.error]);
            }
            
            
        })
        .catch(err => {
            let errorArray = [`Sorry, there was an issue loading the info: ${err}`];
            console.log('Issue loading info: ', err);
            setErrors(errorArray);
        });

    }, [props.authorEmail, props.passID]); // Run only one time at start (props.authorEmail won't change)

    const updateAuthor = (contribution, completion, username) => {
        fetch(`/api/authors/${props.authorEmail}/${props.passID}`, {
            method: 'PUT',
            headers: {
            Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contribution: contribution,
                completion: completion,
                username: username
            })
        }).then(response => response.json())
        .then(resJson => {
            if (resJson.success) {
                setSuccess(true);
                setUsername(username);
                setComp(contribution);
                setCont(completion);
                setTimeout(() => setSuccess(false), 3000);
                setErrors([]);
            } else {
                setErrors(["Issue saving information, please try again later"]);
            }
        }).catch(err => {
            console.log('Issue saving info: ', err);
            setErrors(["Issue saving information, please try again later"]);
        });
    }
  

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
        { loaded &&
        <>
        <Row className='justify-content-center'>
            <Col lg={3}>
                <h3>Settings</h3>
                <AuthorForm cont={cont} comp={comp} username={username} updateAuthor={updateAuthor} />
            </Col>
        </Row>
        <Collapse in={success} >
        <Row className='justify-content-center'>
            <Col lg={3}>
                <br/>
                <br/>
                <Alert variant='success'>Successfully updated settings and username</Alert>
            </Col>
        </Row>
        </Collapse>
        <Row className='justify-content-center'>
            <Col lg={6}>
                <h3 align="center">Showing all stories where {username} has contributed</h3>
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
        </>
        }
      </Container>
    );
}

export default Author;
