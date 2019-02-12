import React, { Component } from 'react';
import {
    Button,
    Form,
    Grid,
    Header,
    Message,
    Segment,
} from 'semantic-ui-react';

export default () => (
    <Grid centered columns={2}>
        <Grid.Column>
            <Header as='h2' textAlign='center'>
            Login
            </Header>
            <Segment>
                <Form size = 'large'>
                    <Form.Input
                        fuild
                        icon='user'
                        iconPosition='left'
                        placeholder="Email address"
                    />
                    <Form.Input
                        fuild
                        icon='lock'
                        iconPosition='left'
                        placeholder='Password'
                        type='password'
                    />
                    <Button color='blue' fuild size='large'>
                    Login
                    </Button>
                </Form>
            </Segment>
            <Message>
            Not registered yet? Sing up!
            </Message>
        </Grid.Column>
    </Grid>

);
