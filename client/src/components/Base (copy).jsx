import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import Auth from '../modules/Auth';
import Trello from './Trello.jsx';
import Config from'./Config.jsx';
import { Card, CardTitle } from 'material-ui/Card';


const Base = ({ 
  children
    }) => (

      <div>
      {Auth.isUserAuthenticated() ? (

      <div>
        <div className="col-2">
          <span> BigBossTrello </span>
        </div>  
       
      <div className="col-4">
        <input type="text" placeholder="Search.."></input>
      </div>  

      <div className="col-3">
         <button onClick={Trello.getFromTrello} className="btn forTrello">Синхронизировать с Trello<i className="fa fa-lg fa-arrow-circle-down"></i></button>
      </div>



       <div className="col-13">
  <div className="dropdown">
    <button className="dropbtn"><i className="fa fa-ellipsis-v" aria-hidden="true"></i></button>
    <div className="dropdown-content">
          <a href="#"><Link to = "/">Project</Link></a>
          <a href="#"><Link to = "/config">Profile</Link></a>
          <a href="#"><Link to = "/logout">Logout</Link></a>
          
    </div>
      </div>

      </div>

     
      <div className="col-16">
        <span></span><br/>
      </div>


      </div>
      ) : (

      <div>
        <div className="col-2">
          <span>BigBossTrello</span>
        </div>

      <div className="col-13">
      <div className="dropdown">
    <button className="dropbtn"><i className="fa fa-ellipsis-v" aria-hidden="true"></i></button>
    <div className="dropdown-content">
          <a href="#"><Link to = "/login">Log in</Link></a>
          <a href="#"><Link to = "/signup">Sign up</Link></a>
          
    </div>
      </div>

      </div>
        </div>  
      )}

       {children}

       </div>

     
);


Base.propTypes = {
  children: PropTypes.object.isRequired
};

export default Base;




