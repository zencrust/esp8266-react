#ifndef TemperatureSettingsService_h
#define TemperatureSettingsService_h

#include <AdminSettingsService.h>
#include <vector>
#include <map>
#include <tuple>
#include <time.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <MQTTSettings.h>

// default time zone
#define TEMPERATURE_SETTINGS_SERVICE_DEFAULT_ENABLED false
#define TEMPERATURE_SETTINGS_SERVICE_DEFAULT_PRECISION  10
#define TEMPERATURE_SETTINGS_SERVICE_DEFAULT_RETRIES  8
#define TEMPERATURE_SETTINGS_SERVICE_DEFAULT_SECTION_MQTTID "temp"
#define POWER_ON_RESET_VAL 85

#define TEMPERATURE_SETTINGS_FILE "/config/oneWire.json"
#define TEMPERATURE_SETTINGS_SERVICE_PATH "/rest/temperatureSettings"

struct TemperaturePinSettings{
public:
  int pinNumber;
  String mqttId;
  TemperaturePinSettings(int pin, String id):
    pinNumber(pin),
    mqttId(id){}
};

class TemperatureSettings {
 public:
  bool enabled;
  uint8_t precision;
  uint8_t retires;
  String sectionMqttId;
  std::vector<TemperaturePinSettings> pinConfig;
};

class OnewireHelper{
  private:
    int _retryCount = 0;
    bool completed = false;
    OneWire oneWire;
    DallasTemperature dallasTemperature;

  public:
    String mqttId;
    String currentValue;

    OnewireHelper(String mqttId, uint8_t precision, uint8_t pin):
      oneWire(pin),
      dallasTemperature(&oneWire),
      mqttId(mqttId),
      currentValue("")
      { 
      }
    void startConversion();
    bool readTemperature(MQTTSettings* mqttManager, String sectionMqttId, int allowedRetries);

    bool isConversionComplete();
};

class TemperatureSettingsService : public AdminSettingsService<TemperatureSettings> {
 public:
  TemperatureSettingsService(AsyncWebServer* server, FS* fs, SecurityManager* securityManager, MQTTSettings* mqttManager);
  ~TemperatureSettingsService();
  void getStatus(JsonObject& root);
  void loop();

 protected:
  void readFromJsonObject(JsonObject& root);
  void writeToJsonObject(JsonObject& root);
  void onConfigUpdated();

 private:
  bool _reconfigure = false;
  bool _configured = false;
  bool _temperatureConversionComplete = false;
  ulong _lastUpdateTime = 0, _lastreadTime = 0;
  MQTTSettings* _mqttManager;
  std::vector<OnewireHelper> temperatures;
  void configure();
  void startConversion();
  bool readTemperatures();
  bool isAllConversionComplete();
};

#endif  // end TemperatureSettingsService_h
