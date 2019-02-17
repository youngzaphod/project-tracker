import React, { Component } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { MdAdd } from 'react-icons/md';
import { FaArrowDown, FaArrowUp, FaTrashAlt } from 'react-icons/fa';

class Milestone extends Component {
    state = {
        name: this.props.name
    };



    onNameChange = (e) => {
        this.props.onType(e.target.value);
    }

    render() {
        return (
            <div className='milestone'
            onMouseEnter={this.props.hoverOn}
            onMouseLeave={this.props.hoverOff}
            >
            <Row>
            <Col md={8}>
            <OverlayTrigger
                placement='top'
                overlay={
                    <Tooltip id='tooltip-top'>
                        Add milestone above
                    </Tooltip>
                }
            >
                <button
                    style={{visibility: this.props.visible}}
                    onClick={this.props.addAbove}
                >
                    <MdAdd />
                </button>
            </OverlayTrigger>
            <button style={{visibility: this.props.visible}} onClick={this.props.moveItemDown}><FaArrowDown /></button>
            <button style={{visibility: this.props.visible}} onClick={this.props.moveItemUp}><FaArrowUp /></button>
            <input
                id={this.props.id}
                name='milestone'
                type='text'
                className='milestone-input'
                placeholder='New milestone'
                defaultValue={this.props.name}
                onChange={this.onNameChange}
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