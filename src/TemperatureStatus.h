#ifndef TemperatureStatus_h
#define TemperatureStatus_h

#include <ArduinoJson.h>
#include <AsyncJson.h>
#include <ESPAsyncWebServer.h>
#include <SecurityManager.h>
#include <TemperatureSettingsService.h>

#define TEMPERATURE_STATUS_SERVICE_PATH "/rest/temperatureStatus"
#define MAX_STATUS_SIZE 2048

class TemperatureStatus {
 public:
  TemperatureStatus(AsyncWebServer* server, SecurityManager* securityManager, TemperatureSettingsService* tempService);

 private:
  void Status(AsyncWebServerRequest* request);

  TemperatureSettingsService* _tempService;
};

#endif  // end TemperatureStatus_h
