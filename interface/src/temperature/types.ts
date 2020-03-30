export interface OnewireTemperatureSetting{
  pinNumber: number;
  mqttId: string;
}

export interface OnewireTemperatureStatus{
  mqttId: string;
  value: string;
}

export interface OnewireTemperatureStatus {
  enabled: boolean;
  values: OnewireTemperatureStatus[];
}

export interface OnewireTemperatureSettings {
  enabled: boolean;
  precision: number;
  retires: number;
  sectionMqttId: string;
  pinConfig: OnewireTemperatureSetting[];
}
