import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from '../../firebase';

import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from "semantic-ui-react";

export default class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: [],
    loading: false,
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value});
  }

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ errors: [], loading: true});

    if (this.isFormValid(this.state)) {
      const { email, password } = this.state;
      firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        console.log(user)
        this.setState({loading: false})
      })
      .catch(error => {
        console.log(error)
        this.setState(previousError => {
          return {
            errors: previousError.errors.concat(error),
            loading: false,
          }
        })
      });
      }
  }

  isFormValid = ({ email, password }) => email && password;

  handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error': ''
  }

  displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);
  

  render() {
    const { email, password, errors, loading } = this.state;

    return (
      <div>
        <Grid textAlign="center" verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" icon color="orange" textAlign="center">
              <Icon name="slack" color="orange" />
              Login to UcChat
            </Header>

            <Form onSubmit={this.handleSubmit} size="large">
              <Segment stacked>
                <Form.Input
                  fluid
                  name="email"
                  icon="mail"
                  iconPosition="left"
                  placeholder="Email Address"
                  onChange={this.handleChange}
                  value={email}
                  className={this.handleInputError(errors, 'no user record')}
                  type="email"
                />
                <Form.Input
                  fluid
                  name="password"
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  onChange={this.handleChange}
                  value={password}
                  className={this.handleInputError(errors, 'password')}
                  type="password"
                />

                <Button loading={loading} color="orange" fluid size="large">Submit</Button>
              </Segment>
            </Form>
            {errors.length > 0 ?
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
            : ''
            }

            <Message>Already a user? <Link to="/register">Register</Link></Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
