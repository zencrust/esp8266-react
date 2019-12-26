import React, { Component } from 'react';

import { FIRMWARE_UPDATE_ENDPOINT } from '../constants/Endpoints';
import { restComponent } from '../components/RestComponent';
import SectionContent from '../components/SectionContent';
import Button from '@material-ui/core/Button';
import UpdateIcon from '@material-ui/icons/Update';
import { withSnackbar } from 'notistack';
import { redirectingAuthorizedFetch } from '../authentication/Authentication';
import axios from 'axios';

class FirmwareUpgrade extends Component {

  constructor(props) {
    super(props);
      this.state = {
        selectedFile: null
      }
   
  }

  componentDidMount() {
  }


  handleCapture = ({ target }) => {
    var file1 = target.files[0];
    // var file2 = target.files[1];

    if(file1){
      const data = new FormData();
      data.append('file1', file1);
      // data.append('file2', file2);
      redirectingAuthorizedFetch(FIRMWARE_UPDATE_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(this.state.data),
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          if (response.status === 200) {
            return response.json();
          }
          throw Error("Invalid status code: " + response.status);
        })
        .then(json => {
          this.props.enqueueSnackbar("Update Successful.", {
            variant: 'success',
          });
          this.setState({ data: json, fetched: true });
        }).catch(error => {
          const errorMessage = error.message || "Unknown error";
          this.props.enqueueSnackbar(errorMessage, {
            variant: 'error',
          });
        });
    }

  };

  render() {
    return (
      <SectionContent title="Upgrade Firmware">
          <br />
          <Button
            variant="contained"
            startIcon={<UpdateIcon />}
            onClick={this.onUploadConfirmed}
            variant="contained" color="primary"
            component="label">
            Upload Firmware
            <input
              type="file"
              onChange={this.handleCapture}
              multiple
              style={{ display: "none" }}
            />
          </Button>
      </SectionContent>
    )
  }

}

export default withSnackbar(FirmwareUpgrade);
