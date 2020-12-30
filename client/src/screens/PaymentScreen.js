import React, { useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../actions/cartActions';

const PaymentScreen = ({ history }) => {
  const cart = useSelector(state => state.cart);
  const { shippingAddress } = cart;

  if (!shippingAddress.address) {
    history.push('/shipping');
  }

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const dispatch = useDispatch();

  const submitHandler = e => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Método de Pago</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Seleccione Método</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              label="Tarjeta de Credito"
              id="stripe"
              name="paymentMethod"
              value="Stripe"
              checked
              onChange={e => setPaymentMethod(e.target.value)}
            ></Form.Check>
            {/* <Form.Check
              type='radio'
              label='ATH Móvile'
              id='athMovil'
              name='paymentMethod'
              value='athMovil'
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check> */}
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary">
          Continuar
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
