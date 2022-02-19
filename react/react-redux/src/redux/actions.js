function onDecrement(payload) {
  return { type: 'DECREMENT', payload };
}

function onAdd(payload) {
  return { type: 'ADD', payload };
}

export default { onDecrement, onAdd };
