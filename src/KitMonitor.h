#ifndef KitMonitor_h
#define KitMonitor_h

#include <AdminSettingsService.h>
#include <MQTTSettings.h>

#define DEFAULT_SWITCH_PIN 4
#define DEFAULT_LAMP_PIN 13
#define DEFAULT_MQTT_ID "Switch Pressed"
#define DEFAILT_MQTT_SECTION_ID "dio"

#define MAX_DELAY 1000
#define DEBOUNCE_DELAY 1000

#define KITMONITOR_SETTINGS_FILE "/config/kitMonitor.json"
#define KITMONITOR_SETTINGS_PATH "/rest/kitMonitor"
#include "InputDebounce.h"

class KitMonitor : public AdminSettingsService {
 public:
  KitMonitor(AsyncWebServer* server, FS* fs, SecurityManager* securityManager, MQTTSettings* mqttManager);
  ~KitMonitor();

  void loop();

 private:
  MQTTSettings* _mqttManager;
  bool _configure = false;
  bool _configured = false;
  uint8_t _pin = DEFAULT_SWITCH_PIN;
  uint8_t _lampPin = DEFAULT_LAMP_PIN;
  String _SwitchId = DEFAULT_MQTT_ID;
  String _SectionId = DEFAILT_MQTT_SECTION_ID;
  InputDebounce _switchDebounced;
  unsigned long _lastUpdate = 0;

  void switchPressed(uint8_t pinIn);
  void switchUntillPressed(uint8_t pinIn, unsigned long duration);
  void switchUntillReleased(uint8_t pinIn, unsigned long duration);
  void switchReleased(uint8_t pinIn);
  void sendMessage(int duration);
  void Configure();

 protected:
  void readFromJsonObject(JsonObject& root);
  void writeToJsonObject(JsonObject& root);
};

#endif
