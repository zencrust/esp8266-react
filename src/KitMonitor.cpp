#include <KitMonitor.h>

KitMonitor::KitMonitor(AsyncWebServer* server, FS* fs, SecurityManager* securityManager, MQTTSettings* mqttManager) :
    AdminSettingsService(server, fs, securityManager, KITMONITOR_SETTINGS_PATH, KITMONITOR_SETTINGS_FILE),
    _mqttManager(mqttManager),
    _switchDebounced(_settings.switchPin, DEBOUNCE_DELAY, InputDebounce::PIM_INT_PULL_UP_RES, 0,
                      InputDebounce::ST_NORMALLY_CLOSED)
{
}


KitMonitor::~KitMonitor() {
}

void KitMonitor::begin(){
  _switchDebounced.setup(_settings.switchPin, DEBOUNCE_DELAY, InputDebounce::PIM_INT_PULL_UP_RES, 0,
                  InputDebounce::ST_NORMALLY_CLOSED);
}

void KitMonitor::loop() {
  if(_configure){
    Configure();
  }
  
  if(_configured){
    auto current_time = millis();
    if((current_time - _lastUpdate) > 1000){
      //process event only every second
      this->_switchDebounced.process(current_time);
      _lastUpdate = current_time;
    }
  }
}

void KitMonitor::Configure(){
  Serial.println("Configuring switch monitor");
  // pinMode(_pin, INPUT);

  pinMode(_settings.lampPin, OUTPUT);
  pinMode(_settings.ledPin, OUTPUT);

  digitalWrite(_settings.lampPin, LOW);
  digitalWrite(_settings.ledPin, HIGH);
  _switchDebounced.registerCallbacks(
                                  std::bind(&KitMonitor::switchPressed, this, std::placeholders::_1),
                                  std::bind(&KitMonitor::switchReleased, this, std::placeholders::_1),
                                  std::bind(&KitMonitor::switchUntillPressed, this, std::placeholders::_1,  std::placeholders::_2),
                                  std::bind(&KitMonitor::switchUntillReleased, this, std::placeholders::_1, std::placeholders::_2));
                      
  _configured = true;
  _configure = false;
  switchReleased(_settings.switchPin);
}

void KitMonitor::readFromJsonObject(JsonObject& root) {
  Serial.println("Kit monitor readFromJsonObject");
  _settings.switchPin = root["switchPin"];
  _settings.lampPin = root["lampPin"];
  _settings.ledPin = root["ledPin"];
  _settings.mqttId = root["mqttId"] | DEFAULT_MQTT_ID;
  _settings.sectionMqttId = root["sectionMqttId"] | DEFAILT_MQTT_SECTION_ID;
  _configure = true;
}

void KitMonitor::writeToJsonObject(JsonObject& root) {
  // connection settings
  root["switchPin"] = _settings.switchPin;
  root["lampPin"] = _settings.lampPin;
  root["ledPin"] = _settings.ledPin ? _settings.ledPin: DEFAULT_LED_PIN;
  root["mqttId"] = _settings.mqttId;
  root["sectionMqttId"] = _settings.sectionMqttId;
}

void KitMonitor::switchPressed(uint8_t pinIn)
{
    digitalWrite(_settings.lampPin, HIGH);
    Serial.println("Switch" + String(pinIn) + "Pressed");
    this->sendMessage(1);
}

void KitMonitor::switchUntillPressed(uint8_t pinIn, unsigned long duration)
{
    this->sendMessage(duration / 1000);
}

void KitMonitor::switchUntillReleased(uint8_t pinIn, unsigned long duration)
{
    this->sendMessage(0);
}

void KitMonitor::switchReleased(uint8_t pinIn)
{
    if (_switchDebounced.isReleased())
    {
        digitalWrite(_settings.lampPin, LOW);
    }

    Serial.println("Switch Released");
    this->sendMessage(0);
}

void KitMonitor::sendMessage(int duration){
    _mqttManager->sendMessage(_settings.sectionMqttId, _settings.mqttId, String(duration), false);
}

