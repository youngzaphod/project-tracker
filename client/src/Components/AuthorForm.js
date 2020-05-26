import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import DisplayErrors from './DisplayErrors';

function AuthorForm(props) {
    const [errors, setErrors] = useState([]);
    const [cont, setCont] = useState(false);
    const [comp, setComp] = useState(false);
    const [username, setUsername] = useState("");

    useEffect(() => {
      setCont(props.cont);
      setComp(props.comp);
      setUsername(props.username);
    }, [props.cont, props.comp, props.username]);

    //Check for errors on each field and add to error array
    const handleSubmit = () => {
      
      var errorArray = [];
      
      if (username !== username.replace(/\W/g, '')) {
        errorArray.push("Username must contain only letters and numbers");
      }
      if ((username.length > 15 || username.length < 5) && username.length !== 0) {
        errorArray.push("Username must be between 5 and 15 characters, or blank to display as 'Anonymous'");
      }
      if (username.toLowerCase() === 'anonymous') {
        errorArray.push("You can't name yourself anonymous. If you want to show as anonymous, delete your username and save.");
      }

      if (errorArray.length === 0) {
        props.updateAuthor(cont, comp, username);
      }
      setErrors(errorArray);
    }
    
    return (
      <Form>
        <h5>Username: {props.username}</h5>
        <Form.Group controlId="username">
          <Form.Label>New Username:</Form.Label>
          <Form.Control required placeholder="Username" value={username ? username : ''} onChange={e => setUsername(e.target.value.replace(/\W/g, ''))} />
          <Form.Text className="text-muted">
            Must be at least 5 characters, using only letters and numbers. Leave blank to display as 'Anonymous'.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId='contribution'>
          <Form.Check
            name='contribution'
            type='checkbox'
            label='Email me when someone adds to a story I worked on'
            id='contribution'
            checked={cont}
            onChange = {(e) => setCont(e.target.checked)}
          />
        </Form.Group>
        <Form.Group controlId='completion'>
          <Form.Check
            name='completion'
            type='checkbox'
            label='Email me when a story I worked on is completed'
            id='completion'
            checked = {comp}
            onChange = {(e) => setComp(e.target.checked)}
          />
        </Form.Group>
        
        <DisplayErrors errors={errors} />
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>


      </Form>
    );

}

export default AuthorForm;