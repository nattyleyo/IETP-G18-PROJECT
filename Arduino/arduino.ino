#include <SPI.h>
#include <MFRC522.h>
#include <Servo.h>
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 16, 2);


#define RST_PIN         9          // Configurable, see typical pin layout above
#define SS_PIN          10         // Configurable, see typical pin layout above

MFRC522 mfrc522(SS_PIN, RST_PIN);  // Create MFRC522 instance
byte userId[4] = {0x8B, 0x28, 0x69, 0x3B};
const int IR_SENSOR_PIN1 = 3; // Replace with the actual pin number you used
const int IR_SENSOR_PIN2 = 6; // Replace with the actual pin number you used
Servo myServo;      
bool carDetect=false;          // Define servo name
bool servoMoved=false;          // Define servo name
char UID[20];
void setup() {

  Serial.begin(9600);    // Initialize serial communications with the PC
  while (!Serial);       // Do nothing if no serial port is opened (added for Arduinos based on ATMEGA32U4)
  SPI.begin();           // Init SPI bus
  mfrc522.PCD_Init();
  pinMode(IR_SENSOR_PIN1, INPUT);
  pinMode(IR_SENSOR_PIN2, INPUT);
  myServo.attach(7);     // Servo pin
  myServo.write(0);      // Initialize MFRC522
  delay(4);  
  lcd.init();                      // initialize the lcd 
  // Print a message to the LCD.
  
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Automated Toll");
  lcd.setCursor(0, 1);
  lcd.print("Collection System");
  delay(4000);
  lcd.clear();            // Optional delay. Some boards need more time after initialization, see Readme
  mfrc522.PCD_DumpVersionToSerial();  // Show details of PCD - MFRC522 Card Reader details
}

void loop() {
  lcd.setCursor(0, 0);
  lcd.print("|--- WELCOME --|");
  delay(1000);
  lcd.setCursor(0, 1);
  lcd.print("Scan your Card!");
 
  // Reset the loop if no new card is present on the sensor/reader. This saves the entire process when idle.
  if (!mfrc522.PICC_IsNewCardPresent()) {
    return;
  }

  // Select one of the cards
  if (!mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  // Dump debug info about the card; PICC_HaltA() is automatically called
  if (digitalRead(IR_SENSOR_PIN1) == 0) {
    carDetect=true;

  }

  Serial.print(mfrc522.uid.uidByte[0]);
Serial.print(" ");
Serial.print(mfrc522.uid.uidByte[1]);
Serial.print(" ");
Serial.print(mfrc522.uid.uidByte[2]);
Serial.print(" ");
Serial.println(mfrc522.uid.uidByte[3]);
while(carDetect){
  if (mfrc522.uid.uidByte[0] == userId[0] && mfrc522.uid.uidByte[1] == userId[1] &&
      mfrc522.uid.uidByte[2] == userId[2] && mfrc522.uid.uidByte[3] == userId[3]) {
    lcd.setCursor(0, 0);
    lcd.print("Access granted");
    lcd.setCursor(0, 1);
    lcd.print("               ");
    myServo.write(90);
    servoMoved=true;
  }
  else {
    lcd.setCursor(0, 0);
    lcd.print("Access denied");
    lcd.setCursor(0, 1);
    lcd.print("               ");
    myServo.write(0);
    delay(2000);
    carDetect=false;
  }
  if (digitalRead(6) == 0) {
    lcd.setCursor(0, 0);
    lcd.print("Gate closing...");
    lcd.setCursor(0, 1);
    lcd.print("               ");
    delay(4000);
    myServo.write(0);
    carDetect=false;
    break;
  }
}
  
  mfrc522.PICC_HaltA();
  }