import React from 'react';
import { useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

function LoggedOutMessage(props) {
    const history = useHistory();
    return (
        <Alert key='loggedOut' variant='secondary'>
            <h2>You don't have access to this story at the moment</h2>
            { props.locked
                ? <p>Someone else is working on it - refresh later to see when it's available.</p>
                : <>
                <p>You were idle for over 30 minutes or otherwise disconnected from the server and were logged out of this story. If you refresh the page
                you'll have access if no one else is editing.</p>
                <p>Make sure to copy what you've written first, otherwise you'll lose it!</p>
                <div>{props.story}</div>
                </>
            }
            <Container>
                <Row>
                <Col lg={3}>
                    <Button onClick={() => history.push('/open')}>Other stories</Button>
                </Col>
                <Col lg={2}>
                    <Button onClick={() => window.location.reload(false)}>Refresh</Button>
                </Col>
                </Row>
            </Container>
        </Alert>
    );

}

export default LoggedOutMessage;