import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
//import { FaCog } from 'react-icons/fa';
import createActivityDetector from 'activity-detector';

import '../App.css';

const charLimit = 1000;
const maxCount = 5;
const timeOut = 15 * 1000 * 60;
const secondTimeOut = 1000 * 60;

function useIdle(options) {
  const [isIdle, setIsIdle] = useState(false);
  console.log("Inside useIdle");
  useEffect(() => {
    const activityDetector = createActivityDetector(options);
    activityDetector.on('idle', () => setIsIdle(true));
    activityDetector.on('active', () => setIsIdle(false));
    return () => activityDetector.stop();
  }, [])
  return isIdle;
}



function Start(props) {
  const isIdle = useIdle({timeToIdle: timeOut, inactivityEvents: []});
  const [loggedOut, setLoggedOut] = useState(false);
  const [writerEmail, setWriterEmail] = useState('');
  const [story, setStory] = useState('');
  const [send, setSend] = useState('');
  const [nextEmail, setNextEmail] = useState('');
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [storyObj, setStoryObj] = useState({segCount: '', segments: []});
  const [logoutTimer, setLogoutTimer] = useState(null);


  // Get previous segments from story, if they exist:
  useEffect(() => {
    // Get story by id, if ID exists
    if (props.storyID) {
      fetch(`/api/stories/${props.storyID}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
              'Content-Type': 'application/json'
          },
        })
        .then(response => response.json())
        .then(theStory => {
          setStoryObj({title: theStory.title, segCount: theStory.segCount, segments: theStory.segments, locked: theStory.locked});
          if (theStory.locked) {
            setLoggedOut(true);
          }
          console.log('Got theStory from db: ', theStory);
        })
        .catch(err => {
          let errorArray = [`Sorry, there was an issue loading the story: ${err}`];
          console.log('Issue loading story: ', err);
          setErrors(errorArray);
        }
      );
      
    }
    // Add event listener to run code before window closes
    window.addEventListener("unload", unlockStory);
    return () => window.removeEventListener("unload", unlockStory);

  }, []); // Run only one time at start

  const unlockStory = (e) => {

    // Check that there is a locked story associate with this session
    if (props.storyID && !success && !loggedOut) {
      navigator.sendBeacon(`/api/stories/${props.storyID}`, JSON.stringify({body: {locked: true}}));
    }
    
  }

  const checkStory = (newValue) => {
    if (newValue.length > charLimit) {
      newValue = newValue.substr(0, charLimit);
      setErrors(errors);
    }
    setStory(newValue);
  }

  //Check for errors on each field and add to error array
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
    
    // If no errors, move on to updating story
    updateStory();
    
  }

  // Update or Create Story in database 
  const updateStory = () => {
    let errorArray = [];

    if (!props.storyID) {
      //If story doesn't already exist, create new Story to be added
      let isPublic = send === 'public' ? true : false;
      console.log(story.substr(0, 15));
      let newStory = {
        title: story.substr(0, 15),
        public: isPublic,
        complete: false,
        nextEmail: nextEmail,
        locked: false,
        segCount: 1,
        segments: {
          author: writerEmail,
          content: story,
          order: 1
        }
      }

      // Add new Story to db
      fetch('/api/stories/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(newStory)
        })
        .then(response => response.json())
        .then(resJson => {
          console.log('Response after adding new story: ', resJson);
          setSuccess(true);
        })
        .catch(err => {
          errorArray.push(`Issue adding story: ${err}`);
          console.log('Issue adding story: ', err);
          setErrors(errorArray);
        }
      );
    } else {
      // Add segment to existing story
      console.log(`Updating story: _id = ${props.storyID}`);
      let newSegments = [...storyObj.segments];
      newSegments.push({author: writerEmail, content: story, order: storyObj.segCount});
      // Build story object for updating
      let finished = ++storyObj.segCount === maxCount ? true : false;
      let storyUpdate = {
        complete: finished,
        nextEmail: nextEmail,
        segCount: storyObj.segCount,
        public: send === 'public' ? true : false,
        segments: newSegments,
        locked: false
      };
      fetch(`/api/stories/${props.storyID}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(storyUpdate)
      })
      .then(response => response.json())
      .then(resJson => {
        //Story has been updated successfully
        console.log("Story update successful", resJson);
        setSuccess(true);
      })
      .catch(err => {
        console.log("Error updating story: ", err);
        errorArray.push(err);
        setErrors(errorArray);
      });
    }
  }

  //Function for logging out user after second timer is done
  const logoutUser = () => {
    console.log("logout user here");
    let storyUpdate = {
      locked: false,
    };
    fetch(`/api/stories/${props.storyID}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(storyUpdate)
    })
    .then(response => response.json())
    .then(resJson => {
      //Story has been updated successfully
      console.log("Story has been unlocked", resJson);
      setLoggedOut(true);
    })
    .catch(err => {
      console.log("Error unlocking story: ", err);
    });
  }

  useEffect(() => {
    // If user became idle, trigger timeout, else if user became active, clear timeout
    if (isIdle && !loggedOut && !success) {

      setLogoutTimer(setTimeout(logoutUser, secondTimeOut));
      console.log("Second timer started, id:", logoutTimer);
    } else {
      clearTimeout(logoutTimer);
      console.log("Clearing timeout; idle, loggedout, timer id:", isIdle, loggedOut, logoutTimer);
    }
    return () => {clearTimeout(logoutTimer)}
  }, [isIdle]);
  
    return (
      <Container fluid>
        <Row>
          <Modal
            backdrop='static'
            show={isIdle && !loggedOut && !success}
            onHide={() =>{}}
            aria-labelledby='contained-modeal-title-vcenter'
            centered>
            <Modal.Header closeButton>
              <Modal.Title>You're about to lose your work...</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <p>You've been idle over 30 minutes!</p>
              <p>Close this popup within a minute to continue working, otherwise the page will automatically close and you'll lose your work!</p>
            </Modal.Body>
          </Modal>
        </Row>
        <Row>
          <Modal backdrop='static' show={loggedOut && !success} size='lg' aria-labelledby='contained-modeal-title-vcenter' centered>
            <Modal.Header>
              <Modal.Title>You don't have access to this story at the moment</Modal.Title>
            </Modal.Header>
            { storyObj.locked
             ?<Modal.Body>
                <p>Someone else is working on it - refresh later to see when it's available.</p>
              </Modal.Body>
             :<Modal.Body>
                <p>You were either idle for over 30 minutes, or you just tried to leave the page. Either way, if you refresh the page and
                you'll have access if no one else is editing.</p>
                <div>{story}</div>
              </Modal.Body>
            }
            <Modal.Footer>
              <Button onClick={() => {window.location.reload()}}>Refresh page</Button>
            </Modal.Footer>
          </Modal>
        </Row>
        <Row className='justify-content-center'>
          <Col lg={6}>
          {props.storyID != null
            ?
              <>
              <h3>Previously on <em>{storyObj.title}</em>...</h3>
              {
                storyObj.segments.map((seg, i) => {
                  return <p key={seg._id}>{seg.content}</p>
                })
              }
              <h3>Now it's your turn to add:</h3>
              </>
            :
              <h3>Start a story, then send it to a friend or the world to complete it</h3>
          }
          </Col>
        </Row>
        
        <Row className='justify-content-center'>
        <Col lg={6}>
          <Form>
            <Form.Group controlId="formStory">
              <Form.Label>Start writing, and don't be too picky, the point is to do your part and pass it along.</Form.Label>
              <Form.Text className="text-muted">
                Max characters: {charLimit} <span style={story.length < charLimit - 100 ? {color:"green"} : {color:"red"}}>Current count: {story.length}</span>
              </Form.Text>
              <Form.Control as="textarea" placeholder="What are you waiting for?" rows="20" value={story} onChange={e => checkStory(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control required type="email" placeholder="Enter email" value={writerEmail} onChange={e => setWriterEmail(e.target.value)} />
              <Form.Text className="text-muted">
                There's no signup, we just need an email to send you notifications when your story is complete, and a link where you can see all the stories you have contributed to.
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
                    <p>Excellent work, your story has been added!</p>
                    {send === 'public'
                      ? <div>
                      <p>It will now be in the public directory where anyone can find it and contibute until its finished.
                      Also, you can share it out on social to get more friends to contribute:</p>
                      <p><a href={window.location.href} target="_blank" rel="noopener noreferrer">{window.location.href}</a></p>
                            <p>You'll get an email with a link to the story, and will be notified via email once more when it's complete.</p>
                        </div>
                      : <p>We sent an email to the {nextEmail} so they can continue the tale.
                          You'll get an email with a link to the story, and will be notified via email once more when it's complete.</p>             
                    }
                  </Alert>

            :
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
            }
          </Form>
        </Col>
        </Row>
        
        
      </Container>
    );
}

export default Start;
