import React, { Component } from 'react';

import { restController, RestControllerProps, RestFormLoader, SectionContent } from '../components';
import { ONEWIRE_TEMP_STATUS_ENDPOINT } from '../api';

import OnewireTemperatureStatusForm from './OnewireTemperatureStatusForm';
import { OnewireTemperatureStatus } from './types';

type OnewireTemperatureStatusControllerStatusProps = RestControllerProps<OnewireTemperatureStatus>;

class OnewireTemperatureStatusController extends Component<OnewireTemperatureStatusControllerStatusProps> {

  componentDidMount() {
    this.props.loadData();
  }

  render() {
    return (
      <SectionContent title="Temperature Status">
        <RestFormLoader
          {...this.props}
          render={formProps => <OnewireTemperatureStatusForm {...formProps} />}
        />
      </SectionContent>
    );
  }

}

export default restController(ONEWIRE_TEMP_STATUS_ENDPOINT, OnewireTemperatureStatusController);
