import React from 'react';
import { Col, Row } from 'react-bootstrap';

const WelcomeScreen = ({ match }) => {
  const name = match.params.name;

  return (
    <section className="welcome-screen">
      <Row>
        <Col md={8} className="text-center">
          <h1>Saludos {name}</h1>
          <p className="lead">
            Confirma tu cuenta de email haciendo click en el link que te hemos
            enviado.
          </p>
        </Col>
      </Row>
    </section>
  );
};

export default WelcomeScreen;
