import React, { Component } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import { ENDPOINT_ROOT } from '../api';
import { restController, RestControllerProps, RestFormLoader, RestFormProps, SectionContent } from '../components';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';

export const SWITCHMONITOR_SETTINGS_ENDPOINT = ENDPOINT_ROOT + "kitMonitor";
interface SwitchMonitorSettings {
  switchPin: number;
  lampPin: number;
  ledPin: number;

  mqttId: string;
  sectionMqttId: string;
}

type DemoControllerProps = RestControllerProps<SwitchMonitorSettings>;

class SwitchMonitorController extends Component<DemoControllerProps> {
  componentDidMount() {
    this.props.loadData();
  }

  render() {
    return (
      <SectionContent title="Switch Pin Configuration" titleGutter>
        <RestFormLoader
          {...this.props}
          render={(props) =>
            <SwitchMonitorForm {...props}
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

type SwitchMonitorFormProps = RestFormProps<SwitchMonitorSettings>;


function SwitchMonitorForm(props: SwitchMonitorFormProps) {
  const { data, saveData, loadData, handleValueChange } = props;
  const classes = useStyles();
  return (
    <ValidatorForm onSubmit={saveData}>
      <TextValidator
        validators={['required', 'isNumber', 'minNumber:0', 'maxNumber:20']}
        errorMessages={['Pin number is required', 'Pin number must be a number', 'DIO starts from 0', "Max DIO is 20"]}
        name="switchPin"
        label="Switch Monitor Pin"
        className={classes.textField}
        value={data.switchPin}
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
        value={data.lampPin}
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
        value={data.mqttId}
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
        value={data.sectionMqttId}
        type="text"
        onChange={handleValueChange('sectionMqttId')}
        margin="normal"
      />
      <Button startIcon={<SaveIcon />} variant="contained" color="primary" className={classes.button} type="submit">
        Save
      </Button>
      <Button variant="contained" color="secondary" className={classes.button} onClick={loadData}>
        Reset
      </Button>
    </ValidatorForm>
  );
}

export default restController(SWITCHMONITOR_SETTINGS_ENDPOINT, SwitchMonitorController);
