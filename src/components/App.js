import agent from '../api/agent';
import Header from './common/Header';
import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { APP_LOAD, REDIRECT } from '../redux/actions/actionTypes';
import { Route, Switch } from 'react-router-dom';
import Article from '../components/Article';
import Editor from './Article/Editor';
import Home from '../components/Home';
import Login from './Auth/Login';
import Profile from './User/Profile';
import ProfileFavorites from './User/ProfileFavorites';
import Register from './Auth/Register';
import Settings from './User/Settings';
import { store } from '../redux/store';
import { push } from 'react-router-redux';
import './App.scss';



function App(props) {

  useEffect(() => {
    if (props.redirectTo) {
      // this.context.router.replace(nextProps.redirectTo);
      store.dispatch(push(props.redirectTo));
      props.onRedirect();
    }
  }, [props.redirectTo])

  /*componentWillReceiveProps(nextProps) {
    if (nextProps.redirectTo) {
      // this.context.router.replace(nextProps.redirectTo);
      store.dispatch(push(nextProps.redirectTo));
      this.props.onRedirect();
    }
  }*/

  useEffect(() => {
    const token = window.localStorage.getItem('jwt');
    if (token) {
      agent.setToken(token);
    }

    props.onLoad(token ? agent.Auth.current() : null, token);
  }, [])

  /*componentWillMount() {
    const token = window.localStorage.getItem('jwt');
    if (token) {
      agent.setToken(token);
    }

    this.props.onLoad(token ? agent.Auth.current() : null, token);
  }*/


  if (props.appLoaded) {
    return (
      <div>
        <Header
          appName={props.appName}
          currentUser={props.currentUser} />
          <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/editor/:slug" component={Editor} />
          <Route path="/editor" component={Editor} />
          <Route path="/article/:id" component={Article} />
          <Route path="/settings" component={Settings} />
          <Route path="/@:username/favorites" component={ProfileFavorites} />
          <Route path="/@:username" component={Profile} />
          </Switch>
      </div>
    );
  }
  return (
    <div>
      <Header
        appName={props.appName}
        currentUser={props.currentUser} />
    </div>
  );
}

const mapStateToProps = state => {
  return {
    appLoaded: state.common.appLoaded,
    appName: state.common.appName,
    currentUser: state.common.currentUser,
    redirectTo: state.common.redirectTo
  }};

const mapDispatchToProps = dispatch => ({
  onLoad: (payload, token) =>
      dispatch({ type: APP_LOAD, payload, token, skipTracking: true }),
  onRedirect: () =>
      dispatch({ type: REDIRECT })
});

// App.contextTypes = {
//   router: PropTypes.object.isRequired
// };

export default connect(mapStateToProps, mapDispatchToProps)(App);
