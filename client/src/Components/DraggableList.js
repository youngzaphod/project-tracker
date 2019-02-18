import React, { Component } from 'react';
import Milestone from './Milestone';
import Task from './Task';
import { MdAdd } from 'react-icons/md';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
const shortid = require('shortid');


const items = {
    Milestones: [
        {
            Name: 'Item 1',
            id: shortid.generate(),
            Tasks: [
                {
                    Name: 'Item 1a',
                    id: shortid.generate(),
                },
                {
                    Name: 'Item 1b',
                    id: shortid.generate(),
                },
                {
                    Name: 'Item 1c',
                    id: shortid.generate(),
                },
            ]
        },
        {
            Name: 'Item 2',
            id: shortid.generate(),
            Tasks: [
                {
                    Name: 'Item 2a',
                    id: shortid.generate(),
                },
                {
                    Name: 'Item 2b',
                    id: shortid.generate(),
                },
                {
                    Name: 'Item 2c',
                    id: shortid.generate(),
                },
                {
                    Name: 'Item 2d',
                    id: shortid.generate(),
                },
            ]
        },
        {
            Name: 'Item 3',
            id: shortid.generate(),
            Tasks: [
                {
                    Name: 'Item 3a',
                    id: shortid.generate(),
                },
                {
                    Name: 'Item 3b',
                    id: shortid.generate(),
                },
            ]
        },
        
    ]
}

const SortableTask = SortableElement(({value}) => <li>{value}</li>);

const SortableList = SortableContainer(({children}) => {
    return <ul>{children}</ul>;
});

const SortableMilestone = SortableElement(({tasks, name, msIndex, sortEndFunc}) => {
    return (
        <li>
            {name}
            <SortableList onSortEnd={(ind) => sortEndFunc(ind, msIndex)}>
                {tasks.map((task, j) =>
                    <SortableTask key={task.id} index={j} value={task.Name} />
                )}
            </SortableList>
        </li>
    )
});

class DraggableList extends Component {
    constructor(props) {
        super(props);
        this.state = items;
        console.log(this.state);
    }

    taskSortEnd = ({oldIndex, newIndex}, i) => {
        this.setState(state => {
            let newState = state;
            newState.Milestones[i].Tasks = arrayMove(state.Milestones[i].Tasks, oldIndex, newIndex);
            return newState;
        });
    }

    milestoneSortEnd = ({oldIndex, newIndex}) => {
        this.setState(state => {
            let newState = state;
            newState.Milestones = arrayMove(state.Milestones, oldIndex, newIndex);
            return newState;
        });
    }

    render () {
        return (
            <SortableList onSortEnd={this.milestoneSortEnd}>
            {[].concat(this.state.Milestones.map((ms, i) =>
                <SortableMilestone
                    key={ms.id}
                    index={i}
                    name={ms.Name}
                    tasks={ms.Tasks}
                    sortEndFunc={this.taskSortEnd}
                    msIndex={i}
                />
            ))}
            </SortableList>
        );
    }






}

export default DraggableList;