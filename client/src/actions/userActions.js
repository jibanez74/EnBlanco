import axios from 'axios';
import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_DETAILS_RESET,
  USER_LIST_FAIL,
  USER_LIST_SUCCESS,
  USER_LIST_REQUEST,
  USER_LIST_RESET,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_UPDATE_FAIL,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_REQUEST,
  USER_CONFIRM_REQUEST,
  USER_CONFIRM_SUCCESS,
  USER_CONFIRM_FAIL,
} from '../constants/userConstants';
import { ORDER_LIST_MY_RESET } from '../constants/orderConstants';
import baseUrl from '../constants/apiConstants';

// register a new user
export const classicRegister = async (name, email, password) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const { data } = await axios.post(
      `${baseUrl}/users/register`,
      { name, email, password },
      config
    );

    return Promise.resolve({
      success: data.success,
      error: null,
    });
  } catch (error) {
    console.error(error.message);

    return Promise.resolve({
      success: error.response.data.success,
      error:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// login a user and get a signed jwt
export const login = (email, password) => async dispatch => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      `${baseUrl}/users/login`,
      { email, password },
      config
    );

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// logout user and remove all data from local storage
export const logout = () => dispatch => {
  localStorage.removeItem('userInfo');
  localStorage.removeItem('cartItems');
  localStorage.removeItem('shippingAddress');
  localStorage.removeItem('paymentMethod');
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_DETAILS_RESET });
  dispatch({ type: ORDER_LIST_MY_RESET });
  dispatch({ type: USER_LIST_RESET });
  document.location.href = '/login';
};

// shows an admin all of the info related to a user
export const getUserDetails = id => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DETAILS_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`${baseUrl}/users/me`, config);

    dispatch({
      type: USER_DETAILS_SUCCESS,
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
      type: USER_DETAILS_FAIL,
      payload: message,
    });
  }
};

// allows a user to update there own profile
export const updateUserProfile = user => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_PROFILE_REQUEST,
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

    const { data } = await axios.put(`${baseUrl}/users/update`, user, config);

    if (data.userInfo) {
      dispatch({
        type: USER_UPDATE_PROFILE_SUCCESS,
        payload: data,
      });
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: data,
      });

      localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
    } else {
      dispatch(logout());
    }
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === 'Acceso Denegado') {
      dispatch(logout());
    }
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload: message,
    });
  }
};

// allows an admin to see all available users
export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_LIST_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`${baseUrl}/users/all`, config);

    dispatch({
      type: USER_LIST_SUCCESS,
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
      type: USER_LIST_FAIL,
      payload: message,
    });
  }
};

// shows an admin all of the info related to a user
export const getUserById = id => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DETAILS_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`${baseUrl}/users/${id}`, config);

    dispatch({
      type: USER_DETAILS_SUCCESS,
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
      type: USER_DETAILS_FAIL,
      payload: message,
    });
  }
};

// allows an admin to delete a user
export const deleteUser = id => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DELETE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`${baseUrl}/users/delete/${id}`, config);

    dispatch({ type: USER_DELETE_SUCCESS });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === 'Acceso Denegado') {
      dispatch(logout());
    }
    dispatch({
      type: USER_DELETE_FAIL,
      payload: message,
    });
  }
};

// allows an admin to update a user
export const updateUser = user => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_REQUEST,
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

    const { data } = await axios.put(
      `${baseUrl}/users/${user._id}`,
      user,
      config
    );

    dispatch({ type: USER_UPDATE_SUCCESS });

    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });

    dispatch({ type: USER_DETAILS_RESET });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    if (message === 'Acceso Denegado') {
      dispatch(logout());
    }
    dispatch({
      type: USER_UPDATE_FAIL,
      payload: message,
    });
  }
};

// confirm a user account
export const confirmUser = token => async dispatch => {
  try {
    dispatch({ type: USER_CONFIRM_REQUEST });

    await axios.put(`${baseUrl}/confirm`, { token });

    dispatch({
      type: USER_CONFIRM_SUCCESS,
    });
  } catch (error) {
    console.error(error);

    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch({
      type: USER_CONFIRM_FAIL,
      payload: message,
    });
  }
};
