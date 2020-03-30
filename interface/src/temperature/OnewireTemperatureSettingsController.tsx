import React, { Component } from 'react';

import {restController, RestControllerProps, RestFormLoader, SectionContent } from '../components';
import { ONEWIRE_TEMP_SETTINGS_ENDPOINT } from '../api';

import OnewireTemperatureSettingsForm from './OnewireTemperatureSettingsForm';
import { OnewireTemperatureSettings } from './types';

type NTPSettingsControllerProps = RestControllerProps<OnewireTemperatureSettings>;

class OnewireTemperatureSettingsController extends Component<NTPSettingsControllerProps> {

  componentDidMount() {
    this.props.loadData();
  }

  render() {
    return (
      <SectionContent title="Temperaure Settings" titleGutter>
        <RestFormLoader
          {...this.props}
          render={formProps => <OnewireTemperatureSettingsForm {...formProps} />}
        />
      </SectionContent>
    )
  }

}

export default restController(ONEWIRE_TEMP_SETTINGS_ENDPOINT, OnewireTemperatureSettingsController);
