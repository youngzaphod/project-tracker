import React, { Component } from 'react';
//import { FaBeer } from 'react-icons/fa';
import Milestone from './Milestone';
import Task from './Task';
import { MdAdd } from 'react-icons/md';
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from 'react-sortable-hoc';

const shortid = require('shortid');

const project = {
  Name: "Website Redesign",
  Start: "1/5/2019",
  End: "5/4/2019",
  Units: "Days",
  Milestones: [
    {
      Name: "Planning",
      Units: 22,
      tasks: [
        {
          Name: "Kick-off meeting",
          Units: 5,
        },
        {
          Name: 'Project roadmap',
          Units: 4,
        },
        {
          Name: 'User stories',
          Units: 10,
        }
      ]
    },
    {
      Name: "Design",
      Units: 30,
      tasks: [
        {
          Name: "Design meeting",
          Units: 5,
        },
        {
          Name: 'Moodboards',
          Units: 4,
        },
        {
          Name: 'Wireframes',
          Units: 10,
        },
        {
          Name: 'Complete design',
          Units: 10,
        }
      ]
    }
  ]
}

class ProjectFields extends Component {
  constructor(props) {
    super(props);
    console.log('ProjectFields milestones: ', this.props.milestones);
    console.log('ProjectFields id: ', this.props.projectId);

    console.log('props: ', props);

    // let newState = project;
    // newState.Milestones.forEach(ms => {
    //   ms.id = shortid.generate();
    //   ms.Tasks.forEach(task => {
    //     task.id = shortid.generate();
    //   });
    // });
    let newState = {};
    newState.Milestones = this.props.milestones;
    this.state = newState;
  }

  componentDidMount() {
    console.log('ComponentDidMount: ', this.props);
  }


  hoverChange = (index, tf) => {
    this.setState({[index]: tf})
  }

  moveMilestoneUp = (i) => {
    if (i === 0) {
      return;
    }
    console.log("Moving MS: " + JSON.parse(JSON.stringify(this.state.Milestones[i])));

    this.setState(state => {
      console.log(JSON.parse(JSON.stringify(state.Milestones)));
      let newState = state;
      newState.Milestones[i].Order = i - 1;
      newState.Milestones[i - 1].Order = i;
      newState.Milestones.sort((a, b) => a.Order - b.Order);
      return newState;
    })

  }

  moveMilestoneDown = (i) => {
    if (i > this.state.Milestones.length - 2) {
      return;
    }

    this.setState(state => {
      let newState = state;
      newState.Milestones[i].Order = i + 1;
      newState.Milestones[i + 1].Order = i;
      newState.Milestones.sort((a, b) => a.Order - b.Order);
      return newState;
    });

  }

  deleteMilestone = (i) => {
    this.setState(state => {
      let newState = state;
      newState.Milestones =
        newState.Milestones.slice(0, i).concat(newState.Milestones.slice(i+1));
      return newState;
    });
  }

    moveTaskUp = (i, j) => {
    if (j === 0) {
      return;
    }

    this.setState(state => {
      console.log(JSON.parse(JSON.stringify(state.Milestones[i].tasks)));
      let newState = state;
      newState.Milestones[i].tasks[j].Order = j - 1;
      newState.Milestones[i].tasks[j - 1].Order = j;
      newState.Milestones[i].tasks.sort((a, b) => a.Order - b.Order);
      return newState;
    })

  }

  moveTaskDown = (i, j) => {
    if (j > this.state.Milestones[i].tasks.length - 2) {
      return;
    }

    this.setState(state => {
      let newState = state;
      newState.Milestones[i].tasks[j].Order = j + 1;
      newState.Milestones[i].tasks[j + 1].Order = j;
      newState.Milestones[i].tasks.sort((a, b) => a.Order - b.Order);
      return newState;
    });

  }

  deleteTask = (i, j) => {
    this.setState(state => {
      let newState = state;
      newState.Milestones[i].tasks =
        newState.Milestones[i].tasks.slice(0, j)
        .concat(newState.Milestones[i].tasks.slice(j + 1));
      return newState;
    });
  }

  addTask = (i, j) => {
    //Create new blank task to be added at given index
    let newTask = {
      Name: '',
      Units: '',
      id: shortid.generate(),
    };

    this.setState(state => {
      let newState = state;
      // Add new task
      newState.Milestones[i].tasks = 
        state.Milestones[i].tasks.slice(0, j)
        .concat([newTask], state.Milestones[i].tasks.slice(j));

      newState.highlights = {['h-' + i + '-' + j]: true};
      return newState;
    });
  }

