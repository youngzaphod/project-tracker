import React, { Component } from 'react';
//import { FaBeer } from 'react-icons/fa';
import Milestone from './Milestone';
import Task from './Task';

const project = {
  Name: "Website Redesign",
  Start: "1/5/2019",
  End: "5/4/2019",
  Milestones: [
    {
      Name: "Planning",
      Days: 22,
      Order: 0,
      Tasks: [
        {
          Name: "Kick-off meeting",
          Days: 5,
          Order: 0
        },
        {
          Name: 'Project roadmap',
          Days: 4,
          Order: 1
        },
        {
          Name: 'User stories',
          Days: 10,
          Order: 2
        }
      ]
    },
    {
      Name: "Design",
      Days: 30,
      Order: 1,
      Tasks: [
        {
          Name: "Design meeting",
          Days: 5,
          Order: 0
        },
        {
          Name: 'Moodboards',
          Days: 4,
          Order: 1
        },
        {
          Name: 'Wireframes',
          Days: 10,
          Order: 2
        },
        {
          Name: 'Complete design',
          Days: 10,
          Order: 3
        }
      ]
    }
  ]
}

class ProjectFields extends Component {
  state = project;

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
      console.log(JSON.parse(JSON.stringify(newState.Milestones)));
      return newState;
    })

  }

  moveMilestoneDown = (i) => {
    if (i > this.state.Milestones.length - 2) {
      return;
    }
    console.log("Moving MS: " + JSON.parse(JSON.stringify(this.state.Milestones[i])));

    this.setState(state => {
      console.log(JSON.parse(JSON.stringify(state.Milestones)));
      let newState = state;
      newState.Milestones[i].Order = i + 1;
      newState.Milestones[i + 1].Order = i;
      newState.Milestones.sort((a, b) => a.Order - b.Order);
      console.log(JSON.parse(JSON.stringify(newState.Milestones)));
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
  
  render() {
    return (
      <div className='project-form'>
        <ul className='milestone-list'>
          {[].concat(this.state.Milestones).sort((a, b) => a.Order - b.Order)
          .map((ms, i) =>
              <li key={ms.Name + i}>
                <Milestone
                  hoverOn={() => this.hoverChange('ms' + i, true)}
                  hoverOff={() => this.hoverChange('ms' + i, false)}
                  name={ms.Name}
                  visible={this.state['ms' + i] ? 'visible' : 'hidden'}
                  id={i}
                  moveItemUp={() => this.moveMilestoneUp(i)}
                  moveItemDown={() => this.moveMilestoneDown(i)}
                  deleteItem={() => this.deleteMilestone(i)}
                />
              
                <ul className='task-list'>
                {ms.Tasks.sort((a, b) => a.Order - b.Order)
                .map((task, j) =>
                    <li key={task.Name + j}
                      onMouseEnter={() => this.hoverChange('tk'+i+'-'+j, true)}
                      onMouseLeave={() => this.hoverChange('tk'+i+'-'+j, false)}
                    >
                      <Task
                        name={`${ms.Name}, ${task.Name}: ${i}, ${j}`}
                        id={j}
                        visible={this.state['tk'+i+'-'+j] ? 'visible' : 'hidden'}
                      />
                    </li>
                )}
                </ul>
              </li>
          )}
        </ul>

      </div>
    );
  }
}

export default ProjectFields;