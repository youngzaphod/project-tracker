import React, { useState, useEffect } from 'react';

function StoryDisplay(props) {
    const [prompt, setPrompt] = useState('');

    useEffect(() => {
        if (!props.first) {
            if (!props.storyObj.complete) {
                if (props.storyObj.rounds - props.storyObj.segCount === 1) {
                    setPrompt(`This is the last round, make sure to wrap things up nicely! Or don't. Whatever, it's up to you.`);
                } else {
                    setPrompt(`Now it's your turn to add:`);
                }
            }
        } else {
            setPrompt(`Start a story, then send it to a friend or the world to complete it`);
        }
    }, [props]);
    
    return (
        <>
        {!props.first ?
            <>
            <h3>{!props.storyObj.complete ? `Previously on ` : '' }<em>{props.storyObj.title}</em></h3>
            {
            props.storyObj.segments.map((seg, i) => {
                return <p style={{ whiteSpace: "pre-wrap"}} key={seg._id}>{seg.content}</p>
            })
            }
            <h4>{prompt}</h4>
            </>
            : <h3>{prompt}</h3>
        }
        
        {!props.first && !props.storyObj.complete && <em>round {props.storyObj.segCount + 1} out of {props.storyObj.rounds}</em> }
        </>
    );

}

export default StoryDisplay;