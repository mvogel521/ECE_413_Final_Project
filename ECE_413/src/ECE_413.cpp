/******************************************************/
//       THIS IS A GENERATED FILE - DO NOT EDIT       //
/******************************************************/

#include "Particle.h"
#line 1 "c:/Users/milee/Documents/ECE413~1/ECE_413_Final_Project/ECE_413/src/ECE_413.ino"
#include "Httpclient.h"
/*
  Optical Heart Rate Detection (PBA Algorithm) using the MAX30105 Breakout
  By: Nathan Seidle @ SparkFun Electronics
  Date: October 2nd, 2016
  https://github.com/sparkfun/MAX30105_Breakout

  This is a demo to show the reading of heart rate or beats per minute (BPM) using
  a Penpheral Beat Amplitude (PBA) algorithm.

  It is best to attach the sensor to your finger using a rubber band or other tightening
  device. Humans are generally bad at applying constant pressure to a thing. When you
  press your finger against the sensor it varies enough to cause the blood in your
  finger to flow differently which causes the sensor readings to go wonky.

  Hardware Connections (Breakoutboard to Arduino):
  -5V = 5V (3.3V is allowed)
  -GND = GND
  -SDA = A4 (or SDA)
  -SCL = A5 (or SCL)
  -INT = Not connected

  The MAX30105 Breakout can handle 5V or 3.3V I2C logic. We recommend powering the board with 5V
  but it will also run at 3.3V.
*/

#include <Wire.h>
#include "MAX30105.h"

#include "heartRate.h"

#line 31 "c:/Users/milee/Documents/ECE413~1/ECE_413_Final_Project/ECE_413/src/ECE_413.ino"
MAX30105 particleSensor;

const byte RATE_SIZE = 4; //Increase this for more averaging. 4 is good.
byte rates[RATE_SIZE]; //Array of heart rates
byte rateSpot = 0;
long lastBeat = 0; //Time at which the last beat occurred

bool flag = false;
int analogvalue = 0;
double tempC = 0;
char *message = "my name is particle";
String aString;

float beatsPerMinute;
int beatAvg;
int led = D7; // The on-board LED

httpClient http;
http_request_t  request;
http_response_t response;
http_header_t headers[] = {
  {"Content-Type", "application/x-www-form-urlencoded"},
  {"Accept", "*/*"},
  {NULL,NULL}
};

String apiKey = "NR520HQHZUP0KEAO";
String server = "api.thingspeak.com";

void setup()
{
  Serial.begin(115200);
  Serial.println("Initializing...");

  pinMode(led, OUTPUT);

  Particle.variable("flag", flag);
  Particle.variable("analogvalue", analogvalue);
  Particle.variable("temp", tempC);

  // Initialize sensor
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) //Use default I2C port, 400kHz speed
  {
    Serial.println("MAX30105 was not found. Please check wiring/power. ");
    while (1);
  }

  if(Particle.variable("mess", message) == false){
    //variable not registered!
  }
  Particle.variable("mess2", aString);
  pinMode(A0, INPUT);

  Serial.println("Place your index finger on the sensor with steady pressure.");

  particleSensor.setup(); //Configure sensor with default settings
  particleSensor.setPulseAmplitudeRed(0x0A); //Turn Red LED to low to indicate sensor is running
  particleSensor.setPulseAmplitudeGreen(0); //Turn off Green LED
}


void loop()
{
  long irValue = particleSensor.getIR();
  delay(2000);

  digitalWrite(led, HIGH); // Turn ON the LED
  String temp = String(random(60, 80));
  Particle.variable("temp", temp);
  Particle.publish("temp", temp, PRIVATE);
  delay(30000); // Wait for 30 seconds
  digitalWrite(led, LOW); // Turn OFF the LED
  delay(30000); // Wait for 30 seconds

  if (checkForBeat(irValue) > 10000)
  {
    //We sensed a beat!
    // long delta = millis() - lastBeat;
    // lastBeat = millis();
    // beatsPerMinute = 60 / (delta / 1000.0);

    beatsPerMinute = irValue/1831.0;

    if (beatsPerMinute < 255 && beatsPerMinute > 20)
    {
      rates[rateSpot++] = (byte)beatsPerMinute; //Store this reading in the array
      rateSpot %= RATE_SIZE; //Wrap variable

      //Take average of readings
      beatAvg = 0;
      for (byte x = 0 ; x < RATE_SIZE ; x++)
        beatAvg += rates[x];
      beatAvg /= RATE_SIZE;
    }

    request.hostname = server;
    request.port = 80;
    request.path = "/update";
    request.body = "api_keys" + apiKey + "&field=" + String(beatsPerMinute);

    // Send the request to Thingspeak
    http.post(request, response, headers);
  
    //Print response (for debugging)
    Serial.print("Status code: ");
    Serial.println(response.status);
    Serial.print("Response: ");
    Serial.println(response.body);

    delay(30000); //Send data every 30 seconds

  }

  // SYNTAX
  bool success = Particle.function("funcKeuy", funcName);

  // Cloud functions must return int and take one String
  int funcName(String extra){
    return 0;
  }

  Serial.print("IR=");
  Serial.print(irValue);
  Serial.print(", BPM=");
  Serial.print(beatsPerMinute);
  Serial.print(", Avg BPM=");
  Serial.print(beatAvg);

  if (irValue < 50000)
    Serial.print(" No finger?");

  Serial.println();
}