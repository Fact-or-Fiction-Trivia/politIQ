import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import AuthUserContext from './AuthUserContext';
import { withFirebase, auth } from '../../firebase';
import * as routes from '../../constants/routes';

const withAuthorization = (authCondition) => (Component) => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      this.listener = auth.onAuthUserListener(
        authUser => {
          if(!authCondition(authUser)) {
            this.props.history.push(routes.SIGN_IN);
          }
        },
        () => this.props.history.push(routes.SIGN_IN)
      )
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser => authUser ? <Component {...this.props} /> : null }
        </AuthUserContext.Consumer>
      )
    }
  }

  return compose(
    withRouter,
    withFirebase,
  )(WithAuthorization);
}

export default withAuthorization;
