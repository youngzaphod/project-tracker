import React, { Component } from 'react';


class Task extends Component {

    render() {
        return (
            <input
                id={this.props.id}
                name='milestone'
                type='text'
                class='task-input'
                placeholder='New task'
            />
        )
    }

}

export default Task;