// Control básico de humedad para ESP32 con sensor FC-28 y bomba en relé.
// Lee el valor analógico y activa/desactiva la bomba según el umbral definido.

// Pin del sensor FC-28 (salida analógica A0 → pin ADC de ESP32)
const int Hpin = 35;

// Pin del relé o bomba
const int Apin = 32;

// CONFIGURACIÓN: Umbral de humedad
// Si la lectura es MAYOR al umbral → está SECO → encender bomba
// Si la lectura es MENOR al umbral → está HÚMEDO → apagar bomba
int umbral = 3500;  // AJUSTA este valor según tu sensor

void setup() {
  Serial.begin(57600);
  pinMode(Hpin, INPUT);
  pinMode(Apin, OUTPUT);

  // Apagar bomba al inicio
  digitalWrite(Apin, LOW);
}

void loop() {
  int humedad = analogRead(Hpin);

  Serial.print("Humedad: ");
  Serial.println(humedad);

  // LÓGICA DE ACTIVACIÓN DE LA BOMBA
  if (humedad > umbral) {
    // Valor alto = tierra seca
    Serial.println("Tierra seca -> Encendiendo bomba");
    digitalWrite(Apin, HIGH);  // Enciende relé (si tu relé es activo en alto)

  } else {
    // Valor bajo = tierra húmeda
    Serial.println("Tierra húmeda -> Bomba apagada");
    digitalWrite(Apin, LOW);  // Apaga relé
  }

  delay(5000);
}
