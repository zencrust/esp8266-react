#include <KitMonitor.h>
#include <ESP8266React.h>
#include <FS.h>

#define SERIAL_BAUD_RATE 115200

AsyncWebServer server(80);
ESP8266React esp8266React(&server, &SPIFFS);
KitMonitor switchMonitor(&server, &SPIFFS, esp8266React.getSecurityManager(), esp8266React.getMqttSettingsManager());

void setup() {
  // start serial and filesystem
  Serial.begin(SERIAL_BAUD_RATE);

  // start the file system (must be done before starting the framework)
  SPIFFS.begin();

  // start the framework and kit monitor project
  esp8266React.begin();

  // start the kit monitor project
  switchMonitor.begin();

  // start the server
  server.begin();
}

void loop() {
  // run the framework's loop function
  esp8266React.loop();

  // run the switchMonitor project's loop function
  switchMonitor.loop();
}
