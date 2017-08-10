import React from 'react';
import Auth from '../modules/Auth';
import axios from 'axios';

 
class AdminEditMajorModal extends React.Component {
 
  constructor(props){
    super(props);
    this.state = {
      editedMajor:{
        major_name:'',
        major_code:'',
        major_group:'',
        major_department:''
      },
      departments:{}
    };
    this.editMajorFunc=this.editMajorFunc.bind(this);
    this.changeMajor=this.changeMajor.bind(this);
    this.deleteMajor=this.deleteMajor.bind(this);
  };
  componentDidMount() {
    axios.get('/api/getdepartments',  {
      responseType: 'json',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    })
      .then(res => {
        this.setState({
          departments: res.data.allDprtmnts
        });
      });
  }

  editMajorFunc(){
    event.preventDefault();
    const major_id = this.props.major.major_id;
    const old_depId = this.props.major.major_departmentId;
    const formData = `editedMajor=${JSON.stringify(this.state.editedMajor)}&major_id=${major_id}&old_depId=${old_depId}`;
    axios.post('/api/editmajor', formData, {
      responseType: 'json',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        'Authorization': `bearer ${Auth.getToken()}`
      }
    })
  }

  deleteMajor(){
    var major_id = this.props.major.major_id;
    const formData = `major_id=${major_id}`;
    axios.post('/api/deletemajor', formData, {
      responseType: 'json',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        'Authorization': `bearer ${Auth.getToken()}`
      }
    })
  }

  changeMajor(event){
    const field = event.target.name;
    const editedMajor = this.state.editedMajor;
    editedMajor[field] = event.target.value;
    this.setState({
      editedMajor
    })
  }

  render(){
    // Render nothing if the "show" prop is false
    if(!this.props.show) {
      return null;
    }
    
    // The gray background
    const backdropStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: 50
    };

    // The modal "window"
    const modalStyle = {
      backgroundColor: '#fff',
      borderRadius: 5,
      maxWidth: 1000,
      minHeight: 700,
      margin: '0 auto',
      marginTop:'35px',
      padding: 30
    };


    return (
      <div style={backdropStyle}>
        <div style={modalStyle}>
              <button className="btn btn-info waves-effect waves-light m-r-10" style={{float:"right"}} onClick={this.props.onClose}>
                X
              </button>
          <div>
            <form action="/majors" onSubmit={this.editMajorFunc}>
              <div className="form-group">
                <label>Название специальности</label>
                <input type="text" className="form-control" placeholder={this.props.major.major_name}
                name="major_name"
                onChange={this.changeMajor}
                value={this.state.editedMajor.major_name} />
                <span className="bar"></span>
              </div>
              <div className="form-group">
                <label>Код специальности</label>
                <input type="text" className="form-control" placeholder={this.props.major.major_code}
                name="major_code"
                onChange={this.changeMajor}
                value={this.state.editedMajor.major_code} />
                <span className="bar"></span>
              </div>
              <div className="form-group">
                <label>Кафедра</label>
                  <select className="form-control" name="major_department" value={this.state.editedMajor.major_department} onChange={this.changeMajor}>
                    <option value=''>Выберите кафедру</option>
                    {this.state.departments.map((department, f) =>
                      <option key={f} value={department._id}>{department.department_name}</option>
                    )}
                  </select>
                <span className="bar"></span>
              </div>
              <div className="form-group">
                <label>Наименование групп специальностей</label>
                <select className="form-control" name="major_group" value={this.state.editedMajor.major_group} onChange={this.changeMajor}>
                  <option value="">Наименование групп специальностей</option>
                  <option value="Образование">Образование</option>
                  <option value="Гуманитарные науки">Гуманитарные науки</option>
                  <option value="Право">Право</option>
                  <option value="Искусство">Искусство</option>
                  <option value="Социальные науки, экономика и бизнес">Социальные науки, экономика и бизнес</option>
                  <option value="Естественные науки">Естественные науки</option>
                  <option value="Технические науки и технологии">Технические науки и технологии</option>
                  <option value="Сельскохозяйственные науки">Сельскохозяйственные науки</option>
                  <option value="Услуги">Услуги</option>
                  <option value="Военное дело и безопасность">Военное дело и безопасность</option>
                  <option value="Здравоохранение и социальное обеспечение (медицина)">Здравоохранение и социальное обеспечение (медицина)</option>
                </select>
                <span className="bar"></span>
              </div>
              <button type="submit" className="btn btn-info waves-effect waves-light m-r-10">
                Сохранить изменения
              </button>
              <button className="btn btn-info waves-effect waves-light m-r-10" onClick={this.deleteMajor}>
                Удалить специальность
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminEditMajorModal;