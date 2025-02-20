# Arduino Robot with BLE Control

Hi!

In this project, I attempted to create an Arduino robot that can move around and be controlled via a Bluetooth Low Energy (BLE) connection from my laptop. The laptop is hosting a web server and website, such that anyone can visit the website to control the robot. Currently, there are some issues, but it should function as an initial proof of concept. I will update the files as I make more progress on this project.

## Updates on this project:

I initially used Node.js for the local web server and tried to use the Noble package for BLE communication. While I was able to get the local server and website working, the BLE connection didn’t seem to cooperate, throwing the error:

```Error: No compatible USB Bluetooth 4.0 device found!```

After researching the issue, I found that the Noble package is outdated and no longer maintained, which causes compatibility problems with modern systems. It requires a very specific USB Bluetooth driver, and many people have faced similar issues. Solutions like [this YouTube video(outdated)](https://www.youtube.com/watch?v=mL9B8wuEdms&t=106s) and the [abandonware noble](https://github.com/abandonware/noble?tab=readme-ov-file#windows) suggest workarounds, but they require a physical USB Bluetooth dongle and also the use of the Zadig tool, which disables my laptop’s Bluetooth driver. I didn’t want to buy an additional device or use an external dongle.

As a result, I couldn't get the BLE connection to work with JavaScript (Node.js + Noble) for this project. Instead, I switched to a [Python + Flask](https://github.com/a112r/web-controlled-ble-bot-py) based approach to create the web server, and I had much more success with that.

At some point in the future, I do hope to revisit this project and get the JavaScript approach working, if only for personal satisfaction after investing so many hours into it. On the bright side, I did learn a lot of JavaScript during this process, so it wasn’t a total loss! 

