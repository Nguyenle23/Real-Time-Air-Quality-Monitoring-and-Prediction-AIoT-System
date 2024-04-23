# Resources folder for hardware device: STM32 Sensor Interface with ESP8266 NodeMCU

This project demonstrates how to interface various sensors with an STM32 microcontroller and communicate the data wirelessly to an ESP8266 NodeMCU module. This README provides instructions on setting up the hardware connections and configuring the software.

## Hardware Setup

### Components Required:
- STM32 microcontroller board (STM32F426ZIT6x)
- ESP8266 NodeMCU
- DTH11 Temperature and Humidity Sensor
- MQ135 Air Quality Sensor
- MQ7 Carbon Monoxide Sensor
- GP2Y Dust Sensor
- GUVA-SD12 UV Sensor
- Jumper wires
- Breadboard (if needed)

### Connections:

```
STM32          Sensor
--------------------------
PD12           DTH11 Data
PA2            MQ135 Analog Output
PA1            MQ7 Analog Output
PA3 & PE6      GP2Y Analog Output
PA4            GUVA-SD12 Analog Output
USART PD5      ESP8266 NodeMCU
```

Ensure proper power supply connections are made for each sensor and the ESP8266 NodeMCU.

## Software Configuration

### STM32 Firmware:
1. Clone this repository to your local machine.
2. Open the STM32 firmware project in your preferred IDE (e.g., STM32CubeIDE).
3. Configure the USART communication for serial communication with the ESP8266 NodeMCU.
4. Implement code to read data from each sensor connected to the STM32.
5. Ensure proper error handling and sensor calibration routines are included.
6. Compile and flash the firmware to your STM32 board.

### ESP8266 Firmware:
1. Clone this repository to your local machine.
2. Open the ESP8266 firmware project in your preferred IDE (e.g., Arduino IDE).
3. Configure the ESP8266 to establish a Wi-Fi connection and receive data from the STM32 via serial communication.
4. Implement code to receive sensor data from the STM32 and transmit it to a server or cloud platform.
5. Ensure proper error handling and Wi-Fi connection management.
6. Upload the firmware to your ESP8266 NodeMCU.

## Usage

1. Power up the STM32 board and ESP8266 NodeMCU.
2. Once connected to Wi-Fi, the ESP8266 will start receiving sensor data from the STM32.
3. You can view the transmitted data on your preferred server or cloud platform.
4. Monitor the sensor readings and take necessary actions based on the data received.