  addMilestone = (i) => {
    console.log("add index: ", i);
    //Create new blank task to be added at given index
    let newMilestone = {
      mstoneName: 'Added via DB',
      tasks: []
    }
    let newState = this.state;
    fetch('/api/milestones/5c73478fb7d151384c46798b', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMilestone),
      })
      .then(response => response.json())
      .then(resJson => {
        newState.Milestones.push(resJson);
        fetch(`/api/projects/${this.props.projectId}/${resJson._id}`, {
          method: 'POST',
          headers: {
            Accept: 'application/x-www-form-urlencoded',
            'Content-Type': 'x-www-form-urlencoded',
          },
        })
        .then(another => another.json())
        .then(stuff => {
          console.log('Adding mstoneId to project: ', stuff);
        })
        this.setState({ milestones: newState.Milestones });
      })
      .catch(err => {
        this.setState({
          errMessage: `Issue loading project: ${err}`,
        });
        console.log('Issue loading project: ', err);
      });


    this.setState(state => {
      let newState = state;
      // Insert new milestone at index
      newState.Milestones = state.Milestones.slice(0, i).concat([newMilestone], state.Milestones.slice(i));
      return newState;
    });
  }

  updateMilestoneName = (i, text) => {
    this.setState(state => {
      let newState = state;
      newState.Milestones[i].Name = text;
      return newState;
    })
  }

  updateTaskName = (i, j, text) => {
    this.setState(state => {
      let newState = state;
      newState.Milestones[i].tasks[j].Name = text;
      return newState;
    })
  }

    milestoneSortEnd = ({oldIndex, newIndex}) => {
        console.log(`Old: ${oldIndex} New: ${newIndex}`);
        console.log(this.state.Milestones);
        this.setState(state => {
            let newState = state;
            newState.Milestones = arrayMove(state.Milestones, oldIndex, newIndex);
            console.log(newState.Milestones);
            return newState;
        });
    }

    taskSortEnd = ({oldIndex, newIndex}, i) => {
        console.log(`Old: ${oldIndex} New: ${newIndex} MS: ${i}`);
        this.setState(state => {
            let newState = state;
            newState.Milestones[i].tasks = arrayMove(state.Milestones[i].tasks, oldIndex, newIndex);
            return newState;
        });
    }

  
  render() {
    return (
      <div className='project-form'>
        <SortableList onSortEnd={this.milestoneSortEnd} useDragHandle>
          {[].concat(this.state.Milestones).map((ms, i) =>
              <SortableMilestone
                key={ms._id}
                name={ms.mstoneName}
                units={ms.Units}
                visible={true}
                index={i}
                i={i}
                moveMilestoneUp={this.moveMilestoneUp}
                moveMilestoneDown={this.moveMilestoneDown}
                deleteMilestone={this.deleteMilestone}
                addMilestone={this.addMilestone}
                updateMilestoneName={this.updateMilestoneName}
                addTask={this.addTask}
                deleteTask={this.deleteTask}
                updateTaskName={this.updateTaskName}
                tasks={ms.tasks}
                sortEndFunc={this.taskSortEnd}
              />
          )}
          <li style={{paddingLeft: '80px', fontSize: '.5em'}}>
            <button className='add-milestone' onClick={() => this.addMilestone(this.state.Milestones.length)}>
              <MdAdd />
            </button>
          </li>
        </SortableList>
      </div>
    );
  }
}

const SortableList = SortableContainer(({children}) => {
  return <ul className='milestone-list'>{children}</ul>;
});

const SortableMilestone = SortableElement(props => {
  return (
    <li className={props.fading ? 'highlight-fade' : ''}>
      <Milestone
        name={props.name}
        units={props.units}
        id={props.i}
        moveItemUp={() => props.moveMilestoneUp(props.i)}
        moveItemDown={() => props.moveMilestoneDown(props.i)}
        deleteItem={() => props.deleteMilestone(props.i)}
        addAbove={() => props.addMilestone(props.i)}
        onType={(text) => props.updateMilestoneName(props.i, text)}
      />
      <SortableList onSortEnd={(ind) => props.sortEndFunc(ind, props.i)} useDragHandle>
        {props.tasks.map((task, j) =>
          <SortableTask
            key={task._id}
            name={task.taskName}
            units={task.Units}
            index={j}
            moveItemUp={() => props.moveTaskUp(props.i, j)}
            moveItemDown={() => props.moveTaskDown(props.i, j)}
            deleteItem={() => props.deleteTask(props.i, j)}
            addAbove={() => props.addTask(props.i, j)}
            onType={(text) => props.updateTaskName(props.i, j, text)}
          />
        )}
      </SortableList>
        <div style={{paddingLeft: '100px'}}>
            <button className='add-task' onClick={() => props.addTask(props.i, props.tasks.length)}>
                <MdAdd />
            </button>
        </div>
    </li>
  )
});

const SortableTask = SortableElement(props => 
  <li>
    <Task {...props} />
  </li>
);

export default ProjectFields;