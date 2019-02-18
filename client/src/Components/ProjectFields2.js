import React, { Component } from 'react';
//import { FaBeer } from 'react-icons/fa';
import Milestone from './Milestone';
import Task from './Task';
import { MdAdd } from 'react-icons/md';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

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
      Order: 0,
      Tasks: [
        {
          Name: "Kick-off meeting",
          Units: 5,
          Order: 0
        },
        {
          Name: 'Project roadmap',
          Units: 4,
          Order: 1
        },
        {
          Name: 'User stories',
          Units: 10,
          Order: 2
        }
      ]
    },
    {
      Name: "Design",
      Units: 30,
      Order: 1,
      Tasks: [
        {
          Name: "Design meeting",
          Units: 5,
          Order: 0
        },
        {
          Name: 'Moodboards',
          Units: 4,
          Order: 1
        },
        {
          Name: 'Wireframes',
          Units: 10,
          Order: 2
        },
        {
          Name: 'Complete design',
          Units: 10,
          Order: 3
        }
      ]
    }
  ]
}

class ProjectFields extends Component {
  constructor(props) {
    super(props);
    let newState = project;
    newState.Milestones.forEach(ms => {
      ms.id = shortid.generate();
      ms.Tasks.forEach(task => {
        task.id = shortid.generate();
      });
    });
    newState.highlights = {};
    this.state = newState;
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
      // newState.highlights = {
      //   ['h-' + i]: true,
      //   ['h-' + (i-1).toString()]: true,
      // };
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
      // newState.highlights = {
      //   ['h-' + i]: true,
      //   ['h-' + (i+1).toString()]: true,
      // };
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
      console.log(JSON.parse(JSON.stringify(state.Milestones[i].Tasks)));
      let newState = state;
      newState.Milestones[i].Tasks[j].Order = j - 1;
      newState.Milestones[i].Tasks[j - 1].Order = j;
      newState.Milestones[i].Tasks.sort((a, b) => a.Order - b.Order);
      //Add highlights to moved tasks
      // newState.highlights = {
      //   ['h-' + i + '-' + j]: true,
      //   ['h-' + i + '-' + (j-1).toString()]: true,
      // };
      // console.log(newState.highlights);
      return newState;
    })

  }

  moveTaskDown = (i, j) => {
    if (j > this.state.Milestones[i].Tasks.length - 2) {
      return;
    }

    this.setState(state => {
      let newState = state;
      newState.Milestones[i].Tasks[j].Order = j + 1;
      newState.Milestones[i].Tasks[j + 1].Order = j;
      newState.Milestones[i].Tasks.sort((a, b) => a.Order - b.Order);
      //Add highlights to moved tasks
      // newState.highlights = {
      //   ['h-' + i + '-' + j]: true,
      //   ['h-' + i + '-' + (j+1).toString()]: true,
      // };
      // console.log(newState.highlights);
      return newState;
    });

  }

  deleteTask = (i, j) => {
    this.setState(state => {
      let newState = state;
      newState.Milestones[i].Tasks =
        newState.Milestones[i].Tasks.slice(0, j)
        .concat(newState.Milestones[i].Tasks.slice(j + 1));
      return newState;
    });
  }

  addTask = (i, j) => {
    //Create new blank task to be added at given index
    let newTask = {
      Name: '',
      Units: '',
      Order: j,
      id: shortid.generate(),
    };

    this.setState(state => {
      let newState = state;
      // bump up order for everything at add index and above
      newState.Milestones[i].Tasks.forEach((task, k) => {
        if (k >= j) {
          task.Order++;
        }
      });
      // Add new task
      newState.Milestones[i].Tasks.push(newTask);
      // Sort by order
      newState.Milestones[i].Tasks.sort((a, b) => a.Order - b.Order);
      newState.highlights = {['h-' + i + '-' + j]: true};
      return newState;
    });
  }

  addMilestone = (i) => {
    //Create new blank task to be added at given index
    let newMilestone = {
      Name: '',
      Units: '',
      Order: i,
      id: shortid.generate(),
      Tasks: [
        {
          Name: '',
          Units: '',
          Order: 0,
          id: shortid.generate(),
        }
      ]
    }
    this.setState(state => {
      let newState = state;
      // bump up order for everything at add index and above
      newState.Milestones.forEach((ms, k) => {
        if (k >= i) {
          ms.Order++;
        }
      });
      // Add new task
      newState.Milestones.push(newMilestone);
      // Sort by order
      newState.Milestones.sort((a, b) => a.Order - b.Order);
      newState.highlights = {['h-' + i]: true};
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
      newState.Milestones[i].Tasks[j].Name = text;
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
            newState.Milestones[i].Tasks = arrayMove(state.Milestones[i].Tasks, oldIndex, newIndex);
            return newState;
        });
    }

  
  render() {
    return (
      <div className='project-form'>
        <SortableList onSortEnd={this.milestoneSortEnd}>
          {[].concat(this.state.Milestones).map((ms, i) =>
              <SortableMilestone
                key={ms.id}
                hoverChange={this.hoverChange}
                name={ms.Name}
                units={ms.Units}
                visible={true}
                index={i}
                i={i}
                moveMilestoneUp={this.moveMilestoneUp}
                moveMilestoneDown={this.moveMilestoneDown}
                deleteMilestone={this.deleteMilestone}
                addMilestone={this.addMilestone}
                updateMilestoneName={this.updateMilestoneName}
                tasks={ms.Tasks}
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
        hoverOn={() => props.hoverChange('ms' + props.i, true)}
        hoverOff={() => props.hoverChange('ms' + props.i, false)}
        name={props.name}
        units={props.units}
        visible={props.visible}
        id={props.i}
        moveItemUp={() => props.moveMilestoneUp(props.i)}
        moveItemDown={() => props.moveMilestoneDown(props.i)}
        deleteItem={() => props.deleteMilestone(props.i)}
        addAbove={() => props.addMilestone(props.i)}
        onType={(text) => props.updateMilestoneName(props.i, text)}
      />
      <SortableList onSortEnd={(ind) => props.sortEndFunc(ind, props.i)}>
        {props.tasks.map((task, j) =>
          <SortableTask
            key={task.id}
            hoverOn={() => props.hoverChange('tk'+props.i+'-'+j, true)}
            hoverOff={() => props.hoverChange('tk'+props.i+'-'+j, false)}
            name={task.Name}
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
            <button className='add-task' onClick={() => this.addTask(props.i, props.tasks.length)}>
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