import React, { Component } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Task from './Task';


class Milestone extends Component {

    displayOptions = () => {

    }

    render() {
        return (
            <div onmouseover={this.displayOptions}>
            <Row>
            <Col md={2}>
                
            </Col>
            <Col md={8}>
            <input
                id={this.props.id}
                name='milestone'
                type='text'
                class='milestone-input'
                placeholder='New milestone'
            />
            </Col>
            <Col md={2}>
            <input
                id={this.props.id}
                name='days'
                type='text'
                class='milestone-input'
                placeholder='Days'
                value={this.props.days}
            />
            </Col>
            </Row>
            </div>
        )
    }

}

export default Milestone;