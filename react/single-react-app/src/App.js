import logo from "./logo.svg";
import "./App.css";
// import Clock from "./components/Clock";
// import StateTest from "./components/StateTest";
// import LifeCycle from "./components/LifeCycle";
// import { Welcome1, Welcome2 } from "./components/CompType";
// import CartSample from "./components/CartSample";
// import NameForm from "./components/NameForm";
// import ReactDOM from "react-dom";
// import Calculator from "./components/temperature/Calculator";
// import Container from "./components/Container";
// import HookTest from "./components/HookTest";
import KForm from "./components/KForm";

function App() {
  return (
    <div id="app" className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <KForm />
        {/* <LifeCycle />
        <NameForm /> */}
        {/* <StateTest count={1} /> */}
        {/* <Welcome1 name="hahaha" />
        <Welcome2 name="xixixi" /> */}
        {/* <Clock /> */}
        {/* <CartSample title="购物车" /> */}
        {/* <HookTest />
        <Container />
        <Calculator />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
        {/* {ReactDOM.render(<input value="hi" />, document.getElementById("root"))}
        {setTimeout(() => {
          ReactDOM.render(
            <input value={null} />,
            document.getElementById("root")
          );
        }, 3000)} */}
      </header>
    </div>
  );
}

export default App;
