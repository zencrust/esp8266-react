import React, { Component } from 'react';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom'

import { Tabs, Tab } from '@material-ui/core';

import { withAuthenticatedContext, AuthenticatedContextProps, AuthenticatedRoute } from '../authentication';
import { MenuAppBar } from '../components';

import MqttSettingsController from './MqttSettingsController';
import MqttStatusController from './MqttStatusController';

type MqttConfigurationProps = AuthenticatedContextProps & RouteComponentProps;

class MqttConfiguration  extends Component<MqttConfigurationProps> {

  handleTabChange = (event: React.ChangeEvent<{}>, path: string) => {
    this.props.history.push(path);
  };

  render() {
    const { authenticatedContext } = this.props;
    return (
      <MenuAppBar sectionTitle="MQTT Configuration">
        <Tabs value={this.props.match.url} onChange={this.handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
          <Tab value="/mqtt/status" label="MQTT Status"  />
          <Tab value="/mqtt/settings" label="MQTT Settings" disabled={!authenticatedContext.me.admin} />
        </Tabs>
        <Switch>
          <AuthenticatedRoute exact={true} path="/mqtt/status" component={MqttStatusController} />
          <AuthenticatedRoute exact={true} path="/mqtt/settings" component={MqttSettingsController} />
          <Redirect to="/mqtt/status" />
        </Switch>
      </MenuAppBar>
    )
  }
}

export default withAuthenticatedContext(MqttConfiguration);
