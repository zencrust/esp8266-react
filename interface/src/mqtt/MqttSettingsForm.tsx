import React from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import SaveIcon from '@material-ui/icons/Save';

import { RestFormProps, BlockFormControlLabel, PasswordValidator, FormButton, FormActions } from '../components';
import { isIP, isHostname, or } from '../validators';
import { MqttSettings } from './types';
import { Checkbox } from '@material-ui/core';

type MqttSettingsFormProps = RestFormProps<MqttSettings>;

class MqttSettingsForm extends React.Component<MqttSettingsFormProps> {

  componentDidMount() {
    ValidatorForm.addValidationRule('isIPOrHostname', or(isIP, isHostname));
  }

  render() {
    const { data, handleValueChange, saveData, loadData } = this.props;
    return (
      <ValidatorForm onSubmit={saveData}>
        <BlockFormControlLabel
          control={
            <Checkbox
              checked={data.mqttenabled}
              onChange={handleValueChange('mqttenabled')}
              value="mqttenabled"
            />
          }
          label="Enable Mqtt?"
        />

        <TextValidator
          validators={['required', 'isIPOrHostname']}
          errorMessages={['Server is required', "Not a valid IP address or hostname"]}
          name="mqttserver"
          fullWidth
          variant="outlined"
          label="Server"
          value={data.mqttserver}
          onChange={handleValueChange('mqttserver')}
          margin="normal"
        />
        <TextValidator
          validators={['required', 'isNumber', 'minNumber:10', 'maxNumber:86400']}
          errorMessages={['port is required', 'Port must be a number', 'Must be at least 20', "Must not be more than 9999"]}
          name="mqttport"
          fullWidth
          variant="outlined"
          label="Port Number"
          value={data.mqttport}
          type="number"
          onChange={handleValueChange('mqttport')}
          margin="normal"
        />
        <TextValidator
          validators={[]}
          errorMessages={[]}
          name="mqttuserName"
          fullWidth
          variant="outlined"
          label="User Name"
          value={data.mqttuserName}
          onChange={handleValueChange('mqttuserName')}
          margin="normal"
        />
        <TextValidator
          validators={[]}
          errorMessages={[]}
          name="mqttpassword"
          fullWidth
          variant="outlined"
          label="Password"
          value={data.mqttpassword}
          onChange={handleValueChange('mqttpassword')}
          margin="normal"
        />
        <TextValidator
          validators={['required', 'matchRegexp:^[a-zA-Z0-9_\\.]{1,24}$']}
          errorMessages={['Username is required', "Must be 1-24 characters: alpha numeric, '_' or '.'"]}
          name="mqttapplicationName"
          label="Application Name"
          fullWidth
          variant="outlined"
          value={data.mqttapplicationName}
          onChange={handleValueChange('mqttapplicationName')}
          margin="normal"
        />
        <FormActions>
          <FormButton startIcon={<SaveIcon />} variant="contained" color="primary" type="submit">
            Save
          </FormButton>
          <FormButton variant="contained" color="secondary" onClick={loadData}>
            Reset
          </FormButton>
        </FormActions>
      </ValidatorForm>
    );
  }
}

export default MqttSettingsForm;
