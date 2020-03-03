import React, { Component, Fragment } from 'react';

import { WithTheme, withTheme } from '@material-ui/core/styles';
import { Avatar, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { List, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';

import DNSIcon from '@material-ui/icons/Dns';
import TimerIcon from '@material-ui/icons/Timer';
import UpdateIcon from '@material-ui/icons/Update';
import RefreshIcon from '@material-ui/icons/Refresh';

import { RestFormProps, FormButton, FormActions, HighlightAvatar } from '../components';
import { mqttStatus, mqttStatusHighlight } from './Constants';
import { MqttSettings } from './types';


type MqttStatusFormProps = RestFormProps<MqttSettings> & WithTheme;

class MqttStatusForm extends Component<MqttStatusFormProps> {

  createListItems() {
    const { data, theme } = this.props;
    return (
        <Fragment>
        <ListItem >
          <ListItemAvatar>
            <HighlightAvatar color={mqttStatusHighlight(data.mqttconnectionState, theme)}>
              <UpdateIcon />
            </HighlightAvatar>
          </ListItemAvatar>
          <ListItemText primary="Status" secondary={mqttStatus(data.mqttconnectionState)}/>
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <DNSIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="MQTT Server" secondary={data.mqttserver} />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <TimerIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Port Number" secondary={data.mqttport} />
        </ListItem>
        <Divider variant="inset" component="li" />
      </Fragment>
    );
  }

  render() {
    return (
      <Fragment>
        <List>
          {this.createListItems()}
        </List>
        <FormActions>
          <FormButton startIcon={<RefreshIcon />} variant="contained" color="secondary" onClick={this.props.loadData}>
            Refresh
          </FormButton>
        </FormActions>
      </Fragment>
    );
  }
}

export default withTheme(MqttStatusForm);
