import React, {Component} from 'react';
import {Switch, Route, BrowserRouter as Router} from 'react-router-dom';
import Header from './Components/Header';
import Start from './Components/Start';

class App extends Component {
  render() {
    return (
        <Router>
          <Header/>
          <Switch>
            <Route exact path="/story" render={props => (<Start storyID={props.match.params.storyID} />)}/>
            <Route path="/story/:storyID" render={props => (<Start storyID={props.match.params.storyID} />)}/>
          </Switch>
        </Router>
    );
  }
}

export default App;