import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { classicRegister } from '../actions/userActions';
import axios from 'axios';
import baseUrl from '../constants/apiConstants';

const RegisterScreen = ({ location, history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const userLogin = useSelector(state => state.userLogin);
  const { isAuth } = userLogin;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (isAuth) {
      history.push(redirect);
    }
  }, [history, isAuth, redirect]);

  const submitHandler = async e => {
    e.preventDefault();
    setLoading(true);
    if (password !== confirmPassword) {
      setMessage('Contraseñas no son iguales');
    } else {
      const { success, error } = await classicRegister(name, email, password);

      if (!success) {
        setMessage(error);
        setLoading(false);
        return;
      }

      history.push(`/welcome/${name}`);
    }
  };

  const emailConfirmHandler = async e => {
    e.preventDefault();
    await axios.put(`${baseUrl}/resend_code`, { email });
    setEmail('');
    handleClose();
  };

  return (
    <FormContainer>
      <h1>Crear Cuenta</h1>
      {message && <Message variant="danger">{message}</Message>}

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name">
          <Form.Label>Nombre completo</Form.Label>
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
              to={redirect ? `/login?redirect=${redirect}` : '/login'}
            >
              Iniciar Sesión
            </Link>
            <button onClick={handleShow} type="button" className="btn btn-link">
              Enviar Email de Confirmación
            </button>
          </div>
        </Col>
      </Row>

      <Modal
        backdrop="static"
        keyboard={false}
        show={showModal}
        onHide={handleClose}
        centered
        aria-labelledby="Modal activar email"
      >
        <Modal.Header closeButton>
          <Modal.Title>Enviar Email de Confirmación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={emailConfirmHandler}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary">
              Enviar Email
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </FormContainer>
  );
};

export default RegisterScreen;
