import React, { Component } from 'react';
import { Grid} from 'semantic-ui-react';
import Form from './Components/Form';
import Header from './Components/Header';
import './App.css';

class App extends Component {
  
  render() {
    return (
      <Grid centered={true}>
        <Grid.Row width={16}>
          <Header />
          <Header />
        </Grid.Row>
        <Grid.Column mobile={16} tablet={8} computer={4}>
          <Form />
        </Grid.Column>
      </Grid>
    );
  }
}

export default App;
