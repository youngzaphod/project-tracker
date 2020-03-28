import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
//import { FaCog } from 'react-icons/fa';
import createActivityDetector from 'activity-detector';
import { FacebookShareButton, EmailShareButton, TwitterShareButton, EmailIcon, FacebookIcon, TwitterIcon } from "react-share";


import '../App.css';

const charLimit = 1000;
const timeOut = 15 * 1000 * 60;
const secondTimeOut = 1 * 1000 * 60;

function useIdle(options) {
  const [isIdle, setIsIdle] = useState(false);
  console.log("Inside useIdle");
  useEffect(() => {
    const activityDetector = createActivityDetector(options);
    activityDetector.on('idle', () => setIsIdle(true));
    activityDetector.on('active', () => setIsIdle(false));
    return () => activityDetector.stop();
  }, [options])
  return isIdle;
}



function Start(props) {
  const isIdle = useIdle({timeToIdle: timeOut, inactivityEvents: []});
  const [loggedOut, setLoggedOut] = useState(false);
  const [rounds, setRounds] = useState(5);
  const [writerEmail, setWriterEmail] = useState('');
  const [story, setStory] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [storyObj, setStoryObj] = useState({segCount: '', segments: []});
  const [logoutTimer, setLogoutTimer] = useState(null);
  const [newStoryID, setNewStoryID] = useState('');

  const unlockStory = () => {
    if (props.storyID && !success && !loggedOut) {
      navigator.sendBeacon(`/api/stories/${props.storyID}`, JSON.stringify({body: {locked: true}}));
    }
  }

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
          setStoryObj({
            title: theStory.title,
            segCount: theStory.segCount,
            segments: theStory.segments,
            locked: theStory.locked,
            complete: theStory.complete,
            rounds: theStory.rounds
          });
          if (theStory.locked && !theStory.complete) {
            console.log("Setting loggedout on entry");
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
    //window.addEventListener("beforeunload", confirmLeave);
    window.addEventListener("unload", unlockStory);
    return () => {
      //window.removeEventListener("beforeunload", confirmLeave);
      window.removeEventListener("unload", unlockStory);

    }

  }, []); // Run only one time at start

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
    if (story ==='') {
      errorArray.push("You forgot the most important part - the story!");
    }
    if (story.length < 3) {
      errorArray.push("Give the story a little more thought. You can do at least 3 characters, can't you?");
    }
    
    setErrors(errorArray);
    // If no errors, move on to updating story
    if (errorArray.length === 0) {
      updateStory();
      
    }
  }

  // Update or Create Story in database 
  const updateStory = () => {
    let errorArray = [];

    if (!props.storyID) {
      //If story doesn't already exist, create new Story to be added
      console.log(story.substr(0, 15));
      console.log("isPublic");
      let newStory = {
        title: story.substr(0, 15),
        isPublic: isPublic,
        rounds: rounds,
        complete: false,
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
          setNewStoryID(resJson._id);
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
      let finished = ++storyObj.segCount === storyObj.rounds ? true : false; // Increment segCont and check if story is complete
      console.log("segCount", storyObj.segCount, "rounds", storyObj.rounds)
      let storyUpdate = {
        complete: finished,
        segCount: storyObj.segCount,
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
        setNewStoryID(resJson._id);
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

  // If user became idle, trigger timeout, else if user became active, clear timeout
  useEffect(() => {
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
            show={isIdle && !loggedOut && !success && !storyObj.complete}
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
          <Modal backdrop='static' show={loggedOut && !success && storyObj.complete} size='lg' aria-labelledby='contained-modeal-title-vcenter' centered>
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
            ? !storyObj.complete
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
                <>
                <h3><em>{storyObj.title}</em></h3>
                <br/>
                {
                  storyObj.segments.map((seg, i) => {
                    return <p key={seg._id}>{seg.content}</p>
                  })
                }
                </>
            :
              <h3>Start a story, then send it to a friend or the world to complete it</h3>
          }
          </Col>
        </Row>
        {!storyObj.complete && 
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
                {!props.storyID &&
                  <>
                  <Form.Group controlId='formRadio'>
                    <Form.Label>How many rounds do you want the story to go? You're the first round, and we'll automatically close the story after the number of rounds you select. </Form.Label>
                    
                    <div key='rounds' className='mb-3'>
                    <Form.Check
                      name='rounds'
                      type='radio'
                      label='5 rounds'
                      id='five'
                      defaultChecked = {true}
                      onClick = {() => setRounds(5)}
                    />
                    <Form.Check
                      name='rounds'
                      type='radio'
                      label='10 rounds'
                      id='ten'
                      onClick = {() => setRounds(10)}
                    />
                    </div>
                  </Form.Group>
                  <Form.Group controlId='makePublic'>
                    <Form.Check
                      name='public'
                      type='checkbox'
                      label='Post story on the Open stories page for others to find and contribute'
                      id='public'
                      defaultChecked = {true}
                      onClick = {(e) => setIsPublic(e.target.checked)}
                    />
                  </Form.Group>
                  </>
                }
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
                        <p>Excellent work! Now it's time to pass the torch. Anyone with the link below can add to your story; it's up to you to send to a single friend or post on social and see who adds:</p>
                        <p><Link to={"/story/" + newStoryID}>
                          {window.location.href+""+ (props.storyID ? "" : newStoryID)}
                          </Link>
                        </p>
                        <p></p>
                        <a target="_blank" href={"mailto:?subject=Continue the story&body=It's not peer pressure, it's just your turn 😁 %0d%0a %0d%0a I contributed to a story on foldandpass.com. Write with me here: %0d%0a"+ window.location.href + (props.storyID ? "" : newStoryID)}>
                          <EmailIcon round={true} size={40} />
                        </a>
                        <div className="fb-share-button" data-href="https://foldandpass.com/story/5e7f9eb928e50b000467e107" data-layout="button" data-size="large">
                          <a target="_blank" href={"https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Ffoldandpass.com%2Fstory%" + newStoryID +"&amp;src=sdkpreparse"}
                            className="fb-xfbml-parse-ignore">
                            <FacebookIcon round={true} size={40}/>
                          </a>
                        </div>
                        <TwitterShareButton url={window.location.href+""+ (props.storyID ? "" : newStoryID)}>
                          <TwitterIcon round={true} size={40}/>
                        </TwitterShareButton>
                        <p>You'll also get an email with a link to the story, and will be notified via email once more when it's complete.</p>
                        {isPublic
                          ? <p>It will now be in the public directory where anyone can find it and contibute until its finished.</p>
                          : <p>You did not select "public", so your story will not appear on the Open Stories page.</p>
                        }
                      </Alert>

                :
                <Button variant="primary" onClick={handleSubmit}>
                  Publish
                </Button>
                }
              </Form>
            </Col>
          </Row>
        }
        
      </Container>
    );
}

export default Start;
