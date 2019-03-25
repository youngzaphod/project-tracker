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

// const shortid = require('shortid');

// const project = {
//   Name: "Website Redesign",
//   Start: "1/5/2019",
//   End: "5/4/2019",
//   Units: "Days",
//   Milestones: [
//     {
//       Name: "Planning",
//       Units: 22,
//       tasks: [
//         {
//           Name: "Kick-off meeting",
//           Units: 5,
//         },
//         {
//           Name: 'Project roadmap',
//           Units: 4,
//         },
//         {
//           Name: 'User stories',
//           Units: 10,
//         }
//       ]
//     },
//     {
//       Name: "Design",
//       Units: 30,
//       tasks: [
//         {
//           Name: "Design meeting",
//           Units: 5,
//         },
//         {
//           Name: 'Moodboards',
//           Units: 4,
//         },
//         {
//           Name: 'Wireframes',
//           Units: 10,
//         },
//         {
//           Name: 'Complete design',
//           Units: 10,
//         }
//       ]
//     }
//   ]
// }

class ProjectFields extends Component {
  constructor(props) {
    super(props);
    let newState = {};
    newState.Milestones = this.props.milestones;
    this.state = newState;
  }


  hoverChange = (index, tf) => {
    this.setState({[index]: tf})
  }

  // moveMilestoneUp = (i) => {
  //   if (i === 0) {
  //     return;
  //   }
  //   console.log("Moving MS: " + JSON.parse(JSON.stringify(this.state.Milestones[i])));

  //   this.setState(state => {
  //     console.log(JSON.parse(JSON.stringify(state.Milestones)));
  //     let newState = state;
  //     newState.Milestones[i].Order = i - 1;
  //     newState.Milestones[i - 1].Order = i;
  //     newState.Milestones.sort((a, b) => a.Order - b.Order);
  //     return newState;
  //   })

  // }

  // moveMilestoneDown = (i) => {
  //   if (i > this.state.Milestones.length - 2) {
  //     return;
  //   }

  //   this.setState(state => {
  //     let newState = state;
  //     newState.Milestones[i].Order = i + 1;
  //     newState.Milestones[i + 1].Order = i;
  //     newState.Milestones.sort((a, b) => a.Order - b.Order);
  //     return newState;
  //   });

  // }

