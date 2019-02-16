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

  moveItemUp = (i) => {
    if (i === 0) {
      return;
    }

    // this.setState({
    //   state.Milestones[i].Order: [i - 1],
    //   state.Milestones[i - 1].Order: [i]
    // })
  }
  
  render() {
    return (
      <div className='project-form'>
        <ul className='milestone-list'>
          {this.state.Milestones.sort((a, b) => a.Order - b.Order)
          .map((ms, i) =>
            <>
              <li key={'ms' + i}
                onMouseEnter={() => this.hoverChange('ms' + i, true)}
                onMouseLeave={() => this.hoverChange('ms' + i, false)}
              >
                <Milestone
                  name={ms.Name}
                  visible={this.state['ms' + i] ? 'visible' : 'hidden'}
                  id={i}
                  moveItem={(i) => this.moveItemUp(i)}
                />
              </li>
              <li key={'tasks' + i}>
                <ul className='task-list'>
                {ms.Tasks.sort((a, b) => a.Order - b.Order)
                .map((task, j) =>
                    <li key={i + '-' + j}
                      onMouseEnter={() => this.hoverChange('tk'+i+'-'+j, true)}
                      onMouseLeave={() => this.hoverChange('tk'+i+'-'+j, false)}
                    >
                      <Task
                        name={task.Name}
                        id={j}
                        visible={this.state['tk'+i+'-'+j] ? 'visible' : 'hidden'}
                      />
                    </li>
                )}
                </ul>
              </li>
            </>
          )}
        </ul>

      </div>
    );
  }
}

export default ProjectFields;