#include <Servo.h>

Servo servo0; // Servo controlling dot 1
Servo servo1; // Servo controlling dot 2
Servo servo2; // Servo controlling dot 3
Servo servo3; // Servo controlling dot 4
Servo servo4; // Servo controlling dot 5
Servo servo5; // Servo controlling dot 6

const int raised0 = 19;
const int raised1 = 19;
const int raised2 = 19;
const int raised3 = 22;
const int raised4 = 30;
const int raised5 = 20;

const int lowered0 = 40;
const int lowered1 = 40;
const int lowered2 = 40;
const int lowered3 = 0;
const int lowered4 = 0;
const int lowered5 = 0;

unsigned long previousMillis = 0;
const long interval = 1000; 

void setup() {
    clearDots();
    servo0.attach(A3); // Dot 1
    servo1.attach(A4); // Dot 2
    servo2.attach(A5); // Dot 3
    servo3.attach(A2); // Dot 4
    servo4.attach(A1); // Dot 5
    servo5.attach(A0); // Dot 6
    Serial.begin(9600);
    while (!Serial);
}

void loop() {
    if (Serial.available() > 0) {
        char input = Serial.read();  
        if (((input >= '0' && input <= '9') || input == '.' || input == '#' || (input >= 'a' && input <= 'z')) && input != '\0') {
            Serial.println(input);
            displayBraille(input);  
        }
    }
}

void displayBraille(char letter) {
    Serial.println("Called");
    Serial.print("Letter: ");
    Serial.println(letter);
    clearDots();  

        switch (letter) {
        case 'a': setDots(1, 0, 0, 0, 0, 0); break; // ⠁
        case 'b': setDots(1, 1, 0, 0, 0, 0); break; // ⠃
        case 'c': setDots(1, 0, 0, 1, 0, 0); break; // ⠉
        case 'd': setDots(1, 0, 0, 1, 1, 0); break; // ⠙
        case 'e': setDots(1, 0, 0, 0, 1, 0); break; // ⠑
        case 'f': setDots(1, 1, 0, 1, 0, 0); break; // ⠋
        case 'g': setDots(1, 1, 0, 1, 1, 0); break; // ⠛
        case 'h': setDots(1, 1, 0, 0, 1, 0); break; // ⠓
        case 'i': setDots(0, 1, 0, 1, 0, 0); break; // ⠊
        case 'j': setDots(0, 1, 0, 1, 1, 0); break; // ⠚
        case 'k': setDots(1, 0, 1, 0, 0, 0); break; // ⠅
        case 'l': setDots(1, 1, 1, 0, 0, 0); break; // ⠇
        // case 'm': setDots(1, 1, 1, 1, 1, 1); break; // ⠍
        case 'm': setDots(1, 0, 1, 1, 0, 0); break; // ⠍
        case 'n': setDots(1, 0, 1, 1, 1, 0); break; // ⠝
        case 'o': setDots(1, 0, 1, 0, 1, 0); break; // ⠕
        case 'p': setDots(1, 1, 1, 1, 0, 0); break; // ⠏
        case 'q': setDots(1, 1, 1, 1, 1, 0); break; // ⠟
        case 'r': setDots(1, 1, 1, 0, 1, 0); break; // ⠗
        case 's': setDots(0, 1, 1, 1, 0, 0); break; // ⠎
        case 't': setDots(0, 1, 1, 1, 1, 0); break; // ⠞
        case 'u': setDots(1, 0, 1, 0, 0, 1); break; // ⠥
        case 'v': setDots(1, 1, 1, 0, 0, 1); break; // ⠧
        case 'w': setDots(0, 1, 0, 1, 1, 1); break; // ⠺
        case 'x': setDots(1, 0, 1, 1, 0, 1); break; // ⠭
        case 'y': setDots(1, 0, 1, 1, 1, 1); break; // ⠽
        case 'z': setDots(1, 0, 1, 0, 1, 1); break; // ⠵
        case '#': setDots(0, 0, 1, 1, 1, 1); break;
        case '1': setDots(1, 0, 0, 0, 0, 0); break; // ⠁
        case '2': setDots(1, 1, 0, 0, 0, 0); break; // ⠁
        case '3': setDots(1, 0, 0, 1, 0, 0); break; // ⠁
        case '4': setDots(1, 0, 0, 1, 1, 0); break; // ⠁
        case '5': setDots(1, 0, 0, 0, 1, 0); break; // ⠁
        case '6': setDots(1, 1, 0, 1, 0, 0); break; // ⠁
        case '7': setDots(1, 1, 0, 1, 1, 0); break; // ⠁
        case '8': setDots(1, 1, 0, 0, 1, 0); break; // ⠁
        case '9': setDots(0, 1, 0, 1, 0, 0); break; // ⠁
        case '0': setDots(0, 1, 0, 1, 1, 0); break; // ⠁
        case '.': setDots(0, 0, 0, 0, 0, 0); break; // ⠵
        default: clearDots(); break; // Turn off all dots for unrecognized characters
    }

    Serial.println("Done - from displayBraille");
}

void setDots(int dot0, int dot1, int dot2, int dot3, int dot4, int dot5) {
    unsigned long currentMillis = millis();

    if (currentMillis - previousMillis >= interval) {
        previousMillis = currentMillis;

        servo0.write(dot0 ? raised0 : lowered0);
        servo1.write(dot1 ? raised1 : lowered1);
        servo2.write(dot2 ? raised2 : lowered2);
        servo3.write(dot3 ? raised3 : lowered3);
        servo4.write(dot4 ? raised4 : lowered4);
        servo5.write(dot5 ? raised5 : lowered5);
    }
}

void clearDots() {
    servo0.write(lowered0);
    servo1.write(lowered1);
    servo2.write(lowered2);
    servo3.write(lowered3);
    servo4.write(lowered4);
    servo5.write(lowered5);
}
