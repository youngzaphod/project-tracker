import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import SuccessBox from '../Components/SuccessBox';



function TestPage(props) {

    return (
      <Container fluid >
        <Row className='justify-content-center'>
            <Col lg={6}>
                <SuccessBox
                    shareURL='foldandpass.com/story/5e8ec6a7f312c700044a3b58'
                    complete={true}
                    title={"Big titles"}
                />
            </Col>
        </Row>
      </Container>
    );
}

export default TestPage;
