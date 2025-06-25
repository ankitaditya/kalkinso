import React, { Component } from 'react';
import { InlineNotification } from '@carbon/react';
import { connect } from 'react-redux';
import { loadUser, setLoading } from '../actions/auth';

class NotFound extends Component {
  componentDidMount() {
    if (this.props.isAuthenticated) {
      // window.location.href = '/#/Home/search';
    } else if (!this.props.isAuthenticated&&localStorage.getItem('token')) {
      this.props.dispatch(setLoading(true));
      this.props.dispatch(loadUser({token: localStorage.getItem('token')}))
    }
  }
  render() {
    return (
        <InlineNotification
            title='404'
            subtitle='Not Found'
        />
    );
  }
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps,null)(NotFound);
