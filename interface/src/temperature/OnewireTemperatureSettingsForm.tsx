import React, {forwardRef} from 'react';
import { TextValidator, ValidatorForm, SelectValidator } from 'react-material-ui-form-validator';

import { Checkbox } from '@material-ui/core';
import MaterialTable, { Column } from 'material-table';
import SaveIcon from '@material-ui/icons/Save';


import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

import { RestFormProps, FormActions, FormButton, BlockFormControlLabel } from '../components';

import update from "immutability-helper"; // ES6
import { OnewireTemperatureSettings, OnewireTemperatureSetting } from './types';

type OnewireTemperatureSettingsFormProps = RestFormProps<OnewireTemperatureSettings>;

let columns: Column<OnewireTemperatureSetting>[] = [
  { title: 'Channel Name', field: 'mqttId' },
  { title: 'Pin Number', field: 'pinNumber', type: 'numeric' }
];


function OnewireTemperatureSettingsForm({ data, handleValueChange, saveData, loadData, setData }: OnewireTemperatureSettingsFormProps){
    return (
      <ValidatorForm onSubmit={saveData}>
        <BlockFormControlLabel
          control={
            <Checkbox
              checked={data.enabled}
              onChange={handleValueChange('enabled')}
              value="enabled"
            />
          }
          label="Enable Temperature?"
        />
        <TextValidator
          validators={['required', 'isNumber', 'minNumber:9', 'maxNumber:12']}
          errorMessages={['precision is required', 'precision must be a number', 'Must be at least 9', "Must not be more than 12"]}
          name="precision"
          fullWidth
          variant="outlined"
          label="Precision"
          value={data.precision}
          type="number"
          onChange={handleValueChange('precision')}
          margin="normal"
        />
        <TextValidator
          validators={['required', 'isNumber', 'minNumber:1', 'maxNumber:10']}
          errorMessages={['retires is required', 'retires must be a number', 'retires be at least 1', "Must not be more than 10"]}
          name="retires"
          fullWidth
          variant="outlined"
          label="Retires"
          value={data.retires}
          type="number"
          onChange={handleValueChange('retires')}
          margin="normal"
        />
        <TextValidator
          validators={['required', 'matchRegexp:^[a-zA-Z0-9_\\.]{1,24}$']}
          errorMessages={['sectionMqttId is required', "Must be 1-24 characters: alpha numeric, '_' or '.'"]}
          name="sectionMqttId"
          label="section MqttId"
          fullWidth
          variant="outlined"
          value={data.sectionMqttId}
          onChange={handleValueChange('sectionMqttId')}
          margin="normal"
        />
        <MaterialTable
          options={{
            filtering: false,
            search: false,
            grouping: false,
            draggable: false,
            sorting: false,
            exportButton: true,
            exportFileName: "temperature_settings",
          }}
          
          icons={{
            Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
            Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
            Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
            Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
            DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
            Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
            Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
            Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
            FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
            LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
            NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
            PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
            ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
            Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
            SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
            ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
            ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
          }}
          editable={{

            onRowAdd: (newData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                  const updatedData = update(data, { pinConfig: {$push: [newData]}});
                  setData(updatedData);
                }, 600);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                  if (oldData) {
                    const index = data.pinConfig.indexOf(oldData);
                    const updatedData = update(data, { pinConfig: {[index]: {$set: newData}} });
                    setData(updatedData);
                  }
                }, 600);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                  const index = data.pinConfig.indexOf(oldData);
                  const updatedData = update(data, {pinConfig: {$splice: [[index, 1]]} });
                  setData(updatedData);
                }, 600);
              }),
          }}
          title="Temperature Channels"
          columns={columns}
          data={data.pinConfig}
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

export default OnewireTemperatureSettingsForm;
