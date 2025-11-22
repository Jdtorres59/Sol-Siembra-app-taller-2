// Control de humedad para ESP32 con sensor FC-28 y bomba en relé.
// Incluye conexión WiFi y envío de lecturas al backend + polling de comando remoto.

#include <WiFi.h>
#include <HTTPClient.h>

// --- Pines del hardware ---
const int Hpin = 35;  // FC-28 analógico
const int Apin = 32;  // Relé/bomba

// --- Configuración de conectividad ---
const char* WIFI_SSID = "TorresCasas";
const char* WIFI_PASS = "Tc17280905";

// Dirección del backend (usa la IP de tu PC donde corre `npm run dev` en backend/)
const char* BACKEND_BASE = "http://192.168.1.11:4000";

// Zona asociada a este nodo
const char* ZONE_ID = "zona-a";

// CONFIGURACIÓN: Umbral de humedad
// Si la lectura es MAYOR al umbral → está SECO → encender bomba
// Si la lectura es MENOR al umbral → está HÚMEDO → apagar bomba
int umbral = 3500;  // Ajusta este valor según tu sensor

// Rango de calibración del FC-28 (ajusta según tus lecturas reales)
const int SENSOR_WET = 1200;  // lectura típica en suelo muy húmedo
const int SENSOR_DRY = 3600;  // lectura típica en suelo muy seco

unsigned long lastPost = 0;
unsigned long lastPoll = 0;
const unsigned long POST_INTERVAL = 1000;   // envía lecturas más frecuentes
const unsigned long POLL_INTERVAL = 1000;   // consulta comandos para un control más fino

// Configura si el relé es activo en LOW (la mayoría de módulos lo son).
const bool RELAY_ACTIVE_LOW = true;
bool pumpState = false;

void setPump(bool on) {
  pumpState = on;
  bool level = RELAY_ACTIVE_LOW ? !on : on;
  digitalWrite(Apin, level ? HIGH : LOW);
}

int humidityPercent(int raw) {
  long pct = map(raw, SENSOR_DRY, SENSOR_WET, 0, 100);  // seco→0, húmedo→100
  if (pct < 0) pct = 0;
  if (pct > 100) pct = 100;
  return static_cast<int>(pct);
}

void printSummary(int raw, int pct) {
  Serial.print("Resumen -> HumedadRaw: ");
  Serial.print(raw);
  Serial.print(" | Humedad%: ");
  Serial.print(pct);
  Serial.print(" | Umbral: ");
  Serial.print(umbral);
  Serial.print(" | Bomba: ");
  Serial.print(pumpState ? "ON" : "OFF");
  Serial.print(" | WiFi RSSI: ");
  Serial.print(WiFi.RSSI());
  Serial.print(" dBm | Uptime(ms): ");
  Serial.println(millis());
}

// Muestra redes visibles para validar SSID/banda.
void logNearbyNetworks() {
  Serial.println("Escaneando redes WiFi cercanas...");
  int n = WiFi.scanNetworks();
  if (n <= 0) {
    Serial.println("No se encontraron redes");
    return;
  }
  for (int i = 0; i < n && i < 10; i++) {  // limitar a 10 para no saturar
    Serial.print(" - ");
    Serial.print(WiFi.SSID(i));
    Serial.print(" (RSSI ");
    Serial.print(WiFi.RSSI(i));
    Serial.print(") ");
    Serial.println(WiFi.encryptionType(i) == WIFI_AUTH_OPEN ? "abierta" : "segura");
  }
}

bool connectWiFi() {
  WiFi.disconnect(true, true);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Conectando a WiFi");
  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 15000) {
    delay(500);
    Serial.print(".");
  }
  bool ok = WiFi.status() == WL_CONNECTED;
  Serial.println();
  if (ok) {
    Serial.print("WiFi conectado, IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.print("WiFi fallo, status=");
    Serial.println(WiFi.status());
  }
  return ok;
}

void sendReading(int humedadRaw, int humedadPct) {
  if (WiFi.status() != WL_CONNECTED && !connectWiFi()) return;
  HTTPClient http;
  String url = String(BACKEND_BASE) + "/api/esp32/lecturas";
  // Mantener campo original "humedad" y añadir datos enriquecidos para el resumen
  String payload = "{";
  payload += "\"zoneId\":\"" + String(ZONE_ID) + "\"";
  payload += ",\"humedad\":" + String(humedadRaw);
  payload += ",\"humedadPct\":" + String(humedadPct);
  payload += ",\"umbral\":" + String(umbral);
  payload += ",\"bombaOn\":" + String(pumpState ? "true" : "false");
  payload += ",\"rssi\":" + String(WiFi.RSSI());
  payload += ",\"uptime\":" + String(millis());
  payload += "}";
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  int code = http.POST(payload);
  Serial.print("POST lectura -> ");
  Serial.println(code);
  http.end();
}

// Consulta el estado de la válvula en backend y aplica override.
void pollCommand() {
  if (WiFi.status() != WL_CONNECTED && !connectWiFi()) return;
  HTTPClient http;
  String url = String(BACKEND_BASE) + "/api/zonas";
  http.begin(url);
  int code = http.GET();
  if (code == 200) {
    String body = http.getString();
    // Búsqueda simple del estado de la zona; en producción conviene usar un JSON parser.
    String marker = String("\"id\":\"") + ZONE_ID + "\"";
    int idx = body.indexOf(marker);
    if (idx >= 0) {
      int statusIdx = body.indexOf("\"actuatorStatus\":\"", idx);
      if (statusIdx >= 0) {
        int start = statusIdx + 19;
        int end = body.indexOf("\"", start);
        String status = body.substring(start, end);
        bool shouldRun = status.indexOf("abierta") >= 0;
        setPump(shouldRun);
        Serial.print("Orden remota -> ");
        Serial.println(shouldRun ? "Bomba ON" : "Bomba OFF");
      }
    }
  } else {
  Serial.print("Poll fallo: ");
  Serial.println(code);
}
  http.end();
}

void setup() {
  Serial.begin(115200);
  pinMode(Hpin, INPUT);
  pinMode(Apin, OUTPUT);
  setPump(false);  // Apagar bomba al inicio
  logNearbyNetworks();
  connectWiFi();
}

void loop() {
  unsigned long now = millis();
  int humedad = analogRead(Hpin);
  int humedadPct = humidityPercent(humedad);

  // Lógica local de seguridad/umbral básica
  if (humedad > umbral) {
    Serial.println("Tierra seca -> Encendiendo bomba (umbral)");
    setPump(true);
  } else {
    Serial.println("Tierra húmeda -> Bomba apagada (umbral)");
    setPump(false);
  }

  // Enviar lectura cada POST_INTERVAL
  if (now - lastPost > POST_INTERVAL) {
    lastPost = now;
    Serial.print("Humedad: ");
    Serial.println(humedad);
    Serial.print("Humedad% calculada: ");
    Serial.println(humedadPct);
    sendReading(humedad, humedadPct);
    printSummary(humedad, humedadPct);
  }

  // Consultar comando remoto cada POLL_INTERVAL
  if (now - lastPoll > POLL_INTERVAL) {
    lastPoll = now;
    pollCommand();
  }

  delay(200);
}
