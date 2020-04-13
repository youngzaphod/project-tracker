import React, {Component} from 'react';
import {Switch, Route, BrowserRouter as Router} from 'react-router-dom';
import Header from './Components/Header';
import Start from './Components/Start';
import Open from './Components/Open';
import Complete from './Components/Complete';
import Home from './Components/Home';
import TempHome from './Components/TempHome';
import Author from './Components/Author';
import Contact from './Components/Contact';
import NotFound from './Components/NotFound';
import TestSocket from './Components/TestSocket';

class App extends Component {
  render() {
    return (
        <Router>
          <Header/>
          <Switch>
            <Route exact path="/" render={props => (<Home/>)}/>
            <Route exact path="/story" render={props => (<Start/>)}/>
            <Route path="/story/:storyID" render={props => (<Start storyID={props.match.params.storyID} history={props.history} />)}/>
            <Route exact path="/open" render={props => (<Open/>)}/>
            <Route exact path="/complete" render={props => (<Complete/>)}/>
            <Route exact path="/author/:authorEmail" render={props => (<Author authorEmail={props.match.params.authorEmail}/>)}/>
            <Route exact path="/contact" render={props => (<Contact/>)}/>
            <Route exact path="/socket" render={props => (<TestSocket/>)}/>
            <Route render={props => (<NotFound match={props.match}/>)}/>
          </Switch>
        </Router>
    );
  }
}

export default App;