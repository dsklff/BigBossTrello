import React from 'react';
import Auth from '../modules/Auth';
import Config from '../components/Config.jsx';
import axios from 'axios';


class ConfigPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props) {
    super(props);

    this.state = {
      user:{
        name: '',
        email: '',
        myImg: ''
      },
      uploaded: false,
      file: '',
      trelloToken:''
    };
     this.componentDidMount = this.componentDidMount.bind(this);
     this.uploadMyImage = this.uploadMyImage.bind(this);
     this.changeImg = this.changeImg.bind(this);
     this.addTrelloName = this.addTrelloName.bind(this);
     this.changeUser = this.changeUser.bind(this);
  }

  /**
   * This method will be executed after initial rendering.
   */
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
    changeImg(e){
      e.preventDefault();

      let reader = new FileReader();
      let file = e.target.files[0];

      reader.onloadend = () => {
        this.setState({
          file: file,
          uploaded: true
        });
      }
      reader.readAsDataURL(file)
    }

    uploadMyImage(e){
    e.preventDefault();
    return new Promise((resolve, reject) => {
      let imageFormData = new FormData();
      imageFormData.append('imageFile', this.state.file);
      axios.post('/api/uploadImg', imageFormData, {
        responseType: 'json',
        headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        'Authorization': `bearer ${Auth.getToken()}`
        }
      })
        .then(res => {
            this.setState({
              user: res.data.user,
              uploaded: false
            });
        });
    });
  }

    addTrelloName(e) {
    e.preventDefault();
    const trelloName = encodeURIComponent(this.state.trelloName);
      const formData = `trelloName=${trelloName}`;
      axios.post('/api/addtrello', formData, {
        responseType: 'json',
        headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        'Authorization': `bearer ${Auth.getToken()}`
        }
      })
        .then(res => {
            if(res.status === 201){
              alert("Сотрудник:  ''" + trelloName + "'' сохранен!!!")
              window.location.reload();
            } else {
              alert("Сотрудник с таким trelloName:  ''" + trelloName + "'' уже существует!!!");
            }
            this.componentDidMount();
        })
    
  }
  changeUser(event) {

    this.setState({
      trelloName:event.target.value,
    });
  }
  
  /**
   * Render the component.
   */
  render() {
    return (<Config user={this.state.user} 
                    trelloName={this.state.trelloName}
                    uploadMyImage={this.uploadMyImage}
                    uploaded={this.state.uploaded}
                    changeImg={this.changeImg}
                    addTrelloName={this.addTrelloName}
                    changeUser={this.changeUser}
            />);
  }

}

export default ConfigPage;
