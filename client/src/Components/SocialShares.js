import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {
    TwitterShareButton,
    TwitterIcon,
    EmailIcon,
    FacebookIcon,
    FacebookShareButton,
    RedditIcon,
    RedditShareButton
} from "react-share";

function SocialShares(props) {
    
    return (
        <Container>
            <Row>
            <Col xs="auto">
                <a target="_blank" rel="noopener noreferrer" href={"mailto:?subject=Continue the story&body=It's not peer pressure, it's just your turn 😁 %0d%0a %0d%0a I contributed to a story on foldandpass.com. Write with me here: %0d%0a"+ props.shareURL}>
                <EmailIcon round={true} size={40} />
                </a>
            </Col>
            <Col xs="auto">
                <FacebookShareButton url={props.shareURL} className="share" quote={props.text} hashtag='#collaborate'>
                    <FacebookIcon size={40} round={true} />
                </FacebookShareButton>
            </Col>
            <Col xs="auto">
                <TwitterShareButton url={props.shareURL} title={`${props.text} ${props.shareURL}`} via='foldandpass' hashtags={['create', 'collaborate']}>
                <TwitterIcon round={true} size={40}/>
                </TwitterShareButton>
            </Col>
            <Col xs="auto">
                <RedditShareButton url={props.shareURL} title={`${props.text}`} >
                <RedditIcon round={true} size={40}/>
                </RedditShareButton>
            </Col>
            </Row>
        </Container>
    );

}

export default SocialShares;




