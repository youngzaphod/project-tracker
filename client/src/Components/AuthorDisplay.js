import React, { useState, useEffect } from 'react';

function AuthorDisplay(props) {
    
    return (
        <>
        <h4>by:</h4>
        {
            props.usernames.map(user => {
                return <p key={user.username}><a className='author' href={window.location.origin + '/author/' + user.username}>{user.username}</a></p>
            })
        }
        </>
    );

}

export default AuthorDisplay;