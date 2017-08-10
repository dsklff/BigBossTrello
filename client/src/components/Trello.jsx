import React from 'react';
import Auth from '../modules/Auth';
import axios from 'axios';
import LineChart from 'react-linechart';
import moment from 'moment';
moment.locale('ru');

const today = new Date();

class Trello extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    	projects:[],
      isOpen: false
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.getFromTrello = this.getFromTrello.bind(this);
  };

  componentDidMount(){
    axios.get('/api/getprojects',  {
      responseType: 'json',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        'Authorization': `bearer ${Auth.getToken()}`
      }
    })
      .then(res => {
          this.setState({
						projects:res.data.projects
         });
      });
  }

  getFromTrello(){
    axios.get('/api/gettrello',  {
      responseType: 'json',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        'Authorization': `bearer ${Auth.getToken()}`
      }
    })
      .then(res => {
        this.componentDidMount()
        document.getElementById("locker").style.display = "none";
        alert("Проекты загружены")
      });
  }

  render(){
     

      var projects  = this.state.projects

      var info = function(index){


      var deleteProject = function(e){
        e.preventDefault();
        const projectId = encodeURIComponent(projects[index].boardId);
        const formData = `projectId=${projectId}`;
        axios.post('/api/deleteproject', formData, {
          responseType: 'json',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            'Authorization': `bearer ${Auth.getToken()}`
          }
        })
          .then(res => {
              alert("Проект удален из БД")
              window.location.reload();
          })
      }

      var members = projects[index].members;
      var projectName = projects[index].boardName;
      var projectId = projects[index].boardId;
      var doneCards = projects[index].doneCards;
      var toDoCards = projects[index].toDoCards;
      var curPercent = 100/(doneCards.length+toDoCards.length) * doneCards.length;
  
      return (
      <div>
         <div className="projectCard">
          <div className="members">
          <div className="projectName">{projectName}</div><br/>

            { 
              members.map((member) =>{
                return(
                  <span className ="membersMargin" key={member.id}>{member.fullName}</span>
                )
              })
            }
          </div>
          <div className="project">
            <div>
           <select>

              <option>{toDoCards.length}</option>
              {
                toDoCards.map((card) =>{
                  return(
                    <option key={card.id}>{card.name}</option>
                  )
                })
              }
            </select>
            </div>
          </div>
          <div className="project">
           <select className="select1">
              <option>{doneCards.length}</option>
              {
                doneCards.map((card) =>{
                  return(
                    <option key={card.id}>{card.name}</option>
                  )
                })
              }
            </select>
          </div>

         {
          curPercent>=76 && curPercent <= 100 ?
          (
            <div className="progress-main">
                <span className="progressSpan"> {curPercent.toFixed(2) + '%'}</span>
              <div className="progress">

                <div className="progress-bar progress-bar-success active" role="progressbar"
                aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={{width:curPercent.toFixed(2)+"%"}}>
                  
                </div>
              </div>
            </div>
          ) : (curPercent<=50 && curPercent>=30) ? (
            <div className="progress-main">
               <span className="progressSpan"> {curPercent.toFixed(2) + '%'}</span>
              <div className="progress" >
                <div className="progress-bar progress-bar-warning active" role="progressbar"
                aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={{width:curPercent.toFixed(2)+"%"}}>
                 
                </div>
              </div>
            </div>
          ) : (curPercent<=75 && curPercent>=51) ? (
          <div className="progress-main">
             <span className="progressSpan"> {curPercent.toFixed(2) + '%'}</span>
              <div className="progress" >
                <div className="progress-bar progress-bar-info active" role="progressbar"
                aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={{width:curPercent.toFixed(2)+"%"}}>
                </div>
              </div>
            </div>
            ) : (
             <div className="progress-main">
              <span className="progressSpan"> {curPercent.toFixed(2) + '%'}</span>
              <div className="progress" >
                <div className="progress-bar progress-bar-danger active" role="progressbar"
                aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={{width:curPercent.toFixed(2)+"%"}}>
                </div>
              </div>
            </div>
            )
         }

          <div className="topDelete">
            <button onClick={deleteProject} className="btn btn-danger"><img src={require('../../../public/img/xxicon.jpg')} className="xxicon" /></button>
          </div>
          </div>
        </div>
      )
    }
    return (
	  <div className="greatMain">
  <button onClick={this.getFromTrello} className='HiddenTrello' id='hiddenTrelloButton'></button>
      <div className="mainPad">
        <h2 className="h2project">Текущие проекты</h2>
        <div>
          <div className="projectCard none">
            <div className="members none">Название проекта/Исполнители</div>
            <div className="project none">Активные задачи</div>
            <div className="project1 none">Завершенные задачи</div>
            <div className="progress-main none">Прогресс</div>
            <div className="topDelete none"></div>
          </div>
        </div>
        <div>
          {
            projects.map((project, index) =>{
              return(
                  <div key={index}>
                    {info(index)}
                  </div> 
                )
            })
          }
        </div>
      </div>
	  </div>);
  }
}

export default Trello;