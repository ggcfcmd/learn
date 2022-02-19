import React, { useState, useEffect } from 'react';
import Context from './Context';
import { connect } from 'react-redux';
// import actions from './actions';
import { bindActionCreators } from 'redux';

function App({ count, onAdd, remove }) {
  const handleAdd = () => {
    onAdd(2);
  };
  return (
    <div>
      Redux<button onClick={handleAdd}>++{count}</button>
      remove<button onClick={remove}>remove</button>
      Context: <Context />
    </div>
  );
}

const mapStateToProps = (state) => ({
  count: state.count,
});

function add(payload) {
  return { type: 'add', payload };
}

function remove(payload) {
  return (dispatch, getState) => {
    dispatch({ type: 'LOADING' });
    fetch(payload)
      .then((data) => {
        dispatch({ type: 'LOADED' });
        dispatch({ type: 'DECRMENT', payload: data });
      })
      .catch((err) => {
        dispatch({ type: 'ERROR', payload: err });
      });
  };
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({ add, remove }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
