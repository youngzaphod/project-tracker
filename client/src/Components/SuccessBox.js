import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import { TwitterShareButton, EmailIcon, FacebookIcon, FacebookShareButton, TwitterIcon } from "react-share";

function SuccessBox(props) {

    useEffect(() => {
        console.log("URL:", "http://foldandpass.com/story/" + props.storyID);
    }, [props])
    
    return (
        <>
        {props.complete ?
        <Alert variant='success'>
            <h4>You completed the story!</h4>
            <p>Don't let anybody ever tell you you can't finish anything. Now it's time to share it with the world:</p>
            <p><a href={window.location.href+""+ (props.storyID ? "" : props.newStoryID)}  rel="noopener noreferrer">
                {window.location.href+""+ (props.storyID ? "" : props.newStoryID)}
                </a>
            </p>
            <p>
            </p>
            <Container>
                <Row>
                <Col lg={2}>
                    <a target="_blank" rel="noopener noreferrer" href={"mailto:?subject=Continue the story&body=It's not peer pressure, it's just your turn 😁 %0d%0a %0d%0a I contributed to a story on foldandpass.com. Write with me here: %0d%0a"+ window.location.href + (props.storyID ? "" : props.newStoryID)}>
                    <EmailIcon round={true} size={40} />
                    </a>
                </Col>
                <Col lg={2}>
                    <FacebookShareButton url={"http://foldandpass.com/story/" + props.storyID ? props.storyID : props.newStoryID } className="share" >
                        <FacebookIcon size={40} round={true} />
                    </FacebookShareButton>
                </Col>
                <Col lg={2}>
                    <TwitterShareButton url={window.location.href+""+ (props.storyID ? "" : props.newStoryID)}>
                    <TwitterIcon round={true} size={40}/>
                    </TwitterShareButton>
                </Col>
                </Row>
            </Container>
            <p/>
            <p>Everyone that worked on this story will get notified via email that it's complete.</p>
            <p>If you selected 'Public', the story will be posted in our Finished stories page as well.</p>
        </Alert>
        :
        <Alert variant='success'>
            <h4>Excellent work! Now it's time to pass the torch.</h4>
            <p>Anyone with the link below can add to your story; it's up to you to send to a single friend or post on social and see who adds:</p>
            <p><a href={window.location.href+""+ (props.storyID ? "" : props.newStoryID)}  rel="noopener noreferrer">
                {window.location.href+""+ (props.storyID ? "" : props.newStoryID)}
                </a>
            </p>
            <p>
            </p>
            <Container>
                <Row>
                <Col lg={2}>
                    <a target="_blank" rel="noopener noreferrer" href={"mailto:?subject=Continue the story&body=It's not peer pressure, it's just your turn 😁 %0d%0a %0d%0a I contributed to a story on foldandpass.com. Write with me here: %0d%0a"+ window.location.href + (props.storyID ? "" : props.newStoryID)}>
                    <EmailIcon round={true} size={40} />
                    </a>
                </Col>
                <Col lg={2}>
                    <FacebookShareButton url={"http://foldandpass.com/story/" + props.storyID ? props.storyID : props.newStoryID } className="share" >
                        <FacebookIcon size={40} round={true} />
                    </FacebookShareButton>
                </Col>
                <Col lg={2}>
                    <TwitterShareButton url={window.location.href+""+ (props.storyID ? "" : props.newStoryID)}>
                    <TwitterIcon round={true} size={40}/>
                    </TwitterShareButton>
                </Col>
                </Row>
            </Container>
            <p/>
            <p>You'll also get an email with a link to the story, and will be notified via email once more when it's complete.</p>
            <p>If you selected 'Public', your story will be in the public directory where anyone can find it and contibute until its finished.</p>
            <p>If you did not select 'Public', your story will not appear on the Open Stories page, but you can still share via the link.</p>
        </Alert>
        }
        </>
    );

}

export default SuccessBox;




