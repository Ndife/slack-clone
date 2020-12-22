import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import md5 from "md5";

import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from "semantic-ui-react";

export default class Register extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: [],
    loading: false,
    usersRef: firebase.database().ref('users')
  }

  isFormValid = () => {
    let errors = [];
    let error;

    if (this.isFormEmpty(this.state)){
      error = { message: 'Fill in all fields'}
      this.setState({errors: errors.concat(error)});
      return false;
    }else if (!this.isPasswordValid(this.state)){
      error = { message: 'Password is invalid '}
      this.setState({ errors: errors.concat(error)});
      return false;
    }else {
      return true;
    }
  }

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return !username.length || !email.length || !password.length || !passwordConfirmation.length
  }

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6){
      return false;
    }else if (password !== passwordConfirmation){
      return false;
    }else {
      return true;
    }
  }

  displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleChange = event => {
    const {name, value} = event.target;
    this.setState({[name]: value});
  }

  handleSubmit = event => {
    if (this.isFormValid()){
      const { username, email, password } = this.state;
      event.preventDefault();
      this.setState({ errors: [], loading: true });
      firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(createdUser => {
        console.log(createdUser);
        createdUser.user.updateProfile({
          displayName: username,
          photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
        })
        .then(() => {
          this.saveUser(createdUser).then(() => {
            console.log('user saved');
            this.setState({ loading: false });
          })
        })
        .catch((err) => {
          console.log(err);
          this.setState(oldState => {
            return { errors: oldState.errors.concat(err)}
          })
        })
      })
      .catch(err => {
        console.log(err);
        this.setState(previousErrors => {
          return {errors: previousErrors.errors.concat(err), loading:false}
        })
      });
    }
  }

  saveUser = createdUser => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  }


  handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : ''
  }

  render() {
    const { username, email, password, passwordConfirmation, errors, loading} = this.state;
    
    return (
      <div>
        <Grid textAlign="center" verticalAlign="middle" className="app">
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" icon color="orange" textAlign="center">
              <Icon name="slack" color="orange" />
              Register for UcChat
            </Header>

            <Form onSubmit={this.handleSubmit} size="large">
              <Segment stacked>
                <Form.Input
                  fluid
                  name="username"
                  icon="user"
                  iconPosition="left"
                  placeholder="Username"
                  onChange={this.handleChange}
                  value={username}
                  className={this.handleInputError(errors, "username")}
                  type="text"
                />
                <Form.Input
                  fluid
                  name="email"
                  icon="mail"
                  iconPosition="left"
                  placeholder="Email Address"
                  onChange={this.handleChange}
                  value={email}
                  className={this.handleInputError(errors, "email")}
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
                  className={this.handleInputError(errors, "password")}
                  type="password"
                />
                <Form.Input
                  fluid
                  name="passwordConfirmation"
                  icon="repeat"
                  iconPosition="left"
                  placeholder="Password Confirmation"
                  onChange={this.handleChange}
                  value={passwordConfirmation}
                  className={this.handleInputError(errors, "password")}
                  type="password"
                />

                <Button loading={loading} color="orange" fluid size="large">Submit</Button>
              </Segment>
            </Form>
            {errors.length > 0 && (
              <Message error>
                <h3>Error</h3>
                {this.displayErrors(errors)}
              </Message>
            )}
            <Message>Already a user? <Link to="/login">Login</Link></Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}