import React from 'react';
import Auth from '../modules/Auth';
import Trello from '../components/Trello.jsx';
 

class ProjectsPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props) {
    super(props);
  }

  /**
   * Render the component.
   */
  render() {

    return (<Trello />);
  }

}

export default ProjectsPage;
