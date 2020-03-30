#include <MQTTSettings.h>

MQTTSettings::MQTTSettings(AsyncWebServer* server, FS* fs, SecurityManager* securityManager) :
    AdminSettingsService(server, fs, securityManager, MQTT_SETTINGS_SERVICE_PATH, MQTT_SETTINGS_FILE),
    _mqttClient(_espClient) {
#if defined(ESP8266)
  _onStationModeDisconnectedHandler =
      WiFi.onStationModeDisconnected(std::bind(&MQTTSettings::onStationModeDisconnected, this, std::placeholders::_1));
  _onStationModeGotIPHandler =
      WiFi.onStationModeGotIP(std::bind(&MQTTSettings::onStationModeGotIP, this, std::placeholders::_1));
#elif defined(ESP_PLATFORM)
  WiFi.onEvent(std::bind(&MQTTSettings::onStationModeDisconnected, this, std::placeholders::_1, std::placeholders::_2),
               WiFiEvent_t::SYSTEM_EVENT_STA_DISCONNECTED);
  WiFi.onEvent(std::bind(&MQTTSettings::onStationModeGotIP, this, std::placeholders::_1, std::placeholders::_2),
               WiFiEvent_t::SYSTEM_EVENT_STA_GOT_IP);
#endif

  _espClient.setNoDelay(true);
}

void MQTTSettings::loop() {
  if (!_settings.enabled) {
    if (_mqttClient.connected()) {
      _mqttClient.disconnect();
    }
    return;
  }

  if (!WiFi.isConnected()) {
    digitalWrite(12, HIGH);
    return;
  }

  if (_reconfigureMQTT || !_mqttClient.connected()) {
    digitalWrite(12, HIGH);
    _reconfigureMQTT = false;
    configureMQTT();
  }
  if (!_reconfigureMQTT) {
    digitalWrite(12, LOW);
    auto timenow = millis();
    if((timenow - _lastUpdateTime) > 5000) {
      sendWifiRSSI();
      _lastUpdateTime = timenow;
    }
    _mqttClient.loop();
  }
}

void MQTTSettings::readFromJsonObject(JsonObject& root) {
  _settings.enabled = root["mqttenabled"];
  _settings.server = root["mqttserver"] | MQTT_SETTINGS_SERVICE_DEFAULT_SERVER;
  _settings.port = root["mqttport"];
  _settings.userName = root["mqttuserName"] | MQTT_SETTINGS_SERVICE_DEFAULT_USERNAME;
  _settings.password = root["mqttpassword"] | MQTT_SETTINGS_SERVICE_DEFAULT_PASSWORD;
  _settings.applicationName = root["mqttapplicationName"] | MQTT_SETTINGS_SERVICE_DEFAULT_APPLICATION_NAME;

  // validate server is specified, resorting to default
  _settings.server.trim();
  if (!_settings.server) {
    _settings.server = MQTT_SETTINGS_SERVICE_DEFAULT_SERVER;
  }

  // make sure interval is in bounds
  if (_settings.port < MQTT_SETTINGS_MIN_PORT) {
    _settings.port = MQTT_SETTINGS_MIN_PORT;
  } else if (_settings.port > MQTT_SETTINGS_MAX_PORT) {
    _settings.port = MQTT_SETTINGS_MAX_PORT;
  }

  _settings.applicationName.trim();
  if (!_settings.applicationName) {
    _settings.applicationName = MQTT_SETTINGS_SERVICE_DEFAULT_APPLICATION_NAME;
  }
}

void MQTTSettings::writeToJsonObject(JsonObject& root) {
  root["mqttenabled"] = _settings.enabled;
  root["mqttserver"] = _settings.server;
  root["mqttport"] = _settings.port;
  root["mqttuserName"] = _settings.userName;
  root["mqttpassword"] = _settings.password;
  root["mqttapplicationName"] = _settings.applicationName;
  root["mqttconnectionState"] = _settings.enabled ? _mqttClient.state() : -100;
}

void MQTTSettings::onConfigUpdated() {
  _reconfigureMQTT = true;
}

#if defined(ESP8266)
void MQTTSettings::onStationModeGotIP(const WiFiEventStationModeGotIP& event) {
  Serial.printf("Got IP address, starting mqtt connection\n");
  _reconfigureMQTT = true;
}

void MQTTSettings::onStationModeDisconnected(const WiFiEventStationModeDisconnected& event) {
  Serial.printf("WiFi connection dropped. mqtt might be disconnected\n");
  _reconfigureMQTT = false;
}
#elif defined(ESP_PLATFORM)
void MQTTSettings::onStationModeGotIP(WiFiEvent_t event, WiFiEventInfo_t info) {
  Serial.printf("Got IP address, starting mqtt connection\n");
  _reconfigureMQTT = true;
}

void MQTTSettings::onStationModeDisconnected(WiFiEvent_t event, WiFiEventInfo_t info) {
  Serial.printf("WiFi connection dropped, mqtt might be disconnected.\n");
  _reconfigureMQTT = false;
}
#endif
void MQTTSettings::sendMessage(String function, String channel, String value, bool retained) {
  if (!_settings.enabled || !_mqttClient.connected()) {
    return;
  }
  
  String topic_buf = _settings.applicationName + "/" + HOSTNAME
    +'/' + function + '/' + channel;
  _mqttClient.publish(topic_buf.c_str(), String(value).c_str(), retained);
}

uint8_t RssiToPercentage(int dBm)
{
    if (dBm <= -100)
        return 0;
    if (dBm >= -50)
        return 100;
    return 2 * (dBm + 100);
}

void MQTTSettings::sendWifiRSSI() {
  auto rssi = RssiToPercentage(WiFi.RSSI());
  String topic_buf = _settings.applicationName + "/" + HOSTNAME +  "/" + TAG_WIFI_SIGNAL;
  _mqttClient.publish(topic_buf.c_str(), String(rssi).c_str(), false);
}


void MQTTSettings::configureMQTT() {
  Serial.println("Configuring mqtt...");
  if (_mqttClient.connected()) {
    _mqttClient.disconnect();
  }
  _mqttClient.setServer(_settings.server.c_str(), _settings.port);
  String hostname = HOSTNAME;
  String willMessage = _settings.applicationName + "/" + hostname + "/" + "heartbeat";
  boolean result;
  Serial.println(hostname);
  Serial.println(_settings.server);
  Serial.println(_settings.port);

  if (_settings.userName != "" || _settings.password != "") {
    Serial.println("mqtt connection with autentication");
    Serial.println(_settings.userName);
    Serial.println(_settings.password);

    result = _mqttClient.connect(
        hostname.c_str(), _settings.userName.c_str(), _settings.password.c_str(), willMessage.c_str(), MQTTQOS0, false, "Disconnected");

  } else {
    Serial.println("mqtt connection without autentication");
    result = _mqttClient.connect(hostname.c_str(), willMessage.c_str(), MQTTQOS0, false, "Disconnected");
  }
  if (!result) {
    _reconfigureMQTT = true;
    Serial.println("mqtt connection error!");
  } else {
    Serial.println("mqtt Connected!");
  }
}
