import React, { useState, useEffect } from 'react';

const startSize = 30;

function LikeDisplay(props) {
    const [liked, setLiked] = useState(false);
    const [likeSize, setLikeSize] = useState(startSize + props.likes);

    useEffect(() => {
        // Get cookie to see if like has already come from this computer
        let decode = decodeURIComponent(document.cookie);
        if (decode.split(';').some(item => item.includes('liked=true'))) {
            console.log("Found liked=true cookie");
            setLiked(true);
        }

    }, [])


    const updateLike = () => {
        // Update size of heart
        if (liked) {
            // If it was already liked, this means it's unliked and going down in size
            setLikeSize(likeSize - 1);
            props.updateLikes(likeSize - startSize - 1);
        } else {
            setLikeSize(likeSize + 1);
            props.updateLikes(likeSize - startSize + 1);
        }
        // Toggle like based on previous setting
        let d = new Date();
        let expires = d.setTime(d.getTime() + 3650*24*60*60*1000);    // Set expiration to 10 years in the future
        document.cookie = 'liked=' + !liked + '; expires=' + expires + '; path=' + window.location.pathname;
        setLiked(!liked);
    }

    return (
        <>
        { liked ?
            <img fill='red' src={ window.location.origin + '/heart-full.svg'} width={likeSize} alt='heart full' onClick={updateLike} />
            :
            <img src={ window.location.origin + '/heart-empty.svg'} width={likeSize} alt='heart empty' onClick={updateLike} />
        }
        </>
    )
}

export default LikeDisplay;