import * as Highlight from './Highlight';
export const MQTT_DISABLED               = -100;
export const MQTT_CONNECTION_TIMEOUT     = -4;
export const MQTT_CONNECTION_LOST        = -3;
export const MQTT_CONNECT_FAILED         = -2;
export const MQTT_DISCONNECTED           = -1;
export const MQTT_CONNECTED               = 0;
export const MQTT_CONNECT_BAD_PROTOCOL    = 1;
export const MQTT_CONNECT_BAD_CLIENT_ID   = 2;
export const MQTT_CONNECT_UNAVAILABLE     = 3;
export const MQTT_CONNECT_BAD_CREDENTIALS = 4;
export const MQTT_CONNECT_UNAUTHORIZED    = 5;

export const mqttStatusHighlight = mqttStatus => {
  switch (mqttStatus.mqttconnectionState){
    case MQTT_CONNECTED:
      return Highlight.SUCCESS;
    case MQTT_CONNECT_UNAVAILABLE:
    case MQTT_CONNECTION_LOST:
      return Highlight.WARN;
    case MQTT_CONNECTION_TIMEOUT:
    case MQTT_CONNECT_FAILED:
    case MQTT_CONNECT_BAD_CLIENT_ID:
    case MQTT_CONNECT_BAD_PROTOCOL:
    case MQTT_CONNECT_BAD_CREDENTIALS:
    case MQTT_CONNECT_UNAUTHORIZED:
    case MQTT_DISABLED:
    default:
      return Highlight.ERROR;
  }
}

export const mqttStatus = mqttStatus => {
  switch (mqttStatus.mqttconnectionState){
    case MQTT_CONNECTED:
      return "Connected";
    case MQTT_CONNECT_UNAVAILABLE:
      return "Connect Unavailable. Please check MQTT server is accessible";
    case MQTT_CONNECT_BAD_PROTOCOL:
      return "Bad Protocol. Please check MQTT server is version supports 3.1 or higher";
    case MQTT_CONNECTION_TIMEOUT:
      return "Connection timeout. Please check MQTT server is accessible";
    case MQTT_CONNECTION_LOST:
      return "Connection Lost. Trying to connect again";
    case MQTT_CONNECT_FAILED:
      return "Connection Lost. Trying to connect again";
    case MQTT_CONNECT_BAD_CLIENT_ID:
      return "Bad client id. Please update unique hostname for each node in the network";
    case MQTT_CONNECT_BAD_CREDENTIALS:
      return "Bad Credentials. Please MQTT user name and password";
    case MQTT_CONNECT_UNAUTHORIZED:
      return "Connection unauthorized. Please MQTT user name and password";
    case MQTT_DISABLED:
      return "MQTT Disabled.";

    default:
      return "Unknown error";
  }
}
