import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import Auth from '../modules/Auth';
import Config from'./Config.jsx';
import { Card, CardTitle } from 'material-ui/Card';
import axios from 'axios';

export default class PrivateRoute extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      user:{
        name: '',
        email: '',
        myImg: ''
      }
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.getTrello = this.getTrello.bind(this);
  }
  componentDidMount() {

    // geting current user info by id
    axios.get('/api/profile', {

      responseType: 'json',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        'Authorization': `bearer ${Auth.getToken()}`
      }

    })
      .then(res =>{

          if(res && res.data && res.data.user){
            this.setState({
              user:res.data.user

            });
        }
         
      })      
  }
  getTrello() {
    var trelloB = document.getElementById("hiddenTrelloButton");
   
    trelloB.click();
    document.getElementById("locker").style.display = "block";
  }

render () {
return (

      <div>
      <div id="locker" className="screenLock"> <div className="loader"></div> </div> 
      {Auth.isUserAuthenticated() ? (
       
      <div className="row">
        <div className="col-2">
          <Link to ="/">
          <p className="plogo">
          <mark className="red">BigBoss</mark>
          <mark className="blue">Trello</mark>
          </p>
          <span className="podspan">доска проектов</span>
          </Link>
        </div>  

       
      <div className="col-4">
 
      </div>  

      <div className="col-3">
         <button onClick={this.getTrello} className="btn forTrello"><img src={require('../../../public/img/trello.svg')} className="credits" />Синхронизировать с Trello</button>
      </div>



       <div className="col-13">
  <div className="dropdown">
    <button className="dropbtn"><img src={require('../../../public/img/more.png')} className="downdrop" /></button>
    <div className="dropdown-content">
          <Link to = "/">Проекты</Link>
          <Link className="middleLink" to = "/config">Профиль</Link>
          <Link to = "/logout">Выйти</Link>
          
    </div>
      </div>

      </div>

     
      <div className="col-16 row" style={{padding: "15px"}}>
          <div className="col-md-2" style={{padding: "0", height: "45px", border: "none", width: "45px", "display": "inline-block" }}>
           {(this.state.user.myImg.length > 0) ? (
             <img src={require('../../../public/userImgs/'+this.state.user.myImg)} className="onTop" />
           ):(
             <img src={require('../../../public/img/default.jpg')} className="onTop"/>
           )}
           </div>
            <div className="col-md-10">         
                <span className="imya">{this.state.user.name}</span>
            </div>
      </div>


      </div>
      ) : (

      <div className="row">
        <div className="col-2">
        <p className="plogo">
          <mark className="red">BigBoss</mark>
          <mark className="blue">Trello</mark>
          </p>
           <span className="podspan">доска проектов</span>
        </div>

       <div className="col-20">
        </div> 

      <div className="col-13">
      <div className="dropdown">
    <button className="dropbtn"><img src={require('../../../public/img/more.png')} className="downdrop" /></button>
    <div className="dropdown-content">
          <Link to = "/login">Войти</Link>
          <Link className="middleLink" to = "/signup">Регистрация</Link>
          
    </div>
      </div>

      </div>
        </div>  
      )}

       {this.props.children}

       </div>

     
);

}


}
