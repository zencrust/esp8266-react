import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { PROJECT_PATH } from '../constants/Env';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SettingsRemoteIcon from '@material-ui/icons/SettingsRemote';

class ProjectMenu extends Component {

  render() {
    const path = this.props.match.url;
    return (
      <List>
        <ListItem to={`/${PROJECT_PATH}/monitor/`} selected={path.startsWith(`/${PROJECT_PATH}/monitor/`)} button component={Link}>
          <ListItemIcon>
            <SettingsRemoteIcon />
          </ListItemIcon>
          <ListItemText primary="Switch Monitor Settings" />
        </ListItem>
      </List>
    )
  }

}

export default withRouter(ProjectMenu);
