#ifndef FirmwareUploadService_h
#define FirmwareUploadService_h

#if defined(ESP8266)
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <WiFiUdp.h>
#elif defined(ESP_PLATFORM)
#include <Arduino.h>
#include <WiFiUdp.h>
#include <AsyncTCP.h>
#include <WiFi.h>
#endif

#include <ESPAsyncWebServer.h>
#include <SecurityManager.h>

#define UPLOAD_SERVICE_PATH "/rest/upload"

class FirmwareUploadService {
 public:
  FirmwareUploadService(AsyncWebServer* server, SecurityManager* securityManager);

 private:
  void upload(AsyncWebServerRequest* request);
  void handleUpload(AsyncWebServerRequest *request, String filename, size_t index, uint8_t *data, size_t len, bool final);

};

#endif  // end FirmwareUploadService_h