  deleteMilestone = (i, id) => {
    console.log(`id: ${id}, i: ${i}`);
    fetch(`/api/milestones/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(resJson => {
      this.setState(state => {
      let newState = state;
      newState.Milestones =
        newState.Milestones.slice(0, i).concat(newState.Milestones.slice(i+1));
      return newState;
    });
    })
    .catch(err => {
      this.setState({
        errMessage: `Issue loading project: ${err}`,
      });
      console.log('Issue loading project: ', err);
    });

    
  }

  // moveTaskUp = (i, j) => {
  //   if (j === 0) {
  //     return;
  //   }

  //   this.setState(state => {
  //     console.log(JSON.parse(JSON.stringify(state.Milestones[i].tasks)));
  //     let newState = state;
  //     newState.Milestones[i].tasks[j].Order = j - 1;
  //     newState.Milestones[i].tasks[j - 1].Order = j;
  //     newState.Milestones[i].tasks.sort((a, b) => a.Order - b.Order);
  //     return newState;
  //   })

  // }

  // moveTaskDown = (i, j) => {
  //   if (j > this.state.Milestones[i].tasks.length - 2) {
  //     return;
  //   }

  //   this.setState(state => {
  //     let newState = state;
  //     newState.Milestones[i].tasks[j].Order = j + 1;
  //     newState.Milestones[i].tasks[j + 1].Order = j;
  //     newState.Milestones[i].tasks.sort((a, b) => a.Order - b.Order);
  //     return newState;
  //   });

  // }

  deleteTask = (i, j) => {

    fetch(`/api/milestones/tasks/${this.state.Milestones[i]._id}/${this.state.Milestones[i].tasks[j]._id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(resJson => {
      this.setState(state => {
        let newState = state;
        newState.Milestones[i].tasks =
          newState.Milestones[i].tasks.slice(0, j)
          .concat(newState.Milestones[i].tasks.slice(j + 1));
        return newState;
      });
    })
    .catch(err => {
        this.setState({
          errMessage: `Error deleting task: ${err}`,
        });
        console.log('Error deleting task: ', err);
    });
    
  }

  addTask = (i, j) => {
    //Create new blank task to be added at given index
    let newTask = {
      taskName: '',
      order: j
    };
    console.log("i: ", i, "j: ", j);
    fetch(`/api/milestones/task/${this.state.Milestones[i]._id}`, {
      method: 'POST',
      headers: {
          Accept: 'application/json',
            'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTask)
    })
    .then(response => response.json())
    .then(resJson => {
      console.log(resJson);
      newTask._id = resJson._id;
      this.setState(state => {
        let newState = state;
        // Add new task
        newState.Milestones[i].tasks = 
          state.Milestones[i].tasks.slice(0, j)
          .concat([newTask], state.Milestones[i].tasks.slice(j));
        return newState;
      });
    })
    .catch(err => {
        this.setState({
          errMessage: `Error adding task: ${err}`,
        });
        console.log('Error adding task: ', err);
    });
    
  }

  addMilestone = (i) => {
    console.log("add index: ", i);
    //Create new blank task to be added at given index
    let newMilestone = {mstoneName: `New Milestone ${i}`};
    let newState = this.state;
    fetch('/api/milestones/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMilestone)
      })
      .then(response => response.json())
      .then(resJson => {
        console.log('First fetch then; ', resJson);
        newMilestone = {
          _id: resJson._id,
          mstoneName: resJson.mstoneName,
          tasks: resJson.tasks,
        }

        fetch(`/api/projects/${this.props.projectId}/${resJson._id}`, {
          method: 'POST',
          headers: {
            Accept: 'application/x-www-form-urlencoded',
            'Content-Type': 'x-www-form-urlencoded'
          },
        })
        .then(another => another.json())
        .then(stuff => {
          console.log('Adding mstoneId to project: ', stuff);
          this.setState(state => {
            let newState = state;
            // Insert new milestone at index
            newState.Milestones = state.Milestones.slice(0, i).concat([newMilestone], state.Milestones.slice(i));
            return newState;
          });
        })
        this.setState({ milestones: newState.Milestones });
      })
      .catch(err => {
        this.setState({
          errMessage: `Issue loading project: ${err}`,
        });
        console.log('Issue loading project: ', err);
      });

  }

  updateMilestoneName = (i, text) => {
    console.log(`Updating Milestone: id = ${this.state.Milestones[i]._id}`);
    let bodyUpdate = {
      mstoneName: text
    };
    fetch(`/api/milestones/${this.state.Milestones[i]._id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyUpdate)
    })
    .then(response => response.json())
    .then(resJson => {
      this.setState(state => {
        let newState = state;
        newState.Milestones[i].Name = text;
        return newState;
      });
    })
    .catch(err => {
      console.log("Error: ", err);
    });

  }

  updateMilestoneUnits = (i, text) => {
    console.log(`Updating Milestone: id = ${this.state.Milestones[i]._id}`);
    let bodyUpdate = {
      length: text
    };
    fetch(`/api/milestones/${this.state.Milestones[i]._id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyUpdate)
    })
    .then(response => response.json())
    .then(resJson => {
      this.setState(state => {
        let newState = state;
        newState.Milestones[i].length = text;
        return newState;
      });
    })
    .catch(err => {
      console.log("Error: ", err);
    });

  }

  updateMilestoneStart = (i, text) => {
    console.log(`Updating Milestone: id = ${this.state.Milestones[i]._id}`);
    let bodyUpdate = {
      startDate: text
    };
    fetch(`/api/milestones/${this.state.Milestones[i]._id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyUpdate)
    })
    .then(response => response.json())
    .then(resJson => {
      this.setState(state => {
        let newState = state;
        newState.Milestones[i].startDate = text;
        return newState;
      });
    })
    .catch(err => {
      console.log("Error: ", err);
    });

  }

  updateTaskName = (i, j, text) => {
    let newTask = {
      taskName: text
    };

    fetch(`/api/milestones/tasks/${this.state.Milestones[i]._id}/${this.state.Milestones[i].tasks[j]._id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTask)
    })
    .then(response => response.json())
    .then(resJson => {
      this.setState(state => {
        let newState = state;
        newState.Milestones[i].tasks[j].Name = text;
        return newState;
      });
    })
    .catch(err => {
      console.log("Error: ", err);
    });

    
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
    let updateBody = {};
    if (oldIndex === newIndex) {
      return;
    }
    if (oldIndex > newIndex) {
      updateBody = {
        lowIndex: newIndex,
        highIndex: oldIndex,
        inc: 1
      }
    } else if (oldIndex < newIndex) {
      updateBody = {
        lowIndex: oldIndex,
        highIndex: newIndex,
        inc: -1
      }
    }
    console.log(`Old: ${oldIndex} New: ${newIndex} MS: ${i}`);
    // Need to include all fields or else they'll get blanked out on update
    let udpatedTask = {
      taskName: this.state.Milestones[i].tasks[oldIndex].taskName,
      taskLength: this.state.Milestones[i].tasks[oldIndex].taskLength,
      startDate: this.state.Milestones[i].tasks[oldIndex].startDate,
      order: newIndex
    }
    // First update the task that was moved, then update the order of the rest
    fetch(`/api/milestones/tasks/${this.state.Milestones[i]._id}/${this.state.Milestones[i].tasks[oldIndex]._id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(udpatedTask)
    })
    .then(response => {
      console.log(response);
      return response.json();
    })
    .then(resJson => {
      fetch(`/api/milestones/tasks/${this.state.Milestones[i]._id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateBody)
      })
      .then(response2 => response2.json())
      .then(resJson2 => {
        this.setState(state => {
          let newState = this.state;
          newState.Milestones[i].tasks = arrayMove(this.state.Milestones[i].tasks, oldIndex, newIndex);
          return newState;
        });
      })
    })
    .catch(err => {
      console.log("Error: ", err);
    });

    
  }

  
  render() {
    return (
      <div className='project-form'>
        <SortableList onSortEnd={this.milestoneSortEnd} useDragHandle>
          {[].concat(this.state.Milestones).map((ms, i) => {
            //console.log('index: ', i);
            return (
              <SortableMilestone
                key={ms._id}
                name={ms.mstoneName}
                units={ms.Units}
                visible={true}
                i={i}
                _id={ms._id}
                index={i}
                moveMilestoneUp={this.moveMilestoneUp}
                moveMilestoneDown={this.moveMilestoneDown}
                deleteMilestone={this.deleteMilestone}
                addMilestone={this.addMilestone}
                updateMilestoneName={this.updateMilestoneName}
                updateMilestoneUnits={this.updateMilestoneUnits}
                updateMilestoneStart={this.updateMilestoneStart}
                addTask={this.addTask}
                deleteTask={this.deleteTask}
                updateTaskName={this.updateTaskName}
                tasks={ms.tasks}
                sortEndFunc={this.taskSortEnd}
              />
            );
          })}
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
  //console.log('inside milestone index: ', props.i);
  return (
    <li>
      <Milestone
        name={props.name}
        units={props.units}
        id={props._id}
        moveItemUp={() => props.moveMilestoneUp(props.i)}
        moveItemDown={() => props.moveMilestoneDown(props.i)}
        deleteItem={() => props.deleteMilestone(props.i, props._id)}
        addAbove={() => props.addMilestone(props.i)}
        onType={(text) => props.updateMilestoneName(props.i, text)}
        onUnitsType={(text) => props.updateMilestoneUnits(props.i, text)}
        onStartType={(text) => props.updateMilestoneStart(props.i, text)}
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