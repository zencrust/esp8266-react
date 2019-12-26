import React, { Component } from 'react';
import { Redirect, Switch } from 'react-router-dom'

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import AuthenticatedRoute from '../authentication/AuthenticatedRoute';
import MenuAppBar from '../components/MenuAppBar';
import MqttSettings from '../containers/MqttSettings';
import MqttStatus from '../containers/MqttStatus';
import { withAuthenticationContext } from '../authentication/Context.js';

class MqttConfiguration extends Component {

  handleTabChange = (event, path) => {
    this.props.history.push(path);
  };

  render() {
    const { authenticationContext } = this.props;
    return (
      <MenuAppBar sectionTitle="MQTT Configuration">
        <Tabs value={this.props.match.url} onChange={this.handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
          <Tab value="/mqtt/status" label="MQTT Status"  />
          <Tab value="/mqtt/settings" label="MQTT Settings" disabled={!authenticationContext.isAdmin()} />
        </Tabs>
        <Switch>
          <AuthenticatedRoute exact={true} path="/mqtt/status" component={MqttStatus} />
          <AuthenticatedRoute exact={true} path="/mqtt/settings" component={MqttSettings} />
          <Redirect to="/mqtt/status" />
        </Switch>
      </MenuAppBar>
    )
  }

}

export default withAuthenticationContext(MqttConfiguration)
