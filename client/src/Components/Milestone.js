import React, { Component } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { MdAdd } from 'react-icons/md';
import { SortableHandle } from 'react-sortable-hoc';
import { FaArrowDown, FaArrowUp, FaTrashAlt, FaArrowsAltV } from 'react-icons/fa';


const DragHandle = SortableHandle(() => <span> <FaArrowsAltV /></span>);


class Milestone extends Component {
    state = {
        name: this.props.name,
        hover: 'hidden',
    };



    onNameChange = (e) => {
        this.props.onType(e.target.value);
    }

    render() {
        return (
            <div className='milestone highlight-fade'
            onMouseEnter={() => this.setState({hover: 'visible'})}
            onMouseLeave={() => this.setState({hover: 'hidden'})}
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
                    style={{visibility: this.state.hover}}
                    onClick={this.props.addAbove}
                >
                    <MdAdd />
                </button>
            </OverlayTrigger>
            <span style={{visibility: this.state.hover}}><DragHandle /></span>
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
                name='units'
                type='text'
                className='units-input'
                placeholder='Units'
                defaultValue={this.props.units}
            />
            
            </Col>
            <Col md={1}>
                <button style={{visibility: this.state.hover}} onClick={this.props.deleteItem}><FaTrashAlt /></button>
            </Col>
            </Row>
            </div>
        )
    }

}

export default Milestone;