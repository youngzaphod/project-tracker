import React, { Component } from 'react';
import { Segment, Menu } from 'semantic-ui-react';


class Header extends Component {
  
  render() {
    return (
        <Segment inverted>
            <Menu inverted pointing secondary size='large'>
                <Menu.Item name='home' active={true} />
                <Menu.Item name='More Coming...' active={false} />
            </Menu>
        </Segment>
    );
  }
}

export default Header;