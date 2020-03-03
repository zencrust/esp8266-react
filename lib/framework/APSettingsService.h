#ifndef APSettingsConfig_h
#define APSettingsConfig_h

#include <AdminSettingsService.h>
#include <DNSServer.h>
#include <IPAddress.h>

#define MANAGE_NETWORK_DELAY 10000

#define AP_MODE_ALWAYS 0
#define AP_MODE_DISCONNECTED 1
#define AP_MODE_NEVER 2

#define DNS_PORT 53

#define AP_DEFAULT_SSID "ssid"
#define AP_DEFAULT_PASSWORD "password"
static const IPAddress local_ip(192, 168, 1, 31);
static const IPAddress gateway(192, 168, 1, 1);
static const IPAddress subnet(255, 255, 255, 0);


#define AP_SETTINGS_FILE "/config/apSettings.json"
#define AP_SETTINGS_SERVICE_PATH "/rest/apSettings"

class APSettings {
 public:
  uint8_t provisionMode;
  String ssid;
  String password;
};

class APSettingsService : public AdminSettingsService<APSettings> {
 public:
  APSettingsService(AsyncWebServer* server, FS* fs, SecurityManager* securityManager);
  ~APSettingsService();

  void begin();
  void loop();

 protected:
  void readFromJsonObject(JsonObject& root);
  void writeToJsonObject(JsonObject& root);
  void onConfigUpdated();

 private:
  // for the mangement delay loop
  unsigned long _lastManaged;

  // for the captive portal
  DNSServer* _dnsServer;

  void reconfigureAP();
  void manageAP();
  void startAP();
  void stopAP();
  void handleDNS();
};

#endif  // end APSettingsConfig_h