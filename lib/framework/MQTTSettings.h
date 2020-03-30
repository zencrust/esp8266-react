#ifndef MQTTSettings_h
#define MQTTSettings_h

#include <AdminSettingsService.h>
#include <PubSubClient.h>

#ifdef ESP32
  #define HOSTNAME WiFi.getHostname()
#elif defined(ESP8266)
  #define HOSTNAME WiFi.hostname()
#endif


// default
#define MQTT_SETTINGS_SERVICE_DEFAULT_ENABLED false
#define MQTT_SETTINGS_SERVICE_DEFAULT_SERVER "smartdashboard.local"
#define MQTT_SETTINGS_SERVICE_DEFAULT_APPLICATION_NAME "partmon"
#define MQTT_SETTINGS_SERVICE_DEFAULT_USERNAME ""
#define MQTT_SETTINGS_SERVICE_DEFAULT_PASSWORD ""
#define MQTT_SETTINGS_SERVICE_DEFAULT_INTERVAL 1883
#define TAG_WIFI_SIGNAL "wifi Signal Strength"

// min poll delay of 60 secs, max 1 day
#define MQTT_SETTINGS_MIN_PORT 10
#define MQTT_SETTINGS_MAX_PORT 9999


#define MQTT_SETTINGS_FILE "/config/mqttSettings.json"
#define MQTT_SETTINGS_SERVICE_PATH "/rest/mqttSettings"

class MQTTStatus {
 public:
  bool enabled;
  String server;
  int port;
  String userName;
  String password;
  String applicationName;
};

class MQTTSettings : public AdminSettingsService<MQTTStatus> {
 public:
  MQTTSettings(AsyncWebServer* server, FS* fs, SecurityManager* securityManager);
  void loop();
  void sendMessage(String function, String channel, String value, bool retained = false);

 protected:
  void readFromJsonObject(JsonObject& root);
  void writeToJsonObject(JsonObject& root);
  void onConfigUpdated();

 private:
  WiFiClient _espClient;
  PubSubClient _mqttClient;
  bool _reconfigureMQTT = false;
  unsigned long _lastUpdateTime = 0;

#if defined(ESP8266)
  WiFiEventHandler _onStationModeDisconnectedHandler;
  WiFiEventHandler _onStationModeGotIPHandler;

  void onStationModeGotIP(const WiFiEventStationModeGotIP& event);
  void onStationModeDisconnected(const WiFiEventStationModeDisconnected& event);
#elif defined(ESP_PLATFORM)
  void onStationModeGotIP(WiFiEvent_t event, WiFiEventInfo_t info);
  void onStationModeDisconnected(WiFiEvent_t event, WiFiEventInfo_t info);
#endif

  void configureMQTT();
  void sendWifiRSSI();
};

#endif  // end MQTTService_h
