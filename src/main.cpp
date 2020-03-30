#include <KitMonitor.h>
#include <TemperatureSettingsService.h>
#include <TemperatureStatus.h>
#include <ESP8266React.h>
#include <FS.h>

#define SERIAL_BAUD_RATE 115200

AsyncWebServer server(80);
ESP8266React esp8266React(&server, &SPIFFS);
#ifdef ENABLE_KITMONITOR
KitMonitor kitmonitor(&server, &SPIFFS, esp8266React.getSecurityManager(), esp8266React.getMqttSettingsManager());
#endif
#ifdef ENABLE_ONEWIRE_TEMPERATURE
TemperatureSettingsService temperatureService(&server, &SPIFFS, esp8266React.getSecurityManager(), esp8266React.getMqttSettingsManager());
TemperatureStatus temperatureStatus(&server, esp8266React.getSecurityManager(), &temperatureService);
#endif

void setup() {
  // start serial and filesystem
  Serial.begin(SERIAL_BAUD_RATE);

  // start the file system (must be done before starting the framework)
#ifdef ESP32
  SPIFFS.begin(true);
#elif defined(ESP8266)
  SPIFFS.begin();
#endif

  // start the framework and kit monitor project
  esp8266React.begin();

  // start the kit monitor project
#ifdef ENABLE_KITMONITOR
  kitmonitor.begin();
#endif

#ifdef ENABLE_ONEWIRE_TEMPERATURE
  temperatureService.begin();
#endif
  // start the server
  server.begin();
}

void loop() {
  // run the framework's loop function
  esp8266React.loop();

  // run the switchMonitor project's loop function
#ifdef ENABLE_KITMONITOR
  kitmonitor.loop();
#endif

#ifdef ENABLE_ONEWIRE_TEMPERATURE
  temperatureService.loop();
#endif

}
