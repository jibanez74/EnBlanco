import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { login } from '../actions/userActions';
import baseUrl from '../constants/apiConstants';
import axios from 'axios';

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const dispatch = useDispatch();

  const userLogin = useSelector(state => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  const submitHandler = e => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  const forgotPasswordHandler = async e => {
    e.preventDefault();
    try {
      await axios.put(`${baseUrl}/users/forgot_password`, { email });
    } catch (error) {
      setMessage(error.message);
    }
    setEmail('');
    handleClose();
  };

  return (
    <>
      <FormContainer>
        <h1>Iniciar Sesión</h1>
        {error && <Message variant="danger">{error}</Message>}
        {message && <Message variant="danger">{message}</Message>}

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          {loading ? (
            <Loader />
          ) : (
            <Button type="submit" variant="primary">
              Continuar
            </Button>
          )}
        </Form>

        <Row className="py-3">
          <Col>
            <div className="btn-group">
              <Link
                className="btn btn-link"
                to={redirect ? `/register?redirect=${redirect}` : '/register'}
              >
                Crear Cuenta{' '}
              </Link>
              <button
                type="button"
                onClick={handleShow}
                className="btn btn-link"
              >
                Olvidé mi Contraseña
              </button>
            </div>
          </Col>
        </Row>
      </FormContainer>

      <Modal
        backdrop="static"
        keyboard={false}
        show={showModal}
        onHide={handleClose}
        centered
        aria-labelledby="Modal para recuperar contraseña"
      >
        <Modal.Header closeButton>
          <Modal.Title>Recuperar Contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={forgotPasswordHandler}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary">
              Continuar
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <p>
            Entre su email, oprima continuar y le enviaremos un email con
            instrucciones para recuperar su contraseña.
          </p>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LoginScreen;
