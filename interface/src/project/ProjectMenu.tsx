import React, { Component } from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';

import {List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import SettingsRemoteIcon from '@material-ui/icons/SettingsRemote';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import { PROJECT_PATH } from '../api';

class ProjectMenu extends Component<RouteComponentProps> {

  render() {
    const path = this.props.match.url;
    return (
      <List>
        <ListItem to={`/${PROJECT_PATH}/monitor/`} selected={path.startsWith(`/${PROJECT_PATH}/monitor/`)} button component={Link}>
          <ListItemIcon>
            <SettingsRemoteIcon />
          </ListItemIcon>
          <ListItemText primary="Switch Settings" />
        </ListItem>
        <ListItem to={`/temperature/`} selected={path.startsWith(`/temperature/`)} button component={Link}>
          <ListItemIcon>
            <ShowChartIcon />
          </ListItemIcon>
          <ListItemText primary="Temperature Settings" />
        </ListItem>
      </List>
    )
  }

}

export default withRouter(ProjectMenu);
