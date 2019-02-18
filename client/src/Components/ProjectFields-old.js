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


  
  render() {
    return (
      <div className='project-form'>
        <ul className='milestone-list'>
          {[].concat(this.state.Milestones).sort((a, b) => a.Order - b.Order)
          .map((ms, i) =>
            <React.Fragment key={ms.id}>
              <li draggable={true}
                className={this.state.highlights['h-'+i] ? 'highlight-fade' : ''}
              >
                <Milestone
                  hoverOn={() => this.hoverChange('ms' + i, true)}
                  hoverOff={() => this.hoverChange('ms' + i, false)}
                  name={ms.Name}
                  units={ms.Units}
                  visible={this.state['ms' + i] ? 'visible' : 'hidden'}
                  id={i}
                  moveItemUp={() => this.moveMilestoneUp(i)}
                  moveItemDown={() => this.moveMilestoneDown(i)}
                  deleteItem={() => this.deleteMilestone(i)}
                  addAbove={() => this.addMilestone(i)}
                  onType={(text) => this.updateMilestoneName(i, text)}
                />
              
                <ul className='task-list'>
                {ms.Tasks.sort((a, b) => a.Order - b.Order)
                .map((task, j) =>
                    <li key={task.id} draggable={true}
                      className={this.state.highlights['h-'+i+'-'+j] ? 'highlight-fade' : ''}
                    >
                      <Task
                        hoverOn={() => this.hoverChange('tk'+i+'-'+j, true)}
                        hoverOff={() => this.hoverChange('tk'+i+'-'+j, false)}
                        name={task.Name}
                        units={task.Units}
                        id={j}
                        visible={this.state['tk'+i+'-'+j] ? 'visible' : 'hidden'}
                        moveItemUp={() => this.moveTaskUp(i, j)}
                        moveItemDown={() => this.moveTaskDown(i, j)}
                        deleteItem={() => this.deleteTask(i, j)}
                        addAbove={() => this.addTask(i, j)}
                        onType={(text) => this.updateTaskName(i, j, text)}
                      />
                    </li>
                )}
                <li style={{paddingLeft: '100px'}}>
                  <button className='add-task' onClick={() => this.addTask(i, ms.Tasks.length)}>
                    <MdAdd />
                  </button>
                </li>
                </ul>
              </li>
            </React.Fragment>
          )}
          <li style={{paddingLeft: '80px', fontSize: '.5em'}}>
            <button className='add-milestone' onClick={() => this.addMilestone(this.state.Milestones.length)}>
              <MdAdd />
            </button>
          </li>
        </ul>

      </div>
    );
  }
}

const SortableList = SortableContainer(({children}) => {
  return <ul>{children}</ul>;
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
            hoverOn={() => props.hoverChange('tk'+props.i+'-'+j, true)}
            hoverOff={() => props.hoverChange('tk'+props.i+'-'+j, false)}
            name={task.Name}
            units={task.Units}
            id={j}
            moveItemUp={() => props.moveTaskUp(props.i, j)}
            moveItemDown={() => props.moveTaskDown(props.i, j)}
            deleteItem={() => props.deleteTask(props.i, j)}
            addAbove={() => props.addTask(props.i, j)}
            onType={(text) => props.updateTaskName(props.i, j, text)}
          />
        )}
      </SortableList>

    </li>
  )
});

const SortableTask = SortableElement(props => 
  <li>
    <Task {...props} />
  </li>
);

export default ProjectFields;