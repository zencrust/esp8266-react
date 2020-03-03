import React, { Component } from 'react';

import {restController, RestControllerProps, RestFormLoader, SectionContent } from '../components';
import { MQTT_SETTINGS_ENDPOINT } from '../api';
import { MqttSettings } from './types';
import MqttSettingsForm from './MqttSettingsForm';

type MqttStttingsProps = RestControllerProps<MqttSettings>;

class MqttSettingsController extends Component<MqttStttingsProps> {

  componentDidMount() {
    this.props.loadData();
  }

  render() {
    return (
      <SectionContent title="MQTT Settings">
        <RestFormLoader
          {...this.props}
          render={formProps => <MqttSettingsForm {...formProps} />}
        />
      </SectionContent>
    );
  }

}

export default restController(MQTT_SETTINGS_ENDPOINT, MqttSettingsController);