import React, { Component } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import { ENDPOINT_ROOT } from '../constants/Env';
import SectionContent from '../components/SectionContent';
import { restComponent } from '../components/RestComponent';
import LoadingNotification from '../components/LoadingNotification';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';

export const SWITCHMONITOR_SETTINGS_ENDPOINT = ENDPOINT_ROOT + "kitMonitor";

class SwitchMonitorController extends Component {
  componentDidMount() {
    this.props.loadData();
  }

  render() {
    const { data, fetched, errorMessage, saveData, loadData, handleValueChange } = this.props;
    return (
      <SectionContent title="Switch Pin Configuration" titleGutter>
        <LoadingNotification
          onReset={loadData}
          fetched={fetched}
          errorMessage={errorMessage}
          render={() =>
            <SwitchMonitorControllerForm
              Settings={data}
              onReset={loadData}
              onSubmit={saveData}
              handleValueChange={handleValueChange}
            />
          }
        />
      </SectionContent>
    )
  }
}

const useStyles = makeStyles(theme => ({
  button: {
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  textField: {
    width: "100%"
  },
}));

function SwitchMonitorControllerForm(props) {
  const { Settings, onSubmit, onReset, handleValueChange } = props;
  const classes = useStyles();
  return (
    <ValidatorForm onSubmit={onSubmit}>
        <TextValidator
          validators={['required', 'isNumber', 'minNumber:0', 'maxNumber:20']}
          errorMessages={['Pin number is required', 'Pin number must be a number', 'DIO starts from 0', "Max DIO is 20"]}
          name="switchPin"
          label="Switch Monitor Pin"
          className={classes.textField}
          value={Settings.switchPin}
          type="number"
          onChange={handleValueChange('switchPin')}
          margin="normal"
        />
        <TextValidator
          validators={['required', 'isNumber', 'minNumber:0', 'maxNumber:20']}
          errorMessages={['Lamp Pin number is required', 'Lamp Pin number must be a number', 'DIO starts from 0', "Max DIO is 20"]}
          name="lampPin"
          label="Lamp Control Pin"
          className={classes.textField}
          value={Settings.lampPin}
          type="number"
          onChange={handleValueChange('lampPin')}
          margin="normal"
        />
        <TextValidator
          validators={[]}
          errorMessages={[]}
          name="mqttId"
          label="Switch Mqtt Id"
          className={classes.textField}
          value={Settings.mqttId}
          type="text"
          onChange={handleValueChange('mqttId')}
          margin="normal"
        />
        <TextValidator
          validators={[]}
          errorMessages={[]}
          name="sectionMqttId"
          label="Section Mqtt Id"
          className={classes.textField}
          value={Settings.sectionMqttId}
          type="text"
          onChange={handleValueChange('sectionMqttId')}
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

export default restComponent(SWITCHMONITOR_SETTINGS_ENDPOINT, SwitchMonitorController);
