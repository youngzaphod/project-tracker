import React, { Component } from "react";
//import { FaBeer } from 'react-icons/fa';
import Milestone from "./Milestone";
import Task from "./Task";
import { MdAdd } from "react-icons/md";
import {
  SortableContainer,
  SortableElement,
  arrayMove,
  SortableHandle
} from "react-sortable-hoc";

const shortid = require("shortid");

const project = {
  Name: "Website Redesign",
  Start: "1/5/2019",
  End: "5/4/2019",
  Units: "Days",
  Milestones: [
    {
      Name: "Planning",
      Units: 22,
      Tasks: [
        {
          Name: "Kick-off meeting",
          Units: 5
        },
        {
          Name: "Project roadmap",
          Units: 4
        },
        {
          Name: "User stories",
          Units: 10
        }
      ]
    },
    {
      Name: "Design",
      Units: 30,
      Tasks: [
        {
          Name: "Design meeting",
          Units: 5
        },
        {
          Name: "Moodboards",
          Units: 4
        },
        {
          Name: "Wireframes",
          Units: 10
        },
        {
          Name: "Complete design",
          Units: 10
        }
      ]
    }
  ]
};

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
    this.setState({ [index]: tf });
  };

  moveMilestoneUp = i => {
    if (i === 0) {
      return;
    }
    console.log(
      "Moving MS: " + JSON.parse(JSON.stringify(this.state.Milestones[i]))
    );

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
    });
  };

  moveMilestoneDown = i => {
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
  };

  deleteMilestone = i => {
    this.setState(state => {
      let newState = state;
      newState.Milestones = newState.Milestones.slice(0, i).concat(
        newState.Milestones.slice(i + 1)
      );
      return newState;
    });
  };

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
    });
  };

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
  };

  deleteTask = (i, j) => {
    this.setState(state => {
      let newState = state;
      newState.Milestones[i].Tasks = newState.Milestones[i].Tasks.slice(
        0,
        j
      ).concat(newState.Milestones[i].Tasks.slice(j + 1));
      return newState;
    });
  };

  addTask = (i, j) => {
    //Create new blank task to be added at given index
    let newTask = {
      Name: "",
      Units: "",
      id: shortid.generate()
    };

    this.setState(state => {
      let newState = state;
      // Add new task
      newState.Milestones[i].Tasks = state.Milestones[i].Tasks.slice(
        0,
        j
      ).concat([newTask], state.Milestones[i].Tasks.slice(j));

      newState.highlights = { ["h-" + i + "-" + j]: true };
      return newState;
    });
  };

  addMilestone = i => {
    console.log("add index: ", i);
    //Create new blank task to be added at given index
    let newMilestone = {
      Name: "",
      Units: "",
      id: shortid.generate(),
      Tasks: [
        {
          Name: "",
          Units: "",
          id: shortid.generate()
        }
      ]
    };

    const reqBody = {
      mstoneName: "Test milestone",
      startDate: "12/2/2020",
      length: 123,
      description: "This is a test, this is only a test, calm the fuck down.",
      owner: "The President",
      ProjectId: "ak3928aldkjvma93",
      tasks: [
        {
          taskName: "Task 1",
          startDate: "12/3/2090",
          taskLength: 33,
          taskDescription: "Test task description"
        },
        {
          taskName: "Task 2",
          startDate: "12/3/2210",
          taskLength: 12,
          taskDescription: "Test task description TOO"
        }
      ]
    };

    fetch("/addmilestone", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reqBody)
    })
      .then(response => response.json())
      .then(resJson => {
        if (!resJson.success) {
          throw Error("Error adding milestone");
        }
      })
      .catch(err => {
        console.log("Issue adding milestone: ", err);
        this.setState();
      });

    this.setState(state => {
      let newState = state;
      // Insert new milestone at index
      newState.Milestones = state.Milestones.slice(0, i).concat(
        [newMilestone],
        state.Milestones.slice(i)
      );
      newState.highlights = { ["h-" + i]: true };
      return newState;
    });
  };

  updateMilestoneName = (i, text) => {
    this.setState(state => {
      let newState = state;
      newState.Milestones[i].Name = text;
      return newState;
    });
  };

  updateTaskName = (i, j, text) => {
    this.setState(state => {
      let newState = state;
      newState.Milestones[i].Tasks[j].Name = text;
      return newState;
    });
  };

  milestoneSortEnd = ({ oldIndex, newIndex }) => {
    console.log(`Old: ${oldIndex} New: ${newIndex}`);
    console.log(this.state.Milestones);
    this.setState(state => {
      let newState = state;
      newState.Milestones = arrayMove(state.Milestones, oldIndex, newIndex);
      console.log(newState.Milestones);
      return newState;
    });
  };

  taskSortEnd = ({ oldIndex, newIndex }, i) => {
    console.log(`Old: ${oldIndex} New: ${newIndex} MS: ${i}`);
    this.setState(state => {
      let newState = state;
      newState.Milestones[i].Tasks = arrayMove(
        state.Milestones[i].Tasks,
        oldIndex,
        newIndex
      );
      return newState;
    });
  };

  render() {
    return (
      <div className="project-form">
        <SortableList onSortEnd={this.milestoneSortEnd} useDragHandle>
          {[].concat(this.state.Milestones).map((ms, i) => (
            <SortableMilestone
              key={ms.id}
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
              addTask={this.addTask}
              deleteTask={this.deleteTask}
              updateTaskName={this.updateTaskName}
              tasks={ms.Tasks}
              sortEndFunc={this.taskSortEnd}
            />
          ))}
          <li style={{ paddingLeft: "80px", fontSize: ".5em" }}>
            <button
              className="add-milestone"
              onClick={() => this.addMilestone(this.state.Milestones.length)}
            >
              <MdAdd />
            </button>
          </li>
        </SortableList>
      </div>
    );
  }
}

const SortableList = SortableContainer(({ children }) => {
  return <ul className="milestone-list">{children}</ul>;
});

const SortableMilestone = SortableElement(props => {
  return (
    <li className={props.fading ? "highlight-fade" : ""}>
      <Milestone
        name={props.name}
        units={props.units}
        id={props.i}
        moveItemUp={() => props.moveMilestoneUp(props.i)}
        moveItemDown={() => props.moveMilestoneDown(props.i)}
        deleteItem={() => props.deleteMilestone(props.i)}
        addAbove={() => props.addMilestone(props.i)}
        onType={text => props.updateMilestoneName(props.i, text)}
      />
      <SortableList
        onSortEnd={ind => props.sortEndFunc(ind, props.i)}
        useDragHandle
      >
        {props.tasks.map((task, j) => (
          <SortableTask
            key={task.id}
            name={task.Name}
            units={task.Units}
            index={j}
            moveItemUp={() => props.moveTaskUp(props.i, j)}
            moveItemDown={() => props.moveTaskDown(props.i, j)}
            deleteItem={() => props.deleteTask(props.i, j)}
            addAbove={() => props.addTask(props.i, j)}
            onType={text => props.updateTaskName(props.i, j, text)}
          />
        ))}
      </SortableList>
      <div style={{ paddingLeft: "100px" }}>
        <button
          className="add-task"
          onClick={() => props.addTask(props.i, props.tasks.length)}
        >
          <MdAdd />
        </button>
      </div>
    </li>
  );
});

const SortableTask = SortableElement(props => (
  <li>
    <Task {...props} />
  </li>
));

const DragHandle = SortableHandle(() => <span>::</span>);

export default ProjectFields;
