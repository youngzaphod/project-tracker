import React, { Component } from 'react';
import {Input, List, Grid, Dropdown } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';

const options = [
  { key: '.com', text: '.com', value: '.com' },
  { key: '.net', text: '.net', value: '.net' },
  { key: '.org', text: '.org', value: '.org' },
]

class Form extends Component {
    state = {
        name: '',
    }
  
  render() {
    return (
      <Grid container>
      <Grid.Column width={16}>
        <Input
          fluid
          placeholder='Project Name'
          size='massive'
          value={this.state.name}
          onChange={(e) => this.setState({name: e.target.value})}
          onKeyDown={this.handleKeyDown}
        />
        <List>
            <List.Item>
                <List.Icon name='certificate' />
                
                <List.Content>
                    <List.Header>
                        <Input
                            fluid
                            transparent
                            placeholder='Newish milestone'
                            value={this.state.milestone}
                            //onChange={(e) => this.setState({name: e.target.value})}
                            onKeyDown={this.handleKeyDown}
                        />
                    </List.Header>
                    <List.List>
                        <List.Item>
                            <List.Icon name='thumbtack' />
                            <List.Content>
                                <List.Header>
                                <Input
                                    fluid
                                    transparent
                                    placeholder='New task'
                                    label={<Dropdown defaultValue='.com' options={options} />}
                                    labelPosition='right'
                                    value={this.state.milestone}
                                    //onChange={(e) => this.setState({name: e.target.value})}
                                    onKeyDown={this.handleKeyDown}
                                />
                                </List.Header>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Icon name='thumbtack' />
                            <List.Content>
                                <List.Header>
                                <Input
                                    fluid
                                    transparent
                                    placeholder='New task'
                                    value={this.state.milestone}
                                    //onChange={(e) => this.setState({name: e.target.value})}
                                    onKeyDown={this.handleKeyDown}
                                />
                                </List.Header>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Content>
                                <Input
                                    fluid
                                    transparent
                                    icon='thumbtack'
                                    iconPosition='left'
                                    placeholder='New task'
                                    value={this.state.milestone}
                                    //onChange={(e) => this.setState({name: e.target.value})}
                                    onKeyDown={this.handleKeyDown}
                                />
                            </List.Content>
                        </List.Item>
                    </List.List>
                </List.Content>
            </List.Item>
            <List.Item>
                <List.Icon name='certificate' />
                <List.Content>
                    <Input
                        fluid
                        transparent
                        placeholder='New milestone'
                        value={this.state.milestone}
                        //onChange={(e) => this.setState({name: e.target.value})}
                        onKeyDown={this.handleKeyDown}
                    />
                    <List.List>
                        <List.Item>
                            <List.Content>
                                <Input
                                    fluid
                                    transparent
                                    icon='thumbtack'
                                    iconPosition='left'
                                    placeholder='New task'
                                    label={<Dropdown defaultValue='.com' options={options} />}
                                    labelPosition='right'
                                    value={this.state.milestone}
                                    //onChange={(e) => this.setState({name: e.target.value})}
                                    onKeyDown={this.handleKeyDown}
                                />
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Content>
                                <Input
                                    fluid
                                    transparent
                                    icon='thumbtack'
                                    iconPosition='left'
                                    placeholder='New task'
                                    value={this.state.milestone}
                                    //onChange={(e) => this.setState({name: e.target.value})}
                                    onKeyDown={this.handleKeyDown}
                                />
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Content>
                                <Input
                                    fluid
                                    transparent
                                    icon='podcast'
                                    iconPosition='left'
                                    placeholder='New task'
                                    value={this.state.milestone}
                                    //onChange={(e) => this.setState({name: e.target.value})}
                                    onKeyDown={this.handleKeyDown}
                                />
                            </List.Content>
                        </List.Item>
                    </List.List>
                </List.Content>
            </List.Item>
        
        </List>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Form;