import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../constants/apiConstants';

const WelcomeScreen = ({ match, history }) => {
  const token = match.params.token;

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const confirmHandler = async () => {
    try {
      await axios.put(`${baseUrl}/users/confirm`, { token });

      setSuccess(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      history.push('/login');
    }

    confirmHandler();
  }, [history, token, confirmHandler]);

  return (
    <section className="welcome-screen">
      <Row>
        <Col md={8} className="text-center">
          {loading ? (
            <Loader />
          ) : !loading && success ? (
            <>
              <h1>Cuenta Confirmada</h1>
              <p className="lead">
                Su cuenta ha sido confirmada exitosamente. Puede iniciar sesión.
              </p>
              <Link to="/login" className="btn btn-primary">
                Iniciar Sesión
              </Link>
            </>
          ) : (
            <>
              <h1>Error</h1>
              <p className="text-danger">
                Ha ocurrido un error. Quizas su link ya ha expirado o ho quizas
                ha habido un error en el sistema. Puede vuelver a solicitar otro
                email de confirmación en nuestra página de registro.
              </p>
              <Link to="/register" className="btn btn-primary">
                Volver a Página de RegistrorofileScre
                
              </Link>
            </>
          )}
        </Col>
      </Row>
    </section>
  );
};

export default WelcomeScreen;
