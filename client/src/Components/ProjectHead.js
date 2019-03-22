import React from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "react-datepicker/dist/react-datepicker.css";
import Button from "react-bootstrap/Button";
import { FaCog } from "react-icons/fa";
import DatePicker from "react-datepicker";

class ProjectHead extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    name: "",
    start: "",
    finish: "",
    startErrorMsg: "",
    finishErrorMsg: "",
    errMessage: ""
  };

  handleName = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleDayChange = (date, which) => {
    let errorSet = "";
    console.log(date);
    if (
      (which === "start" &&
        this.state.finish !== "" &&
        date > this.state.finish) ||
      (which === "finish" && this.state.start !== "" && date < this.state.start)
    ) {
      errorSet = "Start date must come before finish date!";
    }
    this.setState({
      [which]: date,
      errMessage: errorSet
    });
  };

  render() {
    return (
      <Row noGutters className="justify-content-center">
        <Col lg={4} md={5} sm={10}>
          <br />
          <Form.Control
            onChange={this.handleName}
            name="name"
            size="lg"
            type="text"
            placeholder="Project name"
          />
        </Col>
        <Col md={2} sm={5} xs={12}>
          <br />
          <DatePicker
            maxDate={this.state.finish !== "" ? this.state.finish : null}
            placeholderText="Start"
            showMonthDropdown
            showYearDropdown
            customInput={
              <Form.Control
                // onClick={this.props.onClick}
                size="lg"
                // value={this.props.value}
              />
            }
            onChange={date => {
              this.handleDayChange(date, "start");
              this.props.onDateChange("start", date);
            }}
            selected={this.state.start !== "" ? this.state.start : null}
          />
        </Col>
        <Col lg={2} md={2} sm={5} xs={12}>
          <br />
          <DatePicker
            minDate={this.state.start !== "" ? this.state.start : null}
            placeholderText="Finish"
            customInput={
              <Form.Control
                // onClick={this.props.onClick}
                size="lg"
                // value={this.props.value}
              />
            }
            onChange={date => {
              this.handleDayChange(date, "finish");
              this.props.onDateChange("finish", date);
            }}
            selected={this.state.finish !== "" ? this.state.finish : null}
          />
        </Col>
        <Col sm={1}>
          <br />
          <Button variant="light">
            <FaCog size={26} />
          </Button>
        </Col>
      </Row>
    );
  }
}

export default ProjectHead;
