import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import axios from 'axios';
import baseUrl from '../constants/apiConstants';
import { Form, Button } from 'react-bootstrap';
import Message from '../components/Message';
import { logout } from '../actions/userActions';
import { Link } from 'react-router-dom';

const ResetPasswordScreen = ({ match, history }) => {
  const token = match.params.token;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo, isAuth } = userLogin;

  useEffect(() => {
    if ((userInfo && isAuth) || !token) {
      dispatch(logout());
      history.push('/login');
    }
  }, [dispatch, isAuth, userInfo, history, token]);

  const submitHandler = async e => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Contraseñas no son iguales');
    } else {
      setLoading(true);
      setMessage('');

      try {
        await axios.put(`${baseUrl}/users/reset_password`, {
          token,
          password,
        });

        setMessage('Su contraseña ha sido cambiada');
        setSuccess(true);
        setLoading(false);
      } catch (error) {
        console.error(error.message);

        setMessage(error.response.data.message);
      }
    }
  };

  return (
    <FormContainer>
      <h1 className="text-center">Cambiar Contraseña</h1>
      {message && <Message variant="danger">{message}</Message>}
      {loading ? (
        <Loader />
      ) : !loading && !success ? (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="password">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirma tu contraseña</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary">
            Cambiar
          </Button>
        </Form>
      ) : (
        <Link to="/login" className="btn btn-link">
          Iniciar Sesión
        </Link>
      )}
    </FormContainer>
  );
};

export default ResetPasswordScreen;
