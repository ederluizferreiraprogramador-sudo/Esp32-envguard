/*
 * EnvGuard - Estação de Monitoramento Ambiental com ESP32
 * Sensores: DHT22 (temp/umidade), MQ-135 (qualidade do ar/CO2 estimado), Sensor de som (KY-038)
 * Publica leituras via MQTT e serve um dashboard web local (WiFi AP + Station)
 *
 * Autor: EnvGuard Project
 * Licença: MIT
 */

#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <DHT.h>

// ---------- CONFIGURAÇÕES DO USUÁRIO ----------
const char* WIFI_SSID     = "SUA_REDE_WIFI";
const char* WIFI_PASSWORD = "SUA_SENHA_WIFI";

const char* MQTT_BROKER   = "192.168.1.100";  // IP do broker MQTT (ex: Mosquitto no Raspberry Pi/Home Assistant)
const int   MQTT_PORT     = 1883;
const char* MQTT_USER     = "";
const char* MQTT_PASS     = "";
const char* MQTT_TOPIC    = "envguard/sala";

// Limiares de alerta
const float TEMP_MAX      = 30.0;
const float HUMIDITY_MAX  = 70.0;
const int   AIR_QUALITY_MAX = 400;  // leitura ADC do MQ-135
const int   NOISE_MAX     = 700;    // leitura ADC do sensor de som
// -----------------------------------------------

#define DHTPIN   4
#define DHTTYPE  DHT22
#define MQ135_PIN 34
#define SOUND_PIN 35
#define LED_ALERT 2

DHT dht(DHTPIN, DHTTYPE);
WebServer server(80);
WiFiClient espClient;
PubSubClient mqttClient(espClient);

struct SensorData {
  float temperature;
  float humidity;
  int airQuality;
  int noiseLevel;
  bool alertActive;
  unsigned long timestamp;
} lastReading;

unsigned long lastMqttPublish = 0;
const unsigned long PUBLISH_INTERVAL = 30000; // 30s

void setup() {
  Serial.begin(115200);
  pinMode(LED_ALERT, OUTPUT);
  pinMode(MQ135_PIN, INPUT);
  pinMode(SOUND_PIN, INPUT);

  dht.begin();
  connectWiFi();

  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);

  server.on("/", handleRoot);
  server.on("/api/data", handleApiData);
  server.on("/api/history", handleApiHistory);
  server.begin();

  Serial.println("EnvGuard iniciado. Dashboard em: http://" + WiFi.localIP().toString());
}

void loop() {
  server.handleClient();

  if (!mqttClient.connected()) {
    reconnectMqtt();
  }
  mqttClient.loop();

  readSensors();

  if (millis() - lastMqttPublish > PUBLISH_INTERVAL) {
    publishReading();
    lastMqttPublish = millis();
  }

  digitalWrite(LED_ALERT, lastReading.alertActive ? HIGH : LOW);

  delay(2000);
}

void connectWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Conectando ao WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConectado! IP: " + WiFi.localIP().toString());
}

void reconnectMqtt() {
  if (mqttClient.connect("EnvGuardESP32", MQTT_USER, MQTT_PASS)) {
    Serial.println("MQTT conectado.");
  }
}

void readSensors() {
  float temp = dht.readTemperature();
  float hum  = dht.readHumidity();

  if (!isnan(temp)) lastReading.temperature = temp;
  if (!isnan(hum))  lastReading.humidity = hum;

  lastReading.airQuality = analogRead(MQ135_PIN);
  lastReading.noiseLevel = analogRead(SOUND_PIN);
  lastReading.timestamp = millis();

  lastReading.alertActive =
      (lastReading.temperature > TEMP_MAX) ||
      (lastReading.humidity > HUMIDITY_MAX) ||
      (lastReading.airQuality > AIR_QUALITY_MAX) ||
      (lastReading.noiseLevel > NOISE_MAX);
}

void publishReading() {
  StaticJsonDocument<256> doc;
  doc["temperature"] = lastReading.temperature;
  doc["humidity"] = lastReading.humidity;
  doc["air_quality"] = lastReading.airQuality;
  doc["noise_level"] = lastReading.noiseLevel;
  doc["alert"] = lastReading.alertActive;

  char buffer[256];
  serializeJson(doc, buffer);
  mqttClient.publish(MQTT_TOPIC, buffer);
}

void handleRoot() {
  server.sendHeader("Location", "/dashboard.html", true);
  server.send(302, "text/plain", "");
}

void handleApiData() {
  StaticJsonDocument<256> doc;
  doc["temperature"] = lastReading.temperature;
  doc["humidity"] = lastReading.humidity;
  doc["air_quality"] = lastReading.airQuality;
  doc["noise_level"] = lastReading.noiseLevel;
  doc["alert"] = lastReading.alertActive;
  doc["uptime_ms"] = millis();

  String response;
  serializeJson(doc, response);

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", response);
}

void handleApiHistory() {
  // Placeholder: em produção, seria alimentado por um buffer circular
  // ou por um serviço externo (InfluxDB/SQLite) para série temporal.
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", "{\"note\":\"use MQTT + Node-RED/InfluxDB para histórico completo\"}");
}
