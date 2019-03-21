import React, { Component } from "react";
import Header from "./Components/Header";
import ProjectFields from "./Components/ProjectFields2";
import ProjectHead from "./Components/ProjectHead";
import Container from "react-bootstrap/Container";
//import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
//import { FaCog } from "react-icons/fa";
//import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./App.css";

class App extends Component {
  state = {
    name: "",
    start: "",
    finish: "",
    startErrorMsg: "",
    finishErrorMsg: "",
    errMessage: ""
  };

  // TODO: Pass start and finish from here to component

  render() {
    return (
      <Container fluid>
        <Row>
          <Col lg={true}>
            <Header />
          </Col>
        </Row>

        <ProjectHead />

        <Row className="justify-content-center">
          <Col lg={6} md={10} sm={8} xs={12}>
            {this.state.errMessage !== "" ? (
              <Alert variant="danger">{this.state.errMessage}</Alert>
            ) : (
              ""
            )}
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col lg={6}>
            <ProjectFields />
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={2} sm={3} xs={12}>
            <Button variant="dark">Save Project</Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
