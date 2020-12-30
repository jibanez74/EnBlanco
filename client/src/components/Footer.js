import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const now = new Date();

  return (
    <Container>
      <Row>
        <Col className="text-center py-3">
          Copyright &copy; En Blanco LLC {now.getFullYear()}{' '}
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;
