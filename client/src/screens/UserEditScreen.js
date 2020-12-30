import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { getUserById, updateUser } from '../actions/userActions';
import { USER_UPDATE_RESET } from '../constants/userConstants';

const UserEditScreen = ({ match, history }) => {
  const userId = match.params.id;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);

  const dispatch = useDispatch();

  const userDetails = useSelector(state => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector(state => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      history.push('/admin/userlist');
    } else {
      if (!user.name || user._id !== userId) {
        dispatch(getUserById(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
        setIsEmailConfirmed(user.isEmailConfirmed);
      }
    }
  }, [dispatch, history, userId, user, successUpdate]);

  const submitHandler = e => {
    e.preventDefault();
    dispatch(
      updateUser({ _id: userId, name, email, isAdmin, isEmailConfirmed })
    );
  };

  return (
    <>
      <Link to="/admin/userlist" className="btn btn-light my-3">
        Volver
      </Link>
      <FormContainer>
        <h1>Editar Usuario</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="isadmin">
              <Form.Check
                type="checkbox"
                label="Es Administrador"
                checked={isAdmin}
                onChange={e => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Form.Group controlId="isemailconfirmed">
              <Form.Check
                type="checkbox"
                label="Email Confirmado"
                checked={isEmailConfirmed}
                onChange={e => setIsEmailConfirmed(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button type="submit" variant="primary">
              Actualizar
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
