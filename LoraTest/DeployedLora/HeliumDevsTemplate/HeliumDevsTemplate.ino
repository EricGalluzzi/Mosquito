#include "Arduino.h"
#include <ESP32_LoRaWAN.h>
#include <ArduinoJson.h>  

//#include "heltec.h"


#define moisturePin 36
#define VEXT_PIN 21


int hasJoined = 0; //only shuts off system after connectiton
/*license for Heltec ESP32 LoRaWan, quary your ChipID relevant license: http://resource.heltec.cn/search */
uint32_t  license[4] = {};
/* OTAA para*/
uint8_t DevEui[] = { };
uint8_t AppEui[] = { };
uint8_t AppKey[] = { };

/* ABP para*/
uint8_t NwkSKey[] = { 0x15, 0xb1, 0xd0, 0xef, 0xa4, 0x63, 0xdf, 0xbe, 0x3d, 0x11, 0x18, 0x1e, 0x1e, 0xc7, 0xda,0x85 };
uint8_t AppSKey[] = { 0xd7, 0x2c, 0x78, 0x75, 0x8c, 0xdc, 0xca, 0xbf, 0x55, 0xee, 0x4a, 0x77, 0x8d, 0x16, 0xef,0x67 };
uint32_t DevAddr =  ( uint32_t )0x007e6ae1;
/*LoraWan Class, Class A and Class C are supported*/
DeviceClass_t loraWanClass = CLASS_A;

/*the application data transmission duty cycle.  value in [ms].*/
uint32_t appTxDutyCycle = 3600000; //1 hr cycles

/*OTAA or ABP*/
bool overTheAirActivation = true;

/*ADR enable*/
bool loraWanAdr =false; //incorporate this eventually

/* Indicates if the node is sending confirmed or unconfirmed messages */
bool isTxConfirmed = false; //info is fishy since doesnt update as many times as before

/*LoraWan channelsmask, default channels 0-7*/
uint16_t userChannelsMask[6]={ 0xFF00,0x0000,0x0000,0x0000,0x0002,0x0000 };


/* Application port */
uint8_t appPort = 2;

/*!
* Number of trials to transmit the frame, if the LoRaMAC layer did not
* receive an acknowledgment. The MAC performs a datarate adaptation,
* according to the LoRaWAN Specification V1.0.2, chapter 18.4, according
* to the following table:
*
* Transmission nb | Data Rate
* ----------------|-----------
* 1 (first)       | DR
* 2               | DR
* 3               | max(DR-1,0)
* 4               | max(DR-1,0)
* 5               | max(DR-2,0)
* 6               | max(DR-2,0)
* 7               | max(DR-3,0)
* 8               | max(DR-3,0)
*
* Note, that if NbTrials is set to 1 or 2, the MAC will not decrease
* the datarate, in case the LoRaMAC layer did not receive an acknowledgment
*/
uint8_t confirmedNbTrials = 8;

/*LoraWan debug level, select in arduino IDE tools.
* None : print basic info.
* Freq : print Tx and Rx freq, DR info.
* Freq && DIO : print Tx and Rx freq, DR, DIO0 interrupt and DIO1 interrupt info.
* Freq && DIO && PW: print Tx and Rx freq, DR, DIO0 interrupt, DIO1 interrupt, MCU sleep and MCU wake info.
*/
uint8_t debugLevel = LoRaWAN_DEBUG_LEVEL;

/*LoraWan region, select in arduino IDE tools*/
LoRaMacRegion_t loraWanRegion = ACTIVE_REGION;

const size_t capacity = JSON_OBJECT_SIZE(2) + 10;
DynamicJsonDocument payload(capacity);

static void prepareTxFrame( uint8_t port )
{

  serializeMsgPack(payload, appData);
  appDataSize = measureMsgPack(payload);
    
}

// Add your initialization code here
void setup()
{
  
  pinMode(VEXT_PIN, OUTPUT);
  digitalWrite(VEXT_PIN, LOW); //if pin 21 is low, vExt is high
  delay(100);

  adcPrep();
   
  if(mcuStarted==0)
  {
    LoRaWAN.displayMcuInit();
  }
  Serial.begin(115200);
  Serial.println(hasJoined);
  while (!Serial);
  SPI.begin(SCK,MISO,MOSI,SS);
  
  payload["sM"] = recordSoilMoisture();
  payload["vBat"] = recordVBat();
  
  serializeJsonPretty(payload, Serial);
  
  
  Mcu.init(SS,RST_LoRa,DIO0,DIO1,license);
  deviceState = DEVICE_STATE_INIT;
 
  
}

int recordVBat(){
   adcStart(37);
   while(adcBusy(37));
   Serial.printf("Battery power in GPIO 37: ");
   Serial.println(analogRead(37));
  
   uint16_t batteryV = (int) (analogRead(37)*.0025*1.27*1000);
   adcEnd(37);

   delay(100);
   return batteryV;
}

intrecordSoilMoisture(){
   adcStart(moisturePin);
   while(adcBusy(moisturePin));
   Serial.printf("voltage input on GPIO 36: ");
   Serial.println(analogRead(moisturePin));
   uint16_t moistureLvl  = map(analogRead(moisturePin), 3500, 120, 0, 100);
   moistureLvl = constrain(moistureLvl, 0, 100);
   adcEnd(36);

    delay(100);
    return moistureLvl;
}
void loop()
{

   
  switch( deviceState )
  {
    case DEVICE_STATE_INIT:
    {
      LoRaWAN.init(loraWanClass,loraWanRegion);
      break;
    }
    case DEVICE_STATE_JOIN:
    {
      LoRaWAN.displayJoining();
      
      LoRaWAN.join();
      
     
      break;
    }
    case DEVICE_STATE_SEND:
    {
      LoRaWAN.displaySending();
      prepareTxFrame( appPort );
      LoRaWAN.send(loraWanClass);
      deviceState = DEVICE_STATE_CYCLE;
      break;
    }
    case DEVICE_STATE_CYCLE:
    {
      // Schedule next packet transmission
      txDutyCycleTime = appTxDutyCycle + randr( -APP_TX_DUTYCYCLE_RND, APP_TX_DUTYCYCLE_RND );
      LoRaWAN.cycle(txDutyCycleTime);
      low_power(); //activate low power mode to conserve battery
      deviceState = DEVICE_STATE_SLEEP;
      
      
      
      break;
    }
    case DEVICE_STATE_SLEEP:
    {
     
      
      LoRaWAN.sleep(loraWanClass,debugLevel);
      
     
      break;
    }
    default:
    {
      deviceState = DEVICE_STATE_INIT;
      break;
    }
  }
  
}

void low_power(){

  digitalWrite(VEXT_PIN, HIGH);
  pinMode(VEXT_PIN, INPUT);

  pinMode(36, INPUT); //SM
//  pinMode(19, INPUT); //MISO
//  pinMode(5, INPUT); //SCK
//  pinMode(14, INPUT); //RST
//  pinMode(27, INPUT); //MOSI //prob handled by lora.sleep (lets pray so far)

}


void adcPrep(){
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
                                        
   
   adcAttachPin(37);
   adcAttachPin(36);
}
