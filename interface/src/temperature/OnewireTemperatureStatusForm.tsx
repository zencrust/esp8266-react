import React, { Component, Fragment } from 'react';
import moment from 'moment';

import { WithTheme, withTheme } from '@material-ui/core/styles';
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';

import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle';
import UpdateIcon from '@material-ui/icons/Update';
import RefreshIcon from '@material-ui/icons/Refresh';
import { Theme } from "@material-ui/core";

import { RestFormProps, FormActions, FormButton, HighlightAvatar } from '../components';

import { OnewireTemperatureStatus } from './types';

type OnewireTemperatureFormProps = RestFormProps<OnewireTemperatureStatus> & WithTheme;

const StatusHighlight = ({ enabled }: OnewireTemperatureStatus, theme: Theme) => {
  return enabled ? theme.palette.success.main : theme.palette.info.main;
}

class OnewireTemperatureStatusForm extends Component<OnewireTemperatureFormProps> {

  render() {
    const { data, theme } = this.props
    return (
      <Fragment>
        <List>
          <ListItem>
            <ListItemAvatar>
              <HighlightAvatar color={StatusHighlight(data, theme)}>
                <UpdateIcon />
              </HighlightAvatar>
            </ListItemAvatar>
            <ListItemText primary="Status" secondary={data.enabled?"enabled": "disabled"} />
          </ListItem>
          {data.enabled && data.values &&
            (data.values.map(x =>
              <>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <SwapVerticalCircleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={x.mqttId} secondary={x.value} />
              </ListItem>
              </>
            )
          )}
          <Divider variant="inset" component="li" />
        </List>
        <FormActions>
          <FormButton startIcon={<RefreshIcon />} variant="contained" color="secondary" onClick={this.props.loadData}>
            Refresh
          </FormButton>
        </FormActions>
      </Fragment>
    );
  }
}

export default withTheme(OnewireTemperatureStatusForm);
