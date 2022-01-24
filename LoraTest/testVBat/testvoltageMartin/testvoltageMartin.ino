/*
 * HelTec Automation(TM) Electricity detection example.
 *
 * Function summary:
 *
 * - Vext connected to 3.3V via a MOS-FET, the gate pin connected to GPIO21;
 *
 * - Battery power detection is achieved by detecting the voltage of GPIO13;
 *
 * - OLED display and PE4259(RF switch) use Vext as power supply;
 *
 * - WIFI Kit series V1 don't have Vext control function;
 *
 * HelTec AutoMation, Chengdu, China.
 * 成都惠利特自动化科技有限公司
 * https://heltec.org
 * support@heltec.cn
 *
 * this project also release in GitHub:
 * https://github.com/Heltec-Aaron-Lee/WiFi_Kit_series
 * 
*/
#include "Arduino.h"
#include <Wire.h>
#include "heltec.h"


#define Fbattery    3700  //The default battery is 3700mv when the battery is fully charged.


#define uS_TO_S_FACTOR 1000000  /* Conversion factor for micro seconds to seconds */
#define TIME_TO_SLEEP  5     
float XS = 0.0025;      //The returned reading is multiplied by this XS to get the battery voltage.
uint16_t MUL = 1000;
float conversion  = 1.27;

void setup()
{
  pinMode(21, OUTPUT);
  digitalWrite(21, LOW);
  delay(800);

  
  Heltec.begin(true /*DisplayEnable Enable*/, false /*LoRa Enable*/, true /*Serial Enable*/);

  Heltec.display->init();
  Heltec.display->flipScreenVertically();
  Heltec.display->setFont(ArialMT_Plain_10);
  Heltec.display->drawString(0, 0, "OLED Start");
  Heltec.display->display();
  delay(1000);
  Heltec.display->clear();

   //analogSetClockDiv(255); // 1338mS
   analogSetCycles(8);                   // Set number of cycles per sample, default is 8 and provides an optimal result, range is 1 - 255
   analogSetSamples(1);                  // Set number of samples in the range, default is 1, it has an effect on sensitivity has been multiplied
   analogSetClockDiv(1);                 // Set the divider for the ADC clock, default is 1, range is 1 - 255
   analogSetAttenuation(ADC_11db);       // Sets the input attenuation for ALL ADC inputs, default is ADC_11db, range is ADC_0db, ADC_2_5db, ADC_6db, ADC_11db
   analogSetPinAttenuation(36,ADC_11db);
   analogSetPinAttenuation(37,ADC_11db);
                                        // ADC_0db provides no attenuation so IN/OUT = 1 / 1 an input of 3 volts remains at 3 volts before ADC measurement
                                        // ADC_2_5db provides an attenuation so that IN/OUT = 1 / 1.34 an input of 3 volts is reduced to 2.238 volts before ADC measurement
                                        // ADC_6db provides an attenuation so that IN/OUT = 1 / 2 an input of 3 volts is reduced to 1.500 volts before ADC measurement
                                        // ADC_11db provides an attenuation so that IN/OUT = 1 / 3.6 an input of 3 volts is reduced to 0.833 volts before ADC measurement
//   adcAttachPin(VP);                     // Attach a pin to ADC (also clears any other analog mode that could be on), returns TRUE/FALSE result 
//   adcStart(VP);                         // Starts an ADC conversion on attached pin's bus
//   adcBusy(VP);                          // Check if conversion on the pin's ADC bus is currently running, returns TRUE/FALSE result 
//   adcEnd(VP);
   
   adcAttachPin(37);
   adcAttachPin(36);

   

   Serial.begin(115200);
}

void loop()
{
   //WiFi LoRa 32        -- hardare versrion ≥ 2.3
   //WiFi Kit 32         -- hardare versrion ≥ 2
   //Wireless Stick      -- hardare versrion ≥ 2.3
   //Wireless Stick Lite -- hardare versrion ≥ 2.3
   //Battery voltage read pin changed from GPIO13 to GPI37
   adcStart(37);
   while(adcBusy(37));
   Serial.printf("Battery power in GPIO 37: ");
   Serial.println(analogRead(37));
   Serial.println(analogRead(37)*3.2);
   
   
   uint16_t c2 = analogRead(37);
   
   
   adcEnd(37);

   delay(100);
   
//   adcStart(36);
//   while(adcBusy(36));
//   Serial.printf("voltage input on GPIO 36: ");
//   Serial.println(analogRead(36));
//   uint16_t c1  =  map(analogRead(36), 3500, 120, 0, 100)  ;
//   adcEnd(36);
//
//   
    Serial.println("-------------");
   Heltec.display->drawString(0, 0, "Vbat = ");
//  
   Heltec.display->drawString(45, 40, (String)(c2*XS*MUL*conversion));
   Heltec.display->drawString(70, 70, "(mV)");
   Heltec.display->drawString(0, 40, (String)(c2));
   

    
   Heltec.display->display();
   delay(1000);
   
   esp_sleep_enable_timer_wakeup(TIME_TO_SLEEP * uS_TO_S_FACTOR);
  Serial.println("Setup ESP32 to sleep for every " + String(TIME_TO_SLEEP) +
  " Seconds");
  delay(10);

  /*
  Next we decide what all peripherals to shut down/keep on
  By default, ESP32 will automatically power down the peripherals
  not needed by the wakeup source, but if you want to be a poweruser
  this is for you. Read in detail at the API docs
  http://esp-idf.readthedocs.io/en/latest/api-reference/system/deep_sleep.html
  Left the line commented as an example of how to configure peripherals.
  The line below turns off all RTC peripherals in deep sleep.
  */
//  esp_deep_sleep_pd_config(ESP_PD_DOMAIN_RTC_PERIPH, ESP_PD_OPTION_OFF);
//  Serial.println("Configured all RTC Peripherals to be powered down in sleep");

  /*
  Now that we have setup a wake cause and if needed setup the
  peripherals state in deep sleep, we can now start going to
  deep sleep.
  In the case that no wake up sources were provided but deep
  sleep was started, it will sleep forever unless hardware
  reset occurs.
  */
  

  


  Heltec.display->clear();
  delay(100);
  Serial.println("Going to sleep now");
  
  //esp_deep_sleep_start();
  Serial.println("This will never be printed");
   
   
}
