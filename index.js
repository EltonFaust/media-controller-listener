#!/usr/bin/node

// https://www.npmjs.com/package/usb-detection
// const usbDetect = require('usb-detection');


const robot = require("robotjs");
const usb   = require('usb');

// console.log(usb.getDeviceList());

let inEndpoint;
let outEndpoint;

usb.on('attach', (device) => {
    console.log(device)

    // device.open(true);
    // device.interfaces[0].claim();

    // for (let i = 0; i < device.interfaces[0].endpoints.length; i++) {
    //     if (inEndpoint && outEndpoint) {
    //         break;
    //     }

    //     if (device.interfaces[0].endpoints[i].direction == 'in') {
    //         if (!inEndpoint) {
    //             inEndpoint = device.interfaces[0].endpoints[i];
    //         }
    //     } else {
    //         if (!inEndpoint) {
    //             outEndpoint = device.interfaces[0].endpoints[i];
    //         }
    //     }
    // }

    // device.interfaces[0].endpoints[0].startPoll(1, 8);
    // device.interfaces[0].endpoints[0].on("data", (dataBuf) => {

    // });

    // device.interfaces[0].endpoints[0].transfer(data, (error) => {
    //     console.log(error)
    // })
});

// usb.on('detach', (device) => {
//     console.log(device)
// });

// robot.keyTap("audio_play");
// robot.keyTap("audio_stop");
// robot.keyTap("audio_prev");
// robot.keyTap("audio_next");
// robot.keyTap("audio_mute");
// robot.keyTap("audio_vol_down");
// robot.keyTap("audio_vol_up");


// const ks = require('node-key-sender');

// ks.sendKey('@1016');


// usbDetect.startMonitoring();

// usbDetect.find().then((err, devices) => {
//     console.log(devices, err);
//     usbDetect.stopMonitoring();
// });

// usbDetect.on('add', (device) => {
//     console.log(device);
//     usbDetect.stopMonitoring();
// });


// K_AUDIO_VOLUME_MUTE = 1007,
// K_AUDIO_VOLUME_DOWN = 1001,
// K_AUDIO_VOLUME_UP = 1000,
// K_AUDIO_PLAY = 1016,
// K_AUDIO_STOP = K_NOT_A_KEY,
// K_AUDIO_PAUSE = 1016,
// K_AUDIO_PREV = 1018,
// K_AUDIO_NEXT = 1017,
