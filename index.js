#!/usr/bin/node

// https://www.npmjs.com/package/usb-detection
const usbDetect = require('usb-detection');

usbDetect.startMonitoring();

// usbDetect.find().then((err, devices) => {
//     console.log(devices, err);
//     usbDetect.stopMonitoring();
// });

usbDetect.on('add', (device) => {
    console.log(device);
    usbDetect.stopMonitoring();
});


