#include <TemperatureStatus.h>

TemperatureStatus::TemperatureStatus(AsyncWebServer* server, SecurityManager* securityManager, TemperatureSettingsService* tempService) :
_tempService(tempService){
  server->on(TEMPERATURE_STATUS_SERVICE_PATH,
             HTTP_GET,
             securityManager->wrapRequest(std::bind(&TemperatureStatus::Status, this, std::placeholders::_1),
                                          AuthenticationPredicates::IS_AUTHENTICATED));
}

void TemperatureStatus::Status(AsyncWebServerRequest* request) {
  AsyncJsonResponse* response = new AsyncJsonResponse(false, MAX_STATUS_SIZE);
  JsonObject root = response->getRoot();

  _tempService->getStatus(root);

  response->setLength();
  request->send(response);
}
