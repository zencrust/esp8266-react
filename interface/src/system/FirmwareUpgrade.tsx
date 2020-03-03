import React, { Component } from 'react';

import { FIRMWARE_UPDATE_ENDPOINT } from '../api';
import Button from '@material-ui/core/Button';
import UpdateIcon from '@material-ui/icons/Update';
import {restController, RestControllerProps, RestFormLoader, SectionContent } from '../components';

import { withSnackbar, WithSnackbarProps } from 'notistack';
import { redirectingAuthorizedFetch } from '../authentication/Authentication';
// import axios from 'axios';

interface FirmwareStatus{

}

type FirmwareUpgradeProps = RestControllerProps<FirmwareStatus>;

class FirmwareUpgrade extends Component<FirmwareUpgradeProps> {

  componentDidMount() {
    this.props.loadData();
  }


  handleCapture = (files: FileList | null) => {
    if(files === null) {
      return
    }

    var file1 = files[0];
    // var file2 = target.files[1];

    if(file1){
      const data = new FormData();
      data.append('file1', file1);
      // data.append('file2', file2);
      redirectingAuthorizedFetch(FIRMWARE_UPDATE_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(data),
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
            color="primary"
            component="label">
            Upload Firmware
            <input
              type="file"
              onChange={(e) => this.handleCapture(e.target.files)}
              multiple
              style={{ display: "none" }}
            />
          </Button>
      </SectionContent>
    )
  }

}

export default restController(FIRMWARE_UPDATE_ENDPOINT, FirmwareUpgrade);
