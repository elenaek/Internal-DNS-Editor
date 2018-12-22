import React, { Component } from "react";
import styled from "styled-components";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/AddCircle";
import EditIcon from "@material-ui/icons/Subject";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
const { ipcRenderer } = window.require("electron");

export default class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      records: [],
      editFormOpen: false,
      addFormOpen: false,
      selectedRecord: {},
      aliasToUpdateTo: "",
      subdomainToCreate: "",
      formValidationError: false
    };
  }

  cellStyle = {
    whiteSpace: "normal",
    wordWrap: "break-word"
  };

  componentWillMount = () => {
    this.getUpdatedRecords();
    //console.log(process.env.REACT_APP_RECORD_UPDATE);
  };

  componentDidMount = () => {
    ipcRenderer.on("add-record", () => this.openAddForm());
    ipcRenderer.on("refresh-records", () => this.getUpdatedRecords());
  };

  getUpdatedRecords = () => {
    fetch(process.env.REACT_APP_RECORD_INDEX, { method: "GET" })
      .then(response => response.json())
      .then(parsedRes => this.setState({ records: parsedRes }))
      .then(
        this.setState({
          aliasToUpdateTo: "",
          subdomainToCreate: "",
          editFormOpen: false,
          addFormOpen: false,
          formValidationError: false
        })
      );
  };

  openEditForm = (subdomain, alias) => {
    this.setState({
      editFormOpen: true,
      selectedRecord: {
        subdomain_name: subdomain,
        alias_name: alias
      }
    });
  };

  closeEditForm = () => {
    this.setState({
      editFormOpen: false
    });
    setTimeout(
      this.setState({ selectedRecord: {}, aliasToUpdateTo: "" }),
      2000
    );
  };

  openAddForm = () => {
    this.setState({ addFormOpen: true });
  };

  closeAddForm = () => {
    this.setState({ addFormOpen: false, aliasToUpdateTo: "" });
  };

  applyEdit = async subdomain => {
    await fetch(process.env.REACT_APP_RECORD_UPDATE, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subdomain_name: subdomain,
        alias_name: this.state.aliasToUpdateTo
      })
    });
    this.getUpdatedRecords();
  };

  createRecord = async (subdomain, alias) => {
    if (subdomain && alias) {
      await fetch(process.env.REACT_APP_RECORD_CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subdomain_name: subdomain, alias_name: alias })
      });
      this.getUpdatedRecords();
    } else {
      this.setState({ formValidationError: true });
    }
  };

  deleteRecord = async (subdomain, alias) => {
    await fetch(process.env.REACT_APP_RECORD_DELETE, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subdomain_name: subdomain, alias_name: alias })
    });
    this.getUpdatedRecords();
  };

  handleFormAliasChange = event => {
    this.setState({ aliasToUpdateTo: event.target.value });
  };

  handleFormSubdomainChange = event => {
    this.setState({ subdomainToCreate: event.target.value });
  };

  render() {
    let { records } = this.state;
    return (
      <MainContainer>
        <TableContainer>
          <Dialog open={this.state.editFormOpen} onClose={this.closeEditForm}>
            <DialogTitle>
              Edit {this.state.selectedRecord.subdomain_name}
              .internalcompanydomain.com record
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                You are editting the alias record of{" "}
                {this.state.selectedRecord.subdomain_name}. Please enter the new
                domain name to point to.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="alias_name"
                label={`${this.state.selectedRecord.alias_name} (current)`}
                type="text"
                fullWidth
                onChange={event => this.handleFormAliasChange(event)}
                onKeyPress={event => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    this.applyEdit(
                      this.state.selectedRecord.subdomain_name,
                      this.state.selectedRecord.alias_name
                    );
                  }
                  if (event.keyCode == 27) {
                    this.getUpdatedRecords();
                  }
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() =>
                  this.applyEdit(
                    this.state.selectedRecord.subdomain_name,
                    this.state.selectedRecord.alias_name
                  )
                }
                color="primary"
              >
                Apply
              </Button>
              <Button
                onClick={() =>
                  this.deleteRecord(
                    this.state.selectedRecord.subdomain_name,
                    this.state.selectedRecord.alias_name
                  )
                }
                color="primary"
              >
                Delete
              </Button>
              <Button onClick={() => this.getUpdatedRecords()} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={this.state.addFormOpen} onClose={this.closeAddForm}>
            <DialogTitle>Add a new CNAME Record</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <p>
                  Please enter a subdomain and the hostname to point it to.{" "}
                </p>
                <p>
                  Example: bear(.internalcompanydomain.com) -> bearreddit.com
                </p>
                {this.state.formValidationError &&
                  "You must fill out all the fields!"}
              </DialogContentText>
              <TextField
                onChange={event => this.handleFormSubdomainChange(event)}
                autoFocus
                margin="dense"
                id="subdomain_name"
                label="Enter a subdomain."
                type="text"
                fullWidth
                title="Subdomain"
                onKeyPress={event => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    this.createRecord(
                      this.state.subdomainToCreate,
                      this.state.aliasToUpdateTo
                    );
                  }
                  if (event.keyCode == 27) {
                    this.getUpdatedRecords();
                  }
                }}
              />
              <TextField
                onChange={event => this.handleFormAliasChange(event)}
                margin="dense"
                id="alias_name"
                label="Enter a hostname to point it to"
                type="text"
                fullWidth
                title="Alias Name"
                onKeyPress={event => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    this.createRecord(
                      this.state.subdomainToCreate,
                      this.state.aliasToUpdateTo
                    );
                  }
                  if (event.keyCode == 27) {
                    this.getUpdatedRecords();
                  }
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() =>
                  this.createRecord(
                    this.state.subdomainToCreate,
                    this.state.aliasToUpdateTo
                  )
                }
                color="primary"
              >
                Create
              </Button>
              <Button onClick={() => this.getUpdatedRecords()} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Subdomain</TableCell>
                <TableCell>Alias</TableCell>
              </TableRow>
            </TableHead>
            {records.map(dnsrecord => (
              <TableRow>
                <TableCell>{dnsrecord.subdomain_name}</TableCell>
                <TableCell>{dnsrecord.alias_name}</TableCell>
                <Button
                  onClick={() =>
                    this.openEditForm(
                      dnsrecord.subdomain_name,
                      dnsrecord.alias_name
                    )
                  }
                >
                  <EditIcon />
                </Button>
              </TableRow>
            ))}
          </Table>
        </TableContainer>
        <AddButtonContainer>
          <Button style={{ fontSize: 15 }} onClick={this.openAddForm}>
            <AddIcon />
          </Button>
        </AddButtonContainer>
      </MainContainer>
    );
  }
}

const MainContainer = styled.div`
  text-align: center;
  width: 100%;
  margin: auto;
`;

const TableContainer = styled.div`
  margin: auto;
  font-family: "Roboto", sans-serif;
  text-align: center;
  justify-content: center;
  width: 100%;
`;

const AddButtonContainer = styled.div`
  position: fixed;
  bottom: 7%;
  right: 10px;
  margin: 10px;
`;
