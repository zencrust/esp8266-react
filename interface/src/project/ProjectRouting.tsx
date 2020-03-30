import React, { Component } from 'react';
import { Redirect, Switch } from 'react-router';

import SwitchMonitorProject from './SwitchMonitorProject';
import { PROJECT_PATH } from '../api';
import { AuthenticatedRoute } from '../authentication';

class ProjectRouting extends Component {

  render() {
    return (
      <Switch>
        {
          /*
          * Add your project page routing below.
          */
        }
        <AuthenticatedRoute exact path={`/${PROJECT_PATH}/monitor/*`} component={SwitchMonitorProject} />

        {
          /*
          * The redirect below caters for the default project route and redirecting invalid paths.
          * The "to" property must match one of the routes above for this to work correctly.
          */
        }
        <Redirect to={`/${PROJECT_PATH}/monitor/`} />
      </Switch>
    )
  }

}

export default ProjectRouting;
