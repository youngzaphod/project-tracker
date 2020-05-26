import React, { useState, useEffect } from 'react';
import lorem from './dummyText.js';

const maxLength = 40;

function StoryDisplay(props) {
    const [prompt, setPrompt] = useState('');
    const [displayText, setDisplayText] = useState('');
    const [dummyText, setDummyText] = useState('');


    useEffect(() => {
        // If story is folded and incomplete, get the last few words from the previous segment to display after blurred text
        if (props.storyObj.fold && !props.storyObj.complete) {
            // Get the content from the last segment
            let text = props.storyObj.segments[props.storyObj.segCount - 1].content;

            // Set display text length to the content length if it's less than maximum
            let displayLength = text.length < maxLength ? text.length : maxLength;

            // Get last displayLength characters from the content
            setDisplayText(text.slice(-displayLength));
        }

        // Run through segments to create dummy content length
        let dum = "Caught you, cheater! You thought you were clever, but this is just dummy text! Nice try, though, would've done the same myself.";
        props.storyObj.segments.forEach(seg => {
            let sec = seg.content.split('\n');  // Split into array by newlines
            // Iterate over array adding each element to dummy text
            let j = 0;
            sec.forEach(el => {
                j++;
                dum += lorem.substr(0, el.length);
                //Only add newline if not the last section
                if (j !== sec.length) {
                    dum += '\n';
                }
            });
        });
        setDummyText(dum);


        // Set the intro and prompt based on where in the story we are
        if (!props.first) {
            if (!props.storyObj.complete) {
                if (props.storyObj.rounds - props.storyObj.segCount === 1) {
                    setPrompt(`This is the last round, make sure to wrap things up nicely! Or don't. Whatever, it's up to you.`);
                } else {
                    setPrompt(`Now it's your turn to add:`);
                }
            }
        } else {
            setPrompt(`Start a story (or a poem/play/essay - whatever you like), then send it to a friend or the world to complete it.`);
        }
    }, [props]);
    
    return (
        <>     
        {!props.first && 
            <h3 className="noPad"style={{ paddingBottom: '30px'}}>{!props.storyObj.complete ? `Previously on ` : '' }<em>{props.storyObj.title}</em></h3> }
        
        {!props.storyObj.fold || props.storyObj.complete ?
            props.storyObj.segments.map((seg, i) => {
                return <span style={{ whiteSpace: "pre-wrap"}} key={seg._id ? seg._id : '2038402138'}>
                    {seg.content}
                    </span>
            })
            : 
            <>
                <p><em>Since the original author chose to fold the paper, you can only see the last few words:</em></p>
                <span className="blurred-text" style={{ whiteSpace: "pre-wrap"}}>{dummyText}</span>
                <span style={{ whiteSpace: "pre-wrap"}}>{displayText}</span>
                { props.success &&
                    <span style={{ whiteSpace: "pre-wrap"}}>
                        {props.storyObj.segments[props.storyObj.segments.length - 1].content}
                    </span>
                }
            </>
        }
            
        { !props.success && <h5 style={{paddingTop: '30px'}}>{prompt}</h5> }
        
        {!props.first && !props.storyObj.complete && !props.success &&
            <em>round {props.storyObj.segCount + 1} out of {props.storyObj.rounds}</em> }
        </>
    );

}

export default StoryDisplay;