import axios from 'axios';
import { CART_CLEAR_ITEMS } from '../constants/cartConstants';
import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_REQUEST,
  ORDER_PAY_FAIL,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_REQUEST,
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_MY_FAIL,
  ORDER_LIST_FAIL,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_REQUEST,
  ORDER_DELIVER_FAIL,
  ORDER_DELIVER_SUCCESS,
  ORDER_DELIVER_REQUEST,
} from '../constants/orderConstants';
import { logout } from './userActions';
import baseUrl from '../constants/apiConstants';

// create a new order
export const createOrder = order => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_CREATE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(
      `${baseUrl}/orders/create`,
      order,
      config
    );

    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data,
    });
    dispatch({
      type: CART_CLEAR_ITEMS,
      payload: data,
    });
    localStorage.removeItem('cartItems');
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === 'Acceso Denegado') {
      dispatch(logout());
    }
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload: message,
    });
  }
};

// request an order's info by there mongo id
export const getOrderDetails = id => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_DETAILS_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`${baseUrl}/orders/${id}`, config);

    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === 'Acceso Denegado') {
      dispatch(logout());
    }
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: message,
    });
  }
};

// allows an admin to mark an order as paid
export const togglePayStatus = order => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_PAY_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.put(`${baseUrl}/orders/paid/${order._id}`, {}, config);

    dispatch({
      type: ORDER_PAY_SUCCESS,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === 'Acceso Denegado') {
      dispatch(logout());
    }
    dispatch({
      type: ORDER_PAY_FAIL,
      payload: message,
    });
  }
};

// change order delivered status
export const deliverOrder = order => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_DELIVER_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.put(`${baseUrl}/orders/delivered/${order._id}`, {}, config);

    dispatch({
      type: ORDER_DELIVER_SUCCESS,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === 'Acceso Denegado') {
      dispatch(logout());
    }
    dispatch({
      type: ORDER_DELIVER_FAIL,
      payload: message,
    });
  }
};

// liste orders for a user
export const listMyOrders = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_LIST_MY_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`${baseUrl}/orders/my_orders`, config);

    dispatch({
      type: ORDER_LIST_MY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    if (message === 'Acceso Denegado') {
      dispatch(logout());
    }
    dispatch({
      type: ORDER_LIST_MY_FAIL,
      payload: message,
    });
  }
};

// admin action to liste available orders
export const listOrders = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_LIST_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`${baseUrl}/orders/all`, config);

    dispatch({
      type: ORDER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === 'Acceso Denegado') {
      dispatch(logout());
    }
    dispatch({
      type: ORDER_LIST_FAIL,
      payload: message,
    });
  }
};

// order paid with stripe
export const paidWithStripe = (token, order) => async (dispatch, getState) => {
  alert('starting paidWithStripe func');

  try {
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.put(`${baseUrl}/orders/stripe`, { token, order }, config);

    dispatch({
      type: ORDER_PAY_SUCCESS,
    });
  } catch (error) {
    console.error(error);

    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === 'Acceso Denegado') {
      dispatch(logout());
    }

    dispatch({
      type: ORDER_PAY_FAIL,
      payload: message,
    });
  }
};
