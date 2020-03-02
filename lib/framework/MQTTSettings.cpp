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
  if (!_isEnabled) {
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
    _mqttClient.loop();
  }
}

void MQTTSettings::readFromJsonObject(JsonObject& root) {
  _isEnabled = root["mqttenabled"];
  _server = root["mqttserver"] | MQTT_SETTINGS_SERVICE_DEFAULT_SERVER;
  _port = root["mqttport"];
  _userName = root["mqttuserName"] | MQTT_SETTINGS_SERVICE_DEFAULT_USERNAME;
  _password = root["mqttpassword"] | MQTT_SETTINGS_SERVICE_DEFAULT_PASSWORD;
  _applicationName = root["mqttapplicationName"] | MQTT_SETTINGS_SERVICE_DEFAULT_APPLICATION_NAME;

  // validate server is specified, resorting to default
  _server.trim();
  if (!_server) {
    _server = MQTT_SETTINGS_SERVICE_DEFAULT_SERVER;
  }

  // make sure interval is in bounds
  if (_port < MQTT_SETTINGS_MIN_PORT) {
    _port = MQTT_SETTINGS_MIN_PORT;
  } else if (_port > MQTT_SETTINGS_MAX_PORT) {
    _port = MQTT_SETTINGS_MAX_PORT;
  }

  _applicationName.trim();
  if (!_applicationName) {
    _applicationName = MQTT_SETTINGS_SERVICE_DEFAULT_APPLICATION_NAME;
  }
}

void MQTTSettings::writeToJsonObject(JsonObject& root) {
  root["mqttenabled"] = _isEnabled;
  root["mqttserver"] = _server;
  root["mqttport"] = _port;
  root["mqttuserName"] = _userName;
  root["mqttpassword"] = _password;
  root["mqttapplicationName"] = _applicationName;
  root["mqttconnectionState"] = _isEnabled ? _mqttClient.state() : -100;
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
  if (!_isEnabled || !_mqttClient.connected()) {
    return;
  }

  String topic_buf = _applicationName + "/" + WiFi.hostname();
  +'/' + function + '/' + channel;
  _mqttClient.publish(topic_buf.c_str(), String(value).c_str(), retained);
}

void MQTTSettings::configureMQTT() {
  Serial.println("Configuring mqtt...");
  if (_mqttClient.connected()) {
    _mqttClient.disconnect();
  }
  _mqttClient.setServer(_server.c_str(), _port);
  String hostname = WiFi.hostname();
  String willMessage = _applicationName + "/" + hostname + "/" + "heartbeat";
  boolean result;
  Serial.println(hostname);
  Serial.println(_server);
  Serial.println(_port);

  if (_userName != "" || _password != "") {
    Serial.println("mqtt connection with autentication");
    Serial.println(_userName);
    Serial.println(_password);

    result = _mqttClient.connect(
        hostname.c_str(), _userName.c_str(), _password.c_str(), willMessage.c_str(), MQTTQOS0, false, "Disconnected");

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
