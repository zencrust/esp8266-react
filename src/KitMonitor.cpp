#include <KitMonitor.h>

KitMonitor::KitMonitor(AsyncWebServer* server, FS* fs, SecurityManager* securityManager, MQTTSettings* mqttManager) :
    AdminSettingsService(server, fs, securityManager, KITMONITOR_SETTINGS_PATH, KITMONITOR_SETTINGS_FILE),
    _mqttManager(mqttManager),
    _switchDebounced(_pin, DEBOUNCE_DELAY, InputDebounce::PIM_INT_PULL_UP_RES, 0,
                      InputDebounce::ST_NORMALLY_CLOSED)
{
}

KitMonitor::~KitMonitor() {
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

  pinMode(_lampPin, OUTPUT);
  pinMode(_ledPin, OUTPUT);

  digitalWrite(_lampPin, LOW);
  digitalWrite(_ledPin, HIGH);
  _switchDebounced.registerCallbacks(
                                  std::bind(&KitMonitor::switchPressed, this, std::placeholders::_1),
                                  std::bind(&KitMonitor::switchReleased, this, std::placeholders::_1),
                                  std::bind(&KitMonitor::switchUntillPressed, this, std::placeholders::_1,  std::placeholders::_2),
                                  std::bind(&KitMonitor::switchUntillReleased, this, std::placeholders::_1, std::placeholders::_2));
                      
  _configured = true;
  _configure = false;
  switchReleased(_pin);
}

void KitMonitor::readFromJsonObject(JsonObject& root) {
  Serial.println("Kit monitor readFromJsonObject");
  _pin = root["switchPin"];
  _lampPin = root["lampPin"];
  _SwitchId = root["mqttId"] | DEFAULT_MQTT_ID;
  _SectionId = root["sectionMqttId"] | DEFAILT_MQTT_SECTION_ID;
  _configure = true;
}

void KitMonitor::writeToJsonObject(JsonObject& root) {
  // connection settings
  root["switchPin"] = _pin;
  root["lampPin"] = _lampPin;
  root["mqttId"] = _SwitchId;
  root["sectionMqttId"] = _SectionId;
}

void KitMonitor::switchPressed(uint8_t pinIn)
{
    digitalWrite(_lampPin, HIGH);
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
        digitalWrite(_lampPin, LOW);
    }

    Serial.println("Switch Released");
    this->sendMessage(0);
}

void KitMonitor::sendMessage(int duration){
    _mqttManager->sendMessage(_SectionId, _SwitchId, String(duration), false);
}

