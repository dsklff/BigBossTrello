import Base from './components/Base.jsx';
import ConfigPage from './containers/ConfigPage.jsx';
import ProjectsPage from './containers/ProjectsPage.jsx';
import HomePage from './components/HomePage.jsx';
import LoginPage from './containers/LoginPage.jsx';
import SignUpPage from './containers/SignUpPage.jsx';
import Auth from './modules/Auth';


const routes = {
  // base component (wrapper for the whole application).
  component: Base,
  childRoutes: [

    {
      path: '/config',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, ConfigPage);
        } else {
          callback(null, LoginPage);
        }
      }
    },

    {
      path: '/',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, ProjectsPage);
        } else {
          callback(null, LoginPage);
        }
      }
    },

    {
      path: '/login',
      component: LoginPage
    },

    {
      path: '/signup',
      component: SignUpPage
    },

    {
      path: '/logout',
      onEnter: (nextState, replace) => {
        Auth.deauthenticateUser();

        // change the current URL to /
        replace('/');
      }
    }

  ]
};

export default routes;
