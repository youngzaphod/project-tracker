import React, { Component } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FaArrowDown, FaArrowUp, FaTrashAlt, } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';

class Task extends Component {
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
                        Add task above
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
                placeholder='New task'
                defaultValue={this.props.name}
                onChange={this.onNameChange}
            />
            </Col>
            <Col md={2}>
            <input
                id={this.props.id}
                name='units'
                type='text'
                className='units-input'
                placeholder='Units'
                defaultValue={this.props.units}
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

export default Task;