import React, { useState, useRef } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import SocialShares from './SocialShares';

function SuccessBox(props) {
    const [btnText, setBtnText] = useState('Copy link');
    const linkRef = useRef(null);

    const copyLink = () => {
        linkRef.current.select();
        document.execCommand('copy');
        setBtnText('Copied!');
    }
    
    return (
        <>
        <textarea readOnly style={{opacity: .01, height: 0, position: 'absolute', zIndex: -1}} ref={linkRef} value={props.shareURL} />
        {props.complete ?
        <Alert variant='success'>
            <h4>You completed the story!</h4>
            <p>Don't let anybody ever tell you you can't finish anything. Now it's time to share it with the world:</p>
            <p><a style={{ paddingRight: 20 }} href={props.shareURL}  rel="noopener noreferrer">
                {props.shareURL}
                </a>
                <Button variant='secondary' onClick={copyLink} >{btnText} </Button>
            </p>
            <p>
            </p>
            <SocialShares shareURL={props.shareURL} text='Check out the story I just completed' />
            <p/>
            <p>Everyone that worked on this story will get notified via email that it's complete.</p>
            <p>If you selected 'Public', the story will be posted in our Finished stories page as well.</p>
        </Alert>
        :
        <Alert variant='success'>
            <h4>Excellent work! Now it's time to pass the torch.</h4>
            <p>Anyone with the link below can add to your story; it's up to you to send to a single friend or post on social and see who adds:</p>
            <p><a style={{ paddingRight: 20 }} href={props.shareURL}  rel="noopener noreferrer">
                {props.shareURL}
                </a>
                <Button variant='secondary' onClick={copyLink} >{btnText} </Button>
            </p>
            <p>
            </p>
            <SocialShares shareURL={props.shareURL} text='Want to write with me? ' />
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