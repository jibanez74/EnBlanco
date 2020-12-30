import axios from 'axios';
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
} from '../constants/cartConstants';
import baseUrl from '../constants/apiConstants';

// adds an item to the cart
export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`${baseUrl}/products/${id}`);

  // console.log(data.success);

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data.product._id,
      name: data.product.name,
      image: data.product.image,
      price: data.product.price,
      countInStock: data.product.countInStock,
      qty,
    },
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

// will remove an item from cart
export const removeFromCart = id => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

// save the shipping address in local storage
export const saveShippingAddress = data => dispatch => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });

  localStorage.setItem('shippingAddress', JSON.stringify(data));
};

// save the current form of payment in local storage
export const savePaymentMethod = data => dispatch => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  });

  localStorage.setItem('paymentMethod', JSON.stringify(data));
};
