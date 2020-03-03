import React, { Component } from 'react';

import {restController, RestControllerProps, RestFormLoader, SectionContent } from '../components';
import { MQTT_SETTINGS_ENDPOINT } from '../api';
import { MqttSettings } from './types';
import MqttStatusForm from './MqttStatusForm';

type MqttStatusProps = RestControllerProps<MqttSettings>;

class MqttStatusController extends Component<MqttStatusProps> {

  componentDidMount() {
    this.props.loadData();
  }

  render() {
    return (
      <SectionContent title="Mqtt Status">
        <RestFormLoader
          {...this.props}
          render={formProps => <MqttStatusForm {...formProps} />}
        />
      </SectionContent>
    );
  }

}

export default restController(MQTT_SETTINGS_ENDPOINT, MqttStatusController);