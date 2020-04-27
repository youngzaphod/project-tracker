import React, {Component} from 'react';
import {Switch, Route, BrowserRouter as Router} from 'react-router-dom';
import Header from './Components/Header';
//import TempHeader from './Components/TempHeader';
//import TempHome from './Components/TempHome';
import Start from './Pages/Start';
import Open from './Pages/Open';
import Complete from './Pages/Complete';
import Home from './Pages/Home';
import Author from './Pages/Author';
import Contact from './Pages/Contact';
import TestPage from './Pages/TestPage';
import NotFound from './Pages/NotFound';
import * as io from 'socket.io-client';

const socket = io();

class App extends Component {
  
  render() {
    return (
        <Router>
          <Header/>
          <Switch>
            <Route exact path="/" render={props => (<Home/>)}/>
            <Route exact path="/story" render={props => (<Start socket={socket} />)}/>
            <Route exact path="/story/:storyID" render={props => (<Start socket={socket} storyID={props.match.params.storyID} history={props.history} />)}/>
            <Route exact path="/open" render={props => (<Open/>)}/>
            <Route exact path="/complete" render={props => (<Complete/>)}/>
            <Route exact path="/author/:authorEmail" render={props => (<Author authorEmail={props.match.params.authorEmail}/>)}/>
            <Route exact path="/contact" render={props => (<Contact/>)}/>
            <Route exact path="/testpage" render={props => (<TestPage/>)}/>
            <Route render={props => (<NotFound match={props.match}/>)}/>
          </Switch>
        </Router>
    );
  }
}

export default App;