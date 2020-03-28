import React, {Component} from 'react';
import {Switch, Route, BrowserRouter as Router} from 'react-router-dom';
import Header from './Components/Header';
import Start from './Components/Start';
import Open from './Components/Open';
import Complete from './Components/Complete';
import Home from './Components/Home';
import Contact from './Components/Contact';

class App extends Component {
  render() {
    return (
        <Router>
          <Header/>
          <Switch>
            <Route exact path="/" render={props => (<Home/>)}/>
            <Route exact path="/story" render={props => (<Start/>)}/>
            <Route path="/story/:storyID" render={props => (<Start storyID={props.match.params.storyID} />)}/>
            <Route exact path="/open" render={props => (<Open/>)}/>
            <Route exact path="/complete" render={props => (<Complete/>)}/>
            <Route exact path="/contact" render={props => (<Contact/>)}/>
          </Switch>
        </Router>
    );
  }
}

export default App;