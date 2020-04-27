import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';


function DisplayErrors(props) {
    return (
        <>
        {props.errors.length !== 0 &&
            <Row>
                <Col lg={true}>
                {
                props.errors.map((msg, i) => (
                    <Alert key={i} variant='danger'>
                    {msg}
                    </Alert>
                ))}
                </Col>
            </Row>
        }
        </>
    )
}

export default DisplayErrors;