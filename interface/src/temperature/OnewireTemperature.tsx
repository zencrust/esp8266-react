import React, { Component } from 'react';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom'
import { PROJECT_PATH } from '../api';

import { Tabs, Tab } from '@material-ui/core';

import { withAuthenticatedContext, AuthenticatedContextProps, AuthenticatedRoute } from '../authentication';
import { MenuAppBar } from '../components';

import OnewireTemperatureStatusController from './OnewireTemperatureStatusController';
import OnewireTemperatureSettingsController from './OnewireTemperatureSettingsController';

type OnewireTemperatureProps = AuthenticatedContextProps & RouteComponentProps;

class OnewireTemperature extends Component<OnewireTemperatureProps> {

  handleTabChange = (event: React.ChangeEvent<{}>, path: string) => {
    this.props.history.push(path);
  };
 
  render() {
    return (
      <MenuAppBar sectionTitle="Temperature">
        <Tabs value={this.props.match.url} onChange={this.handleTabChange} variant="fullWidth">
          <Tab value={`/temperature/status`} label="Temperature Status" />
          <Tab value={`/temperature/settings`} label="Temperature Settings" />
        </Tabs>
        <Switch>
          <AuthenticatedRoute exact path={`/temperature/status`} component={OnewireTemperatureStatusController} />
          <AuthenticatedRoute exact path={`/temperature/settings`} component={OnewireTemperatureSettingsController} />
          <Redirect to={`/temperature/status`} />
        </Switch>
      </MenuAppBar>
    )
  }

}

export default OnewireTemperature
