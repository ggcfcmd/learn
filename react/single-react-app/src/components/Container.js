import React from "react";

function FancyBorder(props) {
  return <div>{props.children}</div>;
}

function Dialog(props) {
  return (
    <FancyBorder>
      <h1>{props.title}</h1>
      <p>{props.message}</p>
      {props.children}
    </FancyBorder>
  );
}

// function WelcomeDialog() {
//   return (
//     <Dialog title="Welcome" message="Thanks you for visiting our spacecraft!" />
//   );
// }

class SignUpDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { login: "" };
  }

  handleLoginChange = (e) => {
    this.setState({ login: e.target.value });
  };

  handleSignUp = () => {
    alert(`Welcome aboard, ${this.state.login}!`);
  };

  render() {
    return (
      <Dialog
        title="Mars Exploration Program"
        message="How should we refer to you?"
      >
        <input value={this.state.login} onChange={this.handleLoginChange} />
        <button onClick={this.handleSignUp}>Sign Me Up!</button>
      </Dialog>
    );
  }
}

export default SignUpDialog;
