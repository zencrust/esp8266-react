#include <FirmwareUploadService.hpp>

FirmwareUploadService::FirmwareUploadService(AsyncWebServer* server, SecurityManager* securityManager) {
  server->on(UPLOAD_SERVICE_PATH,
             HTTP_POST,
             securityManager->wrapRequest(std::bind(&FirmwareUploadService::upload, this, std::placeholders::_1),
                                          AuthenticationPredicates::IS_ADMIN),
             std::bind(&FirmwareUploadService::handleUpload,
                       this,
                       std::placeholders::_1,
                       std::placeholders::_2,
                       std::placeholders::_3,
                       std::placeholders::_4,
                       std::placeholders::_5,
                       std::placeholders::_6));
}

void FirmwareUploadService::upload(AsyncWebServerRequest* request) {
  Serial.println("Firmware update request received");
  if (Update.hasError()) {
    request->send(500, "text/html", "Update failed");
  } else {
    request->send(200, "Update success");
    delay(10000);
    ESP.restart();
  }
}

void FirmwareUploadService::handleUpload(AsyncWebServerRequest* request,
                                         String filename,
                                         size_t index,
                                         uint8_t* data,
                                         size_t len,
                                         bool final) {
  if (index == 0) {
    STOP_UDP
    Serial.println("#__ Update: " + filename);
    auto command = filename == "spiffs.bin" ? U_FS : U_FLASH;
    uint32_t maxSketchSpace = (ESP.getFreeSketchSpace() - 0x1000) & 0xFFFFF000;

    if (!Update.begin(request->contentLength(), command, LED_BUILTIN)) {  // start with max available size
      Serial.print("# Update: not enough space to update\n");
      return;
    }

    Update.onProgress([&](size_t a, size_t b) { Serial.printf("# on progress sketch %d, %d", a, b); });

    Serial.println(request->contentLength());
  }
  Serial.printf("# updating sketch ...index %d, size: %d, end: %s\n", index, len, final ? "true" : "false");

  if (Update.write(data, len) != len) {
    Serial.println("# Update size did not match");
  }

  if (Update.hasError()) {
    Update.printError(Serial);
  }

  Serial.printf("# Update remaning %d\n", Update.remaining());


  if (final) {
    if (Update.end(true)) {  // true to set the size to the current progress
      Serial.print("#__ Update Success: \nRebooting...\n");
    }
  }
}
