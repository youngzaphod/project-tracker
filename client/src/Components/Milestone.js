import React, { Component } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
//import Button from 'react-bootstrap/Button';
import { FaArrowDown, FaArrowUp, FaTrashAlt } from 'react-icons/fa';

class Milestone extends Component {

    moveUp = () => {
        console.log("Arrow clicked");
    }

    render() {
        return (
            <div className='milestone'
            onMouseEnter={this.props.hoverOn}
            onMouseLeave={this.props.hoverOff}
            
            >
            <Row>
            <Col md={8}>
            <button style={{visibility: this.props.visible}} onClick={this.props.moveItemDown}><FaArrowDown /></button>
            <button style={{visibility: this.props.visible}} onClick={this.props.moveItemUp}><FaArrowUp /></button>
            <input
                id={this.props.id}
                name='milestone'
                type='text'
                className='milestone-input'
                placeholder='New milestone'
                defaultValue={this.props.name}
            />
            </Col>
            <Col md={2}>
            <input
                id={this.props.id}
                name='days'
                type='text'
                className='days-input'
                placeholder='Days'
                defaultValue={this.props.days}
            />
            
            </Col>
            <Col md={1}>
                <button style={{visibility: this.props.visible}} onClick={this.props.deleteItem}><FaTrashAlt /></button>
            </Col>
            </Row>
            </div>
        )
    }

}

export default Milestone;