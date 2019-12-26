import React from 'react';
import PropTypes from 'prop-types';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

import isIP from '../validators/isIP';
import isHostname from '../validators/isHostname';
import or from '../validators/or';
import PasswordValidator from '../components/PasswordValidator';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const styles = theme => ({
  textField: {
    width: "100%"
  },
  button: {
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  switchControl: {
    width: "100%",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(0.5)
  }
});

class MqttSettingsForm extends React.Component {

  componentWillMount() {
    ValidatorForm.addValidationRule('isIPOrHostname', or(isIP, isHostname));
  }

  render() {
    const { classes, mqttSettings, handleValueChange, handleCheckboxChange, onSubmit, onReset } = this.props;
    return (
      <ValidatorForm onSubmit={onSubmit}>
        <FormControlLabel className={classes.switchControl}
          control={
            <Switch
              checked={mqttSettings.mqttenabled}
              onChange={handleCheckboxChange('mqttenabled')}
              value="mqttenabled"
              color="primary"
            />
          }
          label="Enable Mqtt?"
        />

        <TextValidator
          validators={['required', 'isIPOrHostname']}
          errorMessages={['Server is required', "Not a valid IP address or hostname"]}
          name="mqttserver"
          label="Server"
          className={classes.textField}
          value={mqttSettings.mqttserver}
          onChange={handleValueChange('mqttserver')}
          margin="normal"
        />
        <TextValidator
          validators={['required', 'isNumber', 'minNumber:10', 'maxNumber:86400']}
          errorMessages={['port is required', 'Port must be a number', 'Must be at least 20', "Must not be more than 9999"]}
          name="mqttport"
          label="Port Number"
          className={classes.textField}
          value={mqttSettings.mqttport}
          type="number"
          onChange={handleValueChange('mqttport')}
          margin="normal"
        />
        <TextValidator
          validators={[]}
          errorMessages={[]}
          name="mqttuserName"
          label="Mqtt User Name"
          className={classes.textField}
          value={mqttSettings.mqttuserName}
          onChange={handleValueChange('mqttuserName')}
          margin="normal"
        />
        <TextValidator
          validators={[]}
          errorMessages={[]}
          name="mqttpassword"
          label="Mqtt Password"
          className={classes.textField}
          value={mqttSettings.mqttpassword}
          onChange={handleValueChange('mqttpassword')}
          margin="normal"
        />
        <TextValidator
              validators={['required', 'matchRegexp:^[a-zA-Z0-9_\\.]{1,24}$']}
              errorMessages={['Username is required', "Must be 1-24 characters: alpha numeric, '_' or '.'"]}
              name="mqttapplicationName"
              label="Application Name"
              className={classes.textField}
              value={mqttSettings.mqttapplicationName}
              onChange={handleValueChange('mqttapplicationName')}
              margin="normal"
            />
        <Button startIcon={<SaveIcon />} variant="contained" color="primary" className={classes.button} type="submit">
          Save
        </Button>
        <Button variant="contained" color="secondary" className={classes.button} onClick={onReset}>
          Reset
        </Button>
      </ValidatorForm>
    );
  }
}

MqttSettingsForm.propTypes = {
  classes: PropTypes.object.isRequired,
  mqttSettings: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  handleValueChange: PropTypes.func.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(MqttSettingsForm);
