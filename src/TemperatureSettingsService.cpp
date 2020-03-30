#include <TemperatureSettingsService.h>

TemperatureSettingsService::TemperatureSettingsService(AsyncWebServer* server,
                                                       FS* fs,
                                                       SecurityManager* securityManager,
                                                       MQTTSettings* mqttManager) :
    AdminSettingsService(server, fs, securityManager, TEMPERATURE_SETTINGS_SERVICE_PATH, TEMPERATURE_SETTINGS_FILE),
    _mqttManager(mqttManager) {
  _reconfigure = true;
}

TemperatureSettingsService::~TemperatureSettingsService() {
}

void TemperatureSettingsService::loop() {
  if (_reconfigure) {
    _reconfigure = false;
    configure();
    _lastUpdateTime = 0;
    _lastreadTime = 0;
  }
  auto currentTime = millis();
  if (_settings.enabled && _configured && temperatures.size() > 0) {
    bool timeout = (currentTime - _lastreadTime) > (DallasTemperature().millisToWaitForConversion(_settings.precision) + 100);
    if ((!_temperatureConversionComplete) && (isAllConversionComplete() || timeout)) {
      _temperatureConversionComplete = readTemperatures();
      _lastreadTime = currentTime;
    }
    else{
        delay(10);
    }

    if ((currentTime - _lastUpdateTime) > 20000) {
      _lastUpdateTime = currentTime;
      startConversion();
      _temperatureConversionComplete = false;
    }
  }
}

void TemperatureSettingsService::readFromJsonObject(JsonObject& root) {
  _settings.enabled = root["enabled"] | TEMPERATURE_SETTINGS_SERVICE_DEFAULT_ENABLED;
  _settings.precision = root["precision"] | TEMPERATURE_SETTINGS_SERVICE_DEFAULT_PRECISION;
  _settings.retires = root["retires"] | TEMPERATURE_SETTINGS_SERVICE_DEFAULT_RETRIES;
  _settings.sectionMqttId = root["sectionMqttId"] | TEMPERATURE_SETTINGS_SERVICE_DEFAULT_SECTION_MQTTID;
  _settings.pinConfig.clear();
  if (root.containsKey("pinConfig")) {
    for (size_t i = 0; i < root["pinConfig"].size(); i++) {
      int pinNumber = root["pinConfig"][i]["pinNumber"];
      String mqttId = root["pinConfig"][i]["mqttId"];
      _settings.pinConfig.emplace_back(pinNumber, mqttId);
    }
  }
}
void TemperatureSettingsService::writeToJsonObject(JsonObject& root) {
  root["enabled"] = _settings.enabled;
  root["precision"] = _settings.precision;
  root["retires"] = _settings.retires;
  root["sectionMqttId"] = _settings.sectionMqttId;

  int i = 0;
  for (auto&& temp_channel : _settings.pinConfig) {
    root["pinConfig"][i]["pinNumber"] = temp_channel.pinNumber;
    root["pinConfig"][i]["mqttId"] = temp_channel.mqttId;
    i++;
  }
}

void TemperatureSettingsService::getStatus(JsonObject& root) {
  root["enabled"] = _settings.enabled;

  if (_settings.enabled) {
    int i = 0;
    for (auto&& temp_channel : temperatures) {
      root["values"][i]["mqttId"] = temp_channel.mqttId;
      root["values"][i]["value"] = temp_channel.currentValue;
      i++;
    }
  }
}

void TemperatureSettingsService::onConfigUpdated() {
  _reconfigure = true;
}

void TemperatureSettingsService::configure() {
  Serial.println("Configuring temperature...");
  _configured = false;
  if (_settings.enabled) {
    temperatures.clear();
    try {
      for (auto&& channel : _settings.pinConfig) {
        temperatures.emplace_back(
            channel.mqttId, _settings.precision, channel.pinNumber);
      }

      Serial.println("Configuring temperature completed...");
      _configured = true;
    } catch (...) {
      Serial.println("Exception while Configuring temperature");
    }
  } else {
    Serial.println("temperature disabled");
  }
}

bool TemperatureSettingsService::isAllConversionComplete() {
  for (auto&& temp_channel : temperatures) {
    if (!temp_channel.isConversionComplete()) {
      return false;
    }
  }

  return true;
}

bool OnewireHelper::isConversionComplete() {
//   Serial.println("isConversionComplete. Id:" + mqttId);
  return dallasTemperature.isConversionComplete();
}

void OnewireHelper::startConversion() {
  dallasTemperature.setWaitForConversion(false);
  dallasTemperature.requestTemperatures();
  completed = false;
}
void TemperatureSettingsService::startConversion() {
  Serial.println("startConversion temperature...");
  for (auto&& temp_channel : temperatures) {
    temp_channel.startConversion();
  }
}

bool OnewireHelper::readTemperature(MQTTSettings* mqttManager, String sectionMqttId, int allowedRetries) {
  if (completed) {
    return completed;
  }
  Serial.println(mqttId);
  auto Cel = dallasTemperature.getTempCByIndex(0);
  Serial.println(Cel);
  auto cmp_val = int(Cel);
  if (DEVICE_DISCONNECTED_C != cmp_val && cmp_val != POWER_ON_RESET_VAL) {
    mqttManager->sendMessage(sectionMqttId, mqttId, String(Cel), false);
    currentValue = String(Cel);
    _retryCount = 0;
    return (completed = true);
  } else {
    _retryCount++;
    Serial.println("retrying for temperature");
  }

  if (_retryCount > allowedRetries) {
    _retryCount = 0;
    Serial.println("write disconnected");
    currentValue = "Disconnected";
    mqttManager->sendMessage(sectionMqttId, mqttId, "Disconnected", false);
    return (completed = true);
  }

  return (completed = false);
}

bool TemperatureSettingsService::readTemperatures() {
  bool completed = true;
  for (auto&& temp_channel : temperatures) {
    completed &= temp_channel.readTemperature(_mqttManager, _settings.sectionMqttId, _settings.retires);
  }

  return completed;
}