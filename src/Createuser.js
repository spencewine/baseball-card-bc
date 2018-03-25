import React, { Component } from 'react';

export default class Createuser extends Component {
  constructor(props) {
    super(props)
    this.state = { userName: "" }
    this.handleChange = this.handleChange.bind(this);
    this.createUser = this.createUser.bind(this);
  }

  createUser() {
    const name = this.state.userName;
    const cards = this.props.generateStarterPack();
    this.props.addBlockToChain({
      type: 'createUser',
      name,
      cards
    });
    this.setState({ userName: "" });
  }

  handleChange(e) {
    this.setState({ userName: e.target.value });
  }

  render() {
    return (
      <div>
        <h1>Create a new user</h1>
        <input type="text" value={this.state.userName} onChange={this.handleChange} />
        <button onClick={this.createUser}>Create</button>
      </div>
    )
  }
}
