import React from 'react';
import { Card, CardTitle } from 'material-ui/Card';



const Config = ({
	user,
	trelloName,
	uploadMyImage,
	uploaded,
	changeImg,
	addTrelloName,
	changeUser
}) => (

  <div className="greatMain">

  	<div className="badPad">
		  	 <div className="fotoDiv">
				   <form className="profileForm" action="/" onSubmit={uploadMyImage}>
				   {(user.myImg.length > 0) ? (
				     <img src={require('../../../public/userImgs/'+user.myImg)} className="userFoto"/>
				   ):(
				     <img src={require('../../../public/img/default.jpg')} className="userFoto"/>
				   )}
						<div>
							<div className="field-line">
								<span className="spanProfile1">{user.name}</span><br/>
								<span className="spanProfile2">{user.email}</span>
								<hr className="poloska" />
							</div>
				      {!uploaded ? (
				       	<label className="btn info forForm" style={{marginTop: '5px'}}>
				          <input style={{display: "none"}} type="file" onChange={changeImg} />
				          Изменить фото
				       </label>
				       ) : (
				     		<div></div>
				       )}
				     </div>
				     {uploaded ? (
				     		<button type="submit" style={{marginTop: '5px'}} className="btn info forForm"> Загрузить </button>
				     	) : (
				     	<div></div>
				     	)}
				   </form>
	       </div>

  	</div>
  </div>
);

export default Config;




/*
<span className="field-line font">Введите trelloName пользователей</span>
 		<form action="/" onSubmit={addTrelloName}>
		  	<div className="field-line">
	        <input type="text" className="form-control font" placeholder="trelloName"
                  name="trelloName"
                  onChange={changeUser}
                  value={trelloName}/>
	        <button type="submit" className="button zapis"> Записать </button>
	    	</div>
   	</form>*/