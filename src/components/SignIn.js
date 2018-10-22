import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { SignUpLink } from './SignUp';
import { PasswordForgetLink } from './PasswordForget';
import { auth, db } from '../firebase';
// import * as firebase from '../firebase';
import * as routes from '../constants/routes';

// UI
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './Auth.css';

const SignInPage = ({ history }) => {
  return (
    <Paper className="authCard">
      <h1>Sign In</h1>
      <SignInForm  history={history}/>
      <PasswordForgetLink />
      <SignUpLink />
    </Paper>
  )
}


const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});




const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  isAdmin = async () => {
    const { history } = this.props;
    const check = await db.checkAdmin()
      if (check == true) { // this doesn't work yet - it always hit s home
        console.log('is admin')
        history.push(routes.ADMIN_DASHBOARD)
      } else {
        console.log('is not admin')
        history.push(routes.HOME);
      }
    

  }

  onSubmit = (event) => {
    const {
      email,
      password,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doSignInWithEmailAndPassword(email, password)
      .then((authUser) => {
        this.setState({ ...INITIAL_STATE });
        const userID = authUser.uid;
        this.isAdmin();

      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid =
      password === '' ||
      email === '';

    return (
      <form onSubmit={this.onSubmit}>
        <TextField
          margin="normal"
          fullWidth
          value={email}
          onChange={event => this.setState(byPropKey('email', event.target.value))}
          type="text"
          placeholder="Email Address"
        /><br />
        <TextField
          margin="normal"
          fullWidth
          value={password}
          onChange={event => this.setState(byPropKey('password', event.target.value))}
          type="password"
          placeholder="Password"
        />
        <Button disabled={isInvalid} type="submit" variant="contained" color="primary" style={{ marginTop: '2vh'}}>
          Sign In
        </Button>

        { error && <p>{error.message}</p> }
      </form>
    );
  }
}

const SignInLink = () =>
  <p>
    Already have an account?
    {' '}
    <Link to={routes.SIGN_IN}>Log in here.</Link>
  </p>

export default withRouter(SignInPage);

export {
  SignInForm,
  SignInLink
};
