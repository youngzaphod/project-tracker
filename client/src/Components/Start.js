import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import { Redirect } from 'react-router-dom';
//import { FaCog } from 'react-icons/fa';
import { TwitterShareButton, EmailIcon, FacebookIcon, TwitterIcon } from "react-share";

import ifvisible from 'ifvisible.js';
import '../App.css';

const charLimit = 1000;
const timeOut =  3;


ifvisible.setIdleDuration(timeOut); // Set how long it takes to give logout warning in seconds


function Start(props) {
  const history = useHistory();
  const [loggedOut, setLoggedOut] = useState(false);
  const [rounds, setRounds] = useState(5);
  const [writerEmail, setWriterEmail] = useState('');
  const [story, setStory] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [storyObj, setStoryObj] = useState({segCount: '', segments: []});
  const [newStoryID, setNewStoryID] = useState('');
  const [first, setFirst] = useState(true);
  const [hopo, setHopo] = useState(false); // Tracking if honeypots are filled in

  // Get previous segments from story, if they exist:
  useEffect(() => {

    const sendIdleMessage = () => {
      console.log("I'm idlin'!");
      props.socket.emit("startIdle", 'idle');
    }
    const sendBlurMessage = () => {
      console.log("I'm blurred'!");
      props.socket.emit("startIdle", 'blur');
    }

    const sendActiveMessage = () => {
      console.log("I'm active!");
      props.socket.emit("startActive", 'active');
    }

    // Send active and idle messages to server, where it will keep time
    ifvisible.idle(sendIdleMessage);
    ifvisible.blur(sendBlurMessage);

    ifvisible.focus(sendActiveMessage);
    ifvisible.wakeup(sendActiveMessage);

    //const socket = io();
    props.socket.on("loggedOut", msg => {
      console.log("Logged out message:", msg);
      setLoggedOut(true);
    });

    props.socket.on("disconnect", () => {
      console.log("Disconnected, so logged out of story");
      setLoggedOut(true);
    });

    props.socket.on("id", id => {
      console.log("ID:", id);
    });


    // Get story by id, if ID exists
    if (props.storyID) {
      setFirst(false);
      fetch(`/api/stories/${props.storyID}`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        })
        .then(response => response.json())
        .then(theStory => {
          if (theStory.error) {
            console.log("Should redirect now...");
            props.history.push("/NotFound");
            return <Redirect to="/NotFound" />
          }
          setStoryObj({
            title: theStory.title,
            segCount: theStory.segCount,
            segments: theStory.segments,
            locked: theStory.locked,
            complete: theStory.complete,
            rounds: theStory.rounds,
            authors: theStory.authors
          });

          if (theStory.locked && !theStory.complete) {
            console.log("Setting loggedout on entry");
            setLoggedOut(true);
          }

          // Send info to server for tracking loggedOut state and ID for backend logout
          if (!theStory.locked && !theStory.complete) {
            props.socket.emit('setup', { storyID: props.storyID, loggedOut: false });
          }


        })
        .catch(err => {
          let errorArray = [`Sorry, there was an issue loading the story: ${err}`];
          console.log('Issue loading story: ', err);
          setErrors(errorArray);
        }
      );
      
    }
    
    return () => {
      // Remove listeners when page is unloaded
      ifvisible.off('blur');
      ifvisible.off('idle');
      ifvisible.off('focus');
      ifvisible.off('wakeup');
      props.socket.removeAllListeners();

      // Let server know page is being left so it can log out if needed, etc.
      props.socket.emit('leavePage');
      
    }

  }, [props]); // Run only one time at start

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

    if(hopo) {
      errorArray.push("You're showing up as spam for some reason - please copy your work, refresh the page, and try again. But only if you're a human.");
    }
    
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
      confirm ? updateStory() : setConfirm(true);
    }
  }

  // Update or Create Story in database 
  const updateStory = () => {
    let errorArray = [];

    if (!props.storyID) {
      //If story doesn't already exist, create new Story to be added
      console.log(story.substr(0, 15));
      console.log("isPublic");
      let newTitle = story.substr(0, 15);
      let newStory = {
        title: newTitle,
        isPublic: isPublic,
        rounds: rounds,
        complete: false,
        locked: false,
        segCount: 1,
        segments: [{
          author: writerEmail,
          content: story,
          order: 1
        }],
        authors: [writerEmail]
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
          props.socket.emit('logOut', 'success');
          sendEmails(false, resJson._id, [writerEmail], newTitle);
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
      // Create new authors array - check that current author isn't already in the array to avoid duplicates
      let newAuthors = [];
      let count = 0;
      let keys = Object.keys(storyObj.authors);
      for(let key in keys) {
        newAuthors.push(storyObj.authors[key]);
        console.log(`Author ${key}`, storyObj.authors[key]);
        if (storyObj.authors[key] === writerEmail) {
          count++;
        }
      }
      if (count ===0) {
        newAuthors.push(writerEmail);
      }

      // Build story object for updating
      let finished = ++storyObj.segCount === storyObj.rounds ? true : false; // Increment segCount and check if story is complete
      console.log("segCount", storyObj.segCount, "rounds", storyObj.rounds);
      let storyUpdate = {
        complete: finished,
        segCount: storyObj.segCount,
        segments: newSegments,
        authors: newAuthors,
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
        sendEmails(finished, resJson._id, newAuthors, storyObj.title);
        props.socket.emit('logOut', 'Successful save');
      })
      .catch(err => {
        console.log("Error updating story: ", err);
        errorArray.push(err);
        setErrors(errorArray);
      });
    }
  }

  const sendEmails = (finished, storyID, authors, storyTitle) => {
    let errorArray = [];
    // Send email to the contributer
    let toSend = {
      subject: "A link to your brilliance: " + storyTitle,
      email: writerEmail,
      finished: false,
      urlOne: window.location.origin + "/story/" + storyID,
      urlOrigin: window.location.origin,
      title: storyTitle,
      authors: authors,
    }
    fetch('/api/email', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toSend)
    }).catch(err => {
      console.log("Error sending email: ", err);
      errorArray.push(err);
      setErrors(errorArray);
    })
    // Send to list of contributors if story is complete
    if (finished) {
      // Get list of contributors
      console.log("Authors:", authors)
      // Send email to the contributer
      toSend = {
        finished: true,
        subject: "Story complete: " + storyTitle,
        title: storyTitle,
        authors: authors,
        urlOne: window.location.origin + "/story/" + storyID,
        urlOrigin: window.location.origin
      }
      console.log("Sending complete notification emails: ", toSend);
      fetch('/api/email', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toSend)
      }).catch(err => {
        console.log("Error sending email: ", err);
        errorArray.push(err);
        setErrors(errorArray);
      })
    }
    
  }

  const handleRefresh = () => {
    console.log("Handling refresh: success, loggedOut", success, loggedOut);
    window.location.reload(false);
  }
  
    return (
      <Container fluid>
        <Row>
          <Modal backdrop='static' show={loggedOut && !success && !storyObj.complete} size='lg' aria-labelledby='contained-modeal-title-vcenter' centered>
            <Modal.Header>
              <Modal.Title>You don't have access to this story at the moment</Modal.Title>
            </Modal.Header>
            { storyObj.locked
             ?<Modal.Body>
                <p>Someone else is working on it - refresh later to see when it's available.</p>
              </Modal.Body>
             :<Modal.Body>
                <p>You were idle for over 30 minutes or otherwise disconnected from the server and were logged out of this story. If you refresh the page
                you'll have access if no one else is editing.</p>
                <p>Make sure to copy what you've written first, otherwise you'll lose it!</p>
                <div>{story}</div>
              </Modal.Body>
            }
            <Modal.Footer>
              <Button onClick={() => history.goBack()}>Back</Button>
              <Button onClick={() => history.push('/')}>Home</Button>
              <Button onClick={handleRefresh}>Refresh</Button>
            </Modal.Footer>
          </Modal>
        </Row>
        <Row className='justify-content-center'>
          <Col lg={6}>
          {!first
            ? !storyObj.complete
              ?
              <>
              <h3>Previously on <em>{storyObj.title}</em>...</h3>
              {
                storyObj.segments.map((seg, i) => {
                  return <p style={{ whiteSpace: "pre-wrap"}} key={seg._id}>{seg.content}</p>
                })
              }
              
              {storyObj.rounds - storyObj.segCount === 1
                ? <h4>This is the last round, make sure to wrap things up nicely! Or don't. Whatever, it's up to you.</h4>
                :
                  <>
                  <h4>Now it's your turn to add:</h4>
                  <em>round {storyObj.segCount + 1} out of {storyObj.rounds}</em>
                  </>
              }
              </>
              : 
                <>
                <h3><em>{storyObj.title}</em></h3>
                <br/>
                {
                  storyObj.segments.map((seg, i) => {
                    return <p style={{ whiteSpace: "pre-wrap"}} key={seg._id}>{seg.content}</p>
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
                  <Form.Text className="text-muted">
                    Max characters: {charLimit} <span style={story.length < charLimit - 100 ? {color:"green"} : {color:"red"}}>Current count: {story.length}</span>
                  </Form.Text>
                  <Form.Control as="textarea" placeholder="Don't be picky, just get started..." rows="20" value={story} onChange={e => checkStory(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control required type="email" placeholder="Enter email" value={writerEmail} onChange={e => setWriterEmail(e.target.value)} />
                  <Form.Text className="text-muted">
                    There's no signup, we just need an email to send you notifications when your story is complete, and a link where you can see all the stories you have contributed to.
                  </Form.Text>
                </Form.Group>

                <label className="hopo"></label>
                <input className="hopo" tabIndex={-1} autoComplete="drtrdwsz" type="text" id="name" name="name" placeholder="Your name here" onChange={() => setHopo(true)}/>
                <label className="hopo"></label>
                <input className="hopo" tabIndex={-1} autoComplete="drtrdwsz" type="email" id="email" name="email" placeholder="Your e-mail here" onChange={() => setHopo(true)}/>

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
                        <p><a href={window.location.href+""+ (props.storyID ? "" : newStoryID)}  rel="noopener noreferrer">
                          {window.location.href+""+ (props.storyID ? "" : newStoryID)}
                          </a>
                        </p>
                        <p></p>
                        <Container>
                          <Row>
                            <Col lg={2}>
                              <a target="_blank" rel="noopener noreferrer" href={"mailto:?subject=Continue the story&body=It's not peer pressure, it's just your turn 😁 %0d%0a %0d%0a I contributed to a story on foldandpass.com. Write with me here: %0d%0a"+ window.location.href + (props.storyID ? "" : newStoryID)}>
                                <EmailIcon round={true} size={40} />
                              </a>
                            </Col>
                            <Col lg={2}>
                              <div className="fb-share-button" data-href={"https://foldandpass.com/story/" + newStoryID} data-layout="button" data-size="large">
                                <a target="_blank" rel="noopener noreferrer" href={"https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Ffoldandpass.com%2Fstory%" + newStoryID +"&amp;src=sdkpreparse"}
                                  className="fb-xfbml-parse-ignore">
                                  <FacebookIcon round={true} size={40}/>
                                </a>
                              </div>
                            </Col>
                            <Col lg={2}>
                              <TwitterShareButton url={window.location.href+""+ (props.storyID ? "" : newStoryID)}>
                                <TwitterIcon round={true} size={40}/>
                              </TwitterShareButton>
                            </Col>
                          </Row>
                        </Container>
                        <p/>
                        <p>You'll also get an email with a link to the story, and will be notified via email once more when it's complete.</p>
                        {isPublic
                          ? <p>It will now be in the public directory where anyone can find it and contibute until its finished.</p>
                          : <p>You did not select "public", so your story will not appear on the Open Stories page.</p>
                        }
                      </Alert>

                : confirm ?
                  <Alert variant="warning">
                    <h4>One more step...</h4>
                    <p>You can't edit later, so if you haven't yet give it a second read before confirming you want to publish.</p>
                    <Button variant="primary" onClick={handleSubmit}>
                      Confirm Publish
                    </Button>
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
