#ifndef KitMonitor_h
#define KitMonitor_h

#include <AdminSettingsService.h>
#include <MQTTSettings.h>

#define DEFAULT_SWITCH_PIN 4
#define DEFAULT_LED_PIN 12
#define DEFAULT_LAMP_PIN 13
#define DEFAULT_MQTT_ID "Switch Pressed"
#define DEFAILT_MQTT_SECTION_ID "dio"

#define MAX_DELAY 1000
#define DEBOUNCE_DELAY 1000

#define KITMONITOR_SETTINGS_FILE "/config/kitMonitor.json"
#define KITMONITOR_SETTINGS_PATH "/rest/kitMonitor"
#include "InputDebounce.h"

class kitMonitorSettings{
public:
  uint8_t switchPin = DEFAULT_SWITCH_PIN;
  uint8_t lampPin = DEFAULT_LAMP_PIN;
  uint8_t ledPin = DEFAULT_LED_PIN;

  String mqttId = DEFAULT_MQTT_ID;
  String sectionMqttId = DEFAILT_MQTT_SECTION_ID;
};

class KitMonitor : public AdminSettingsService<kitMonitorSettings> {
 public:
  KitMonitor(AsyncWebServer* server, FS* fs, SecurityManager* securityManager, MQTTSettings* mqttManager);
  ~KitMonitor();
  void begin();
  void loop();

 private:
  MQTTSettings* _mqttManager;
  bool _configure = false;
  bool _configured = false;
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
