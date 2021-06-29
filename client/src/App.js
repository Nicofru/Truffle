import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, value: 0 };

  componentDidMount = async () => {
    try {
      // Get web3 instance.
      const web3 = await getWeb3();

      // Get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      instance.events.NumberChanged().on('data', (event) => this.handleEvent(event)).on('error', console.error);
      
      // Set web3, accounts, and contract to the state
      this.setState({ web3, accounts, contract: instance });
      this.runInit();
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };

  runInit = async () => {
    const { contract } = this.state;

    const response = await contract.methods.get().call();
    this.setState({ storageValue: response });
  };

  handleEvent = async (event) => {
    this.setState({storageValue: event.returnValues[0]});
  }
  
  handleChange = async (event) => {
    this.setState({value: event.target.value});
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { accounts, contract, value } = this.state;
    await contract.methods.set(this.state.value).send({ from: accounts[0] });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <form onSubmit={this.handleSubmit}>
          <label>
            Number:
            <input type="number" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;
