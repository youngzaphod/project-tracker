import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import DisplayErrors from './DisplayErrors';

const charLimit = 1000;
const maxLength = 40;

function StoryForm(props) {
    const [story, setStory] = useState('');
    const [beginning, setBeginning] = useState('');
    const [errors, setErrors] = useState([]);
    const [writerEmail, setWriterEmail] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [fold, setFold] = useState(false);
    const [rounds, setRounds] = useState(5);
    const [confirm, setConfirm] = useState(false);
    const [hopo, setHopo] = useState(false); // Tracking if honeypots are filled in

    useEffect(() => {
        if (props.lastText !== '') {
            // Set beginning length to the content length if it's less than maximum
            let displayLength = props.lastText.length < maxLength ? props.lastText.length : maxLength;

            // Get last displayLength characters from the content
            setBeginning('. . .' + props.lastText.slice(-displayLength));
            // Set story to the same so they start by matching
            setStory('. . .' + props.lastText.slice(-displayLength));
            console.log("Running useEffect. Setting story and beginning to:", '...' + props.lastText.slice(-displayLength));
        }
    }, [props.lastText]);

    const checkStory = (newValue) => {
        // If user attempts to change previous text, don't update and show alert
        if (newValue.substr(0, beginning.length) === beginning) {
            if (newValue.length > charLimit) {
                newValue = newValue.substr(0, charLimit);
                setErrors(errors);
            }
            setStory(newValue);
            // Bubble up new part of story, taking out the prompt, and then remove trailing whitespace
            props.updateStoryText(newValue.substr(beginning.length).replace(/\s+$/, ''));
            console.log("Substring, new writing:", newValue.substr(beginning.length));
            //props.updateStoryText(newValue.substr(beginning.length));
        }
        
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
            let newText = story.substr(beginning.length);
            confirm ? props.updateStory({ newText, writerEmail, rounds, isPublic, fold }) : setConfirm(true);
        }
    }
    
    return (
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

                {props.first &&
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
                      label='Public: Post story on the Open stories page for others to find and contribute'
                      id='public'
                      defaultChecked = {true}
                      onClick = {(e) => setIsPublic(e.target.checked)}
                    />
                  </Form.Group>
                  <Form.Group controlId='makePublic'>
                    <Form.Check
                      name='fold'
                      type='checkbox'
                      label='Fold before passing? Checking this will let the next person see only the last few words of what you wrote.'
                      id='fold'
                      defaultChecked = {false}
                      onClick = {(e) => setFold(e.target.checked)}
                    />
                  </Form.Group>
                  </>
                }
                <DisplayErrors errors={errors} />

                {confirm ?
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
    );

}

export default StoryForm;