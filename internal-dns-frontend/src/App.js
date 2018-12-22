import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import TitleBar from "./TitleBar";
import MainScreen from "./MainScreen";
import styled from "styled-components";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

const { ipcRenderer } = window.require("electron");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      loginFormOpen: this.loggedIn ? false : true,
      showWrongCredentialsInfo: false,
      username: "",
      password: "",
      loading: true,
      showHelpDialogue: false
    };
  }

  componentWillMount = () => {
    ipcRenderer.on("contact", () => this.setState({ showHelpDialogue: true }));
    this.setState({ loading: true });
  };

  componentDidMount = () => {
    this.setState({ loading: false });
  };

  handleUsernameChange = event => {
    this.setState({
      username: event.target.value,
      showWrongCredentialsInfo: false
    });
  };

  handlePasswordChange = event => {
    this.setState({
      password: event.target.value,
      showWrongCredentialsInfo: false
    });
  };

  closeLoginForm = () => {
    this.setState({ loginFormOpen: false });
  };

  //Clientside auth - temporary
  login = () => {
    if (
      this.state.username == "someguy" &&
      this.state.password == "Wh@ts the p@ssw0rd, eh?"
    ) {
      this.setState({ loggedIn: true });
      ipcRenderer.send("activate-menu");
    } else {
      this.setState({ showWrongCredentialsInfo: true });
    }
  };

  closeHelpDialogue = () => {
    this.setState({ showHelpDialogue: false });
  };

  exit = () => {
    ipcRenderer.send("close-app");
  };

  render() {
    return (
      <div className="App">
        {this.state.loading && <CircularProgress />}
        {this.state.showHelpDialogue && (
          <Dialog
            open={this.state.showHelpDialogue}
            onClose={this.closeHelpDialogue}
          >
            <DialogTitle>Contact Info</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <p>If you need help please contact IT </p>
                <p>Email: someguy@somecompany.com</p>
                <p>Number: 123-456-7890</p>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeHelpDialogue} color="primary">
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        )}
        {!this.state.loggedIn && (
          <Dialog
            open={this.state.loginFormOpen}
            onClose={this.closeLoginForm}
            disableBackdropClick={true}
          >
            <DialogTitle>Login to Internal DNS</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <p>Enter your username and password</p>
                {this.state.showWrongCredentialsInfo && (
                  <span color="red">Wrong username or password!</span>
                )}
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="username"
                label={`Username`}
                type="text"
                fullWidth
                onChange={event => this.handleUsernameChange(event)}
                onKeyPress={event => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    this.login();
                  }
                }}
              />
              <TextField
                margin="dense"
                id="password"
                label={`Password`}
                type="password"
                fullWidth
                onChange={event => this.handlePasswordChange(event)}
                onKeyPress={event => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    this.login();
                  }
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.login()} color="primary">
                Login
              </Button>
              <Button onClick={() => this.exit()} color="primary">
                Exit
              </Button>
            </DialogActions>
          </Dialog>
        )}
        {this.state.loggedIn && <MainScreen />}
      </div>
    );
  }
}

export default App;
