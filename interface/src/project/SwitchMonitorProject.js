import React, { Component } from 'react';
import { Redirect, Switch } from 'react-router-dom'

import { PROJECT_PATH } from '../constants/Env';
import MenuAppBar from '../components/MenuAppBar';
import AuthenticatedRoute from '../authentication/AuthenticatedRoute';
import SwitchMonitorController from './SwitchMonitorController';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class SwitchMonitorProject extends Component {

  handleTabChange = (event, path) => {
    this.props.history.push(path);
  };

  render() {
    return (
      <MenuAppBar sectionTitle="Switch Monitor">
        <Tabs value={this.props.match.url} onChange={this.handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
          <Tab value={`/${PROJECT_PATH}/monitor/controller`} label="Controller" />
        </Tabs>
        <Switch>
          <AuthenticatedRoute exact path={`/${PROJECT_PATH}/monitor/controller`} component={SwitchMonitorController} />
          <Redirect to={`/${PROJECT_PATH}/monitor/controller`}  />
        </Switch>
      </MenuAppBar>
    )
  }        

}

export default SwitchMonitorProject;
