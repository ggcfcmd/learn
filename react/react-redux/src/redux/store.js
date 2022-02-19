import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const initialState = { count: 0 };
const reducer = function (state = initialState, action) {
  switch (action.type) {
    case 'ADD': {
      return { count: state.count + action.payload };
    }
    case 'DECREMENT': {
      return { count: state.count - action.payload };
    }
    default:
      return state;
  }
};
const store = createStore(reducer, applyMiddleware(thunk));

// store 内容
// @@observable: ƒ observable()
// dispatch: ƒ dispatch(action)
// getState: ƒ getState()
// replaceReducer: ƒ replaceReducer(nextReducer)
// subscribe: ƒ subscribe(listener)

export default store;

// function createStore() {
//   let state;
//   let listeners = [];

//   const getState = () => {
//     return state;
//   };

//   const dispatch = (action) => {
//     state = reducer(state, action);
//     listeners.forEach((listener) => listener());
//   };

//   const subscribe = (listener) => {
//     if (!listeners.includes(listener)) {
//       listeners.push(listener);
//     }

//     return function unsubscribe() {
//       listeners = listeners.filter((l) => l !== listener);
//     };
//   };
//   // 初始化时默认执行一次不匹配任何type类型的dispatch 返回initialState 以达到初始化state的目的
//   dispatch({ type: '@@redux-init@@' });

//   return { getState, dispatch, subscribe };
// }
