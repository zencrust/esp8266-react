import React, { Component, Fragment } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import DNSIcon from '@material-ui/icons/Dns';
import TimerIcon from '@material-ui/icons/Timer';
import UpdateIcon from '@material-ui/icons/Update';
import RefreshIcon from '@material-ui/icons/Refresh';

import * as Highlight from '../constants/Highlight';
import {mqttStatusHighlight, mqttStatus} from '../constants/MqttStatus';
import { MQTT_SETTINGS_ENDPOINT } from '../constants/Endpoints';
import { restComponent } from '../components/RestComponent';
import LoadingNotification from '../components/LoadingNotification';
import SectionContent from '../components/SectionContent';

const styles = theme => ({
  ["mqttStatus_" + Highlight.SUCCESS]: {
    backgroundColor: theme.palette.highlight_success
  },
  ["mqttStatus_" + Highlight.ERROR]: {
    backgroundColor: theme.palette.highlight_error
  },
  ["mqttStatus_" + Highlight.WARN]: {
    backgroundColor: theme.palette.highlight_warn
  },
  button: {
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(2),
  }
});

class MqttStatus extends Component {

  componentDidMount() {
    this.props.loadData();
  }

  createListItems(data, classes) {
    return (
      <Fragment>
        <ListItem >
          <ListItemAvatar>
            <Avatar className={classes["mqttStatus_" + mqttStatusHighlight(data)]}>
              <UpdateIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Status" secondary={mqttStatus(data)} />
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

  renderMQTTStatus(data, classes) {
    return (
      <div>
        <List>
          {this.createListItems(data, classes)}
        </List>
        <Button startIcon={<RefreshIcon />} variant="contained" color="secondary" className={classes.button} onClick={this.props.loadData}>
          Refresh
        </Button>
      </div>
    );
  }
  render() {
    const { data, fetched, errorMessage, loadData, classes } = this.props;
    return (
      <SectionContent title="MQTT Status">
        <LoadingNotification
          onReset={loadData}
          fetched={fetched}
          errorMessage={errorMessage}
          render={
            () => this.renderMQTTStatus(data, classes)
          }
        />
      </SectionContent>
    );
  }
}

export default restComponent(MQTT_SETTINGS_ENDPOINT, withStyles(styles)(MqttStatus));
