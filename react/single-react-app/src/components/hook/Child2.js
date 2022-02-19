const Child2 = ({ emitClick, count }) => {
  const handleClick = (v) => {
    emitClick(v);
  };

  return (
    <div>
      <p>你已经点击 {count} 次了</p>
      <button onClick={() => handleClick(count + 1)}>点击</button>
    </div>
  );
};
export default Child2;
