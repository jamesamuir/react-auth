import ArticleList from '../Article/ArticleList';
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import agent from '../../api/agent';
import { connect } from 'react-redux';
import {Tabs, Tab} from 'react-bootstrap';
import {
  FOLLOW_USER,
  UNFOLLOW_USER,
  PROFILE_PAGE_LOADED,
  PROFILE_PAGE_UNLOADED
} from '../../redux/actions/actionTypes';

const EditProfileSettings = props => {
  if (props.isUser) {
    return (
      <Link
        to="/settings"
        className="btn btn-sm btn-outline-secondary action-btn">
        <i className="ion-gear-a"></i> Edit Profile Settings
      </Link>
    );
  }
  return null;
};

const FollowUserButton = props => {
  if (props.isUser) {
    return null;
  }

  let classes = 'btn btn-sm action-btn';
  if (props.user.following) {
    classes += ' btn-secondary';
  } else {
    classes += ' btn-outline-secondary';
  }

  const handleClick = ev => {
    ev.preventDefault();
    if (props.user.following) {
      props.unfollow(props.user.username)
    } else {
      props.follow(props.user.username)
    }
  };

  return (
    <button
      className={classes}
      onClick={handleClick}>
      <i className="ion-plus-round"></i>
      &nbsp;
      {props.user.following ? 'Unfollow' : 'Follow'} {props.user.username}
    </button>
  );
};



function Profile({onLoad, onUnload, onFollow, onUnfollow, defaultProfile, defaultCurrentUser, ...props}){

  const [profile, setProfile] = useState({...defaultProfile});
  const [currentUser, setCurrentUser] = useState({...defaultCurrentUser});
  const [isUser, setIsUser] = useState(false);
  const [activeTab, setActiveTab] = useState(1);

  // Set Profile and CurrentUser state
  useEffect(() => {
    if (defaultProfile){
      setProfile(defaultProfile);
    }else{
      setProfile(null);
    }

    if (defaultCurrentUser){
      setCurrentUser(defaultCurrentUser);
    }else{
      setCurrentUser(null);
    }

    if(defaultProfile && defaultCurrentUser &&
        defaultProfile.username === defaultCurrentUser.username) setIsUser(true);

    },[defaultProfile, defaultCurrentUser]);

  // Set inital load state
  useEffect(() => {
    onLoad(Promise.all([
      agent.Profile.get(props.match.params.username),
      agent.Articles.byAuthor(props.match.params.username)
    ]));

    return () => {
      onUnload();
    }

  }, []);

  function handleTabSelect(activeTab){
    setActiveTab(activeTab);
  }




  return (
    <div className="profile-page">

      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">

              <img src={profile.image} className="user-img" alt={profile.username} />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>

              <EditProfileSettings isUser={isUser} />
              <FollowUserButton
                isUser={isUser}
                user={profile}
                follow={onFollow}
                unfollow={onUnfollow}
                />

            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">


            <Tabs  onSelect={handleTabSelect} className="articles-toggle">
              <Tab eventKey={1} title="Home">
                <div>
                <ArticleList
                    pager={props.pager}
                    articles={props.articles}
                    articlesCount={props.articlesCount}
                    state={props.currentPage} />
                </div>
              </Tab>
              <Tab eventKey={2} title="Test">
                <h1>Not Trash</h1>
              </Tab>

            </Tabs>



            {/*<div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <Link
                      className="nav-link active"
                      to={`/@${this.props.profile.username}`}>
                    My Articles
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                      className="nav-link"
                      to={`/@${this.props.profile.username}/favorites`}>
                    Favorited Articles
                  </Link>
                </li>
              </ul>
            </div>*/}


          </div>

        </div>
      </div>

    </div>
  );

}

function mapStateToProps (state) {
  return {
    ...state.articleList,
    defaultCurrentUser: state.common.currentUser,
    defaultProfile: state.profile
  }
}

const mapDispatchToProps = dispatch => ({
  onFollow: username => dispatch({
    type: FOLLOW_USER,
    payload: agent.Profile.follow(username)
  }),
  onLoad: payload => dispatch({ type: PROFILE_PAGE_LOADED, payload }),
  onUnfollow: username => dispatch({
    type: UNFOLLOW_USER,
    payload: agent.Profile.unfollow(username)
  }),
  onUnload: () => dispatch({ type: PROFILE_PAGE_UNLOADED })
});


export default connect(mapStateToProps, mapDispatchToProps)(Profile);
export { Profile, mapStateToProps };
