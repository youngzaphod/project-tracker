import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Redirect } from 'react-router-dom';
import LoggedOutMessage from '../Components/LoggedOutMessage';
import StoryDisplay from '../Components/StoryDisplay';
import StoryForm from '../Components/StoryForm';
import SuccessBox from '../Components/SuccessBox';
import DisplayErrors from '../Components/DisplayErrors';
import SocialShares from '../Components/SocialShares';
//import { FaCog } from 'react-icons/fa';
//import { TwitterShareButton, EmailIcon, FacebookIcon, TwitterIcon } from "react-share";

import ifvisible from 'ifvisible.js';
import '../App.css';

const timeOut =  3;


ifvisible.setIdleDuration(timeOut); // Set how long it takes to give logout warning in seconds


function Start(props) {
  const [loaded, setLoaded] = useState(false);
  const [story, setStory] = useState('');
  const [loggedOut, setLoggedOut] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [storyObj, setStoryObj] = useState({segCount: 0, segments: []});
  const [newStoryID, setNewStoryID] = useState('');
  const [first, setFirst] = useState(true);
  const [connected, setConnected] = useState(true);

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

    props.socket.on("connect", () => {
      console.log("Connected");
        setConnected(true);
        // If story was unlocked on earlier connection, see if it's still available
        props.socket.emit("checkout", props.storyID, (data) => {
          if (data === 'available') {
            setLoggedOut(false);
          } else {
            setLoggedOut(true);
          }
        });
    });

    props.socket.on("disconnect", () => {
      console.log("Disconnected, so logged out of story");
      setConnected(false); 
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
            fold: theStory.fold,
            authors: theStory.authors
          });

          /*

          if (theStory.locked && !theStory.complete) {
            console.log("Setting loggedout on entry");
            setLoggedOut(true);
          }

          // Send info to server for tracking loggedOut state and ID for backend logout
          if (!theStory.locked && !theStory.complete) {
            props.socket.emit('setup', { storyID: props.storyID, loggedOut: false });
          }
          */

          props.socket.emit('setup', { storyID: props.storyID, loggedOut: false }, data => {
            if (data === 'unavailable') {
              setLoggedOut(true);
            }
            setLoaded(true);
          });
        })
        .catch(err => {
          let errorArray = [`Sorry, there was an issue loading the story: ${err}`];
          console.log('Issue loading story: ', err);
          setErrors(errorArray);
        }
      );
      
    } else {
      setLoaded(true);
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

  // Update or Create Story in database 
  const updateStory = (data) => {
    let errorArray = [];

    if (!props.storyID) {
      //If story doesn't already exist, create new Story to be added
      console.log(data.newText.substr(0, 15));
      console.log("isPublic");
      let newTitle = data.newText.substr(0, 15);
      let segments = [{
          author: data.writerEmail,
          content: data.newText,
          order: 1
      }];
      let newStory = {
        title: newTitle,
        isPublic: data.isPublic,
        fold: data.fold,
        rounds: data.rounds,
        complete: false,
        locked: false,
        segCount: 1,
        segments: segments,
        authors: [data.writerEmail]
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
          setStoryObj({ segments: segments, segCount: 1, rounds: data.rounds, complete: false, title: newTitle });
          props.socket.emit('logOut', 'success');
          sendEmails(false, resJson._id, [data.writerEmail], newTitle, data.writerEmail);
        })
        .catch(err => {
          errorArray.push(`Issue adding story: ${err}`);
          console.log('Issue adding story: ', err);
          setErrors(errorArray);
        }
      );
    } else {
      // Add segment to existing story
      let newSegments = [...storyObj.segments];
      newSegments.push({author: data.writerEmail, content: data.newText, order: storyObj.segCount});

      // Create new authors array - check that current author isn't already in the array to avoid duplicates
      let newAuthors = [];
      let count = 0;
      let keys = Object.keys(storyObj.authors);
      for(let key in keys) {
        newAuthors.push(storyObj.authors[key]);
        if (storyObj.authors[key] === data.writerEmail) {
          count++;
        }
      }
      if (count ===0) {
        newAuthors.push(data.writerEmail);
      }

      // Build story object for updating
      let finished = storyObj.segCount + 1 === storyObj.rounds ? true : false; // Increment segCount and check if story is complete
      let storyUpdate = {
        complete: finished,
        segCount: storyObj.segCount + 1,
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
        setSuccess(true);
        setNewStoryID(resJson._id);
        let newStoryObj = {...storyObj};
        newStoryObj.segments = newSegments;
        setStoryObj(newStoryObj);
        sendEmails(finished, resJson._id, newAuthors, storyObj.title, data.writerEmail);
        props.socket.emit('logOut', 'Successful save');
      })
      .catch(err => {
        console.log("Error updating story: ", err);
        errorArray.push(err);
        setErrors(errorArray);
      });
    }
  }

  const sendEmails = (finished, storyID, authors, storyTitle, writerEmail) => {
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
  
    return (
      <>
      {loaded &&
      <Container fluid>
        <DisplayErrors errors={errors} />
        <Row className='justify-content-center'>
          <Col lg={6}>
            <Row className='justify-content-end'>
              <Col xs={12} sm="auto" >
                <SocialShares
                  shareURL={window.location.href}
                  text={ first ? "Start a story, let your friends finish it" : "Add to my story!" }
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className='justify-content-center'>
          <Col lg={6}>
            <StoryDisplay storyObj={storyObj} first={first} success={success} />
          </Col>
        </Row>
        {!storyObj.complete && 
          <Row className='justify-content-center'>
            <Col lg={6}>
              <br/>
              {success
                ? 
                  <>
                  <SuccessBox
                    shareURL={window.location.href+""+ (props.storyID ? "" : newStoryID)}
                    // shareURL='foldandpass.com/story/5e8ec6a7f312c700044a3b58'
                    complete={storyObj.segCount + 1 === storyObj.rounds}
                    title={storyObj.title}
                  />
                  </>
                : loggedOut
                  ? <LoggedOutMessage locked={storyObj.locked} story={story} />
                  : <StoryForm
                      first={first}
                      updateStory={updateStory}
                      updateStoryText={setStory}
                      connected={connected}
                      lastText={storyObj.segCount === 0 ? '' : storyObj.segments[storyObj.segments.length - 1].content}
                    />
              }
            </Col>
          </Row>
        }
      </Container>
      }
      </>
    );
}

export default Start;
