import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


const LoginForm = ({
  onSubmit,
  onChange,
  errors,
  successMessage,
  user
}) => (
  <div className="greatMain">


    <h2 className="h2login">Добро пожаловать в Trello!</h2>
    <form className="badMain" action="/" onSubmit={onSubmit}>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <div className="field-line">
        <TextField
          floatingLabelText="Почта"
          name="email"
          errorText={errors.email}
          onChange={onChange}
          value={user.email}
          className="TextField"
        />
      </div>

      <div className="field-line">
        <TextField
          floatingLabelText="Пароль"
          type="password"
          name="password"
          onChange={onChange}
          errorText={errors.password}
          value={user.password}
        />
      </div>

      <div className="button-line">
        <button className="btn info forForm" style={{padding: "10px 35px"}} type="submit">Войти</button>
      </div>

     
    </form>
  </div>
);

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  successMessage: PropTypes.string.isRequired, 
  user: PropTypes.object.isRequired
};

export default LoginForm;
