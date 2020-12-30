import React, { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { STRIPE_KEY } from '../constants/orderConstants';
import { Button } from 'react-bootstrap';
import { paidWithStripe } from '../actions/orderActions';
import { useDispatch } from 'react-redux';

const StripeWrapper = ({ order }) => {
  let [token, setToken] = useState(null);
  const dispatch = useDispatch();

  const cents = Math.round(100 * parseFloat(order.totalPrice));

  useEffect(() => {
    if (token) {
      dispatch(paidWithStripe(token, order));
    }
  }, [token, dispatch, order]);

  return (
    <StripeCheckout
      name="En Blanco"
      description="Pagos de prueba"
      amount={cents}
      token={token => setToken(token)}
      stripeKey={STRIPE_KEY}
    >
      <Button className="btn-block" type="button" variant="warning">
        Pagar Orden
      </Button>
    </StripeCheckout>
  );
};

export default StripeWrapper;
