import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { FaCog } from 'react-icons/fa';

import '../App.css';

const charLimit = 1000;
const maxCount = 5;

function Start(props) {
  const [writerEmail, setWriterEmail] = useState('');
  const [story, setStory] = useState('');
  const [send, setSend] = useState('');
  const [nextEmail, setNextEmail] = useState('');
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [storyObj, setStoryObj] = useState({segCount: '', segments: []});

  //console.log(`storyID: ${props.storyID}`);
  console.log("What's happening here???");
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
          setStoryObj({segCount: theStory.segCount, segments: theStory.segments});
          console.log('First fetch then, resJson: ', theStory);
        })
        .catch(err => {
          let errorArray = [`Sorry, there was an issue loading the story: ${err}`];
          console.log('Issue loading story: ', err);
          setErrors(errorArray);
        }
      );
      
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
      let newStory = {
        name: story.substr(0, 15),
        public: isPublic,
        complete: false,
        nextEmail: nextEmail,
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
          console.log('First fetch then, resJson: ', resJson);
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
      storyObj.segments.push({author: writerEmail, content: story, order: storyObj.segCount});
      console.log(storyObj.segments);
      // Build story object for updating
      let finished = ++storyObj.segCount === maxCount ? true : false;
      let storyUpdate = {
        name: storyObj.name,
        complete: finished,
        nextEmail: nextEmail,
        segCount: storyObj.segCount,
        public: send === 'public' ? true : false,
        segments: storyObj.segments
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
        setSuccess(true);
      })
      .catch(err => {
        console.log("Error: ", err);
        errorArray.push(err);
        setErrors(errorArray);
      });
    }

    console.log("End of handle db write function");
  }
  
  
    return (
      <Container fluid>
        
        <Row className='justify-content-center'>
          <Col lg={6}>
          {props.storyID != null
            ?
              <>
              <h3>Previously on <em>Story Title</em>...</h3>
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
                      ? <p>It will now be in the public directory where anyone can find it and contibute until its finished.
                            You'll get an email with a link to the story, and will be notified via email once more when it's complete.</p>
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
