#!/usr/bin/node

// https://www.npmjs.com/package/usb-detection
// const usbDetect = require('usb-detection');

const robot = require("robotjs");
const usb   = require('usb');
const opn   = require('opn');
// const spawn = require('child_process').spawn;

const { verbose } = require('yargs')
    .count('verbose')
    .alias('v', 'verbose')
    .argv;

// console.log(process.platform);
// process.exit(0);

const actionList = {
    0x01: () => robot.keyTap("audio_play"),// play/pause
    0x02: () => robot.keyTap("audio_prev"),
    0x03: () => robot.keyTap("audio_next"),
    0x04: () => robot.keyTap("audio_mute"),
    0x05: () => robot.keyTap("audio_vol_down"),
    0x06: () => robot.keyTap("audio_vol_up"),

    0x10: () => opn('', { app: [ 'libreoffice', '--writer' ] }),
    0x11: () => opn('', { app: [ 'libreoffice', '--calc' ] }),
    0x12: () => opn('about:blank', { app: 'google-chrome' }),
    0x13: () => opn('about:blank', { app: [ 'google-chrome', '--incognito' ] }),
    0x14: () => opn('about:blank', { app: 'firefox' }),
    0x15: () => opn('', { app: 'spotify' }),
};

let inEndpoint;
let outEndpoint;
let usedDeviceInfo;

const allowedVendorDevices = {
    0x2717: '*', // Xiaomi
    // 0x2717: [],
};

const error = (...args) => verbose >= 1 && console.error(...args);
const warn = (...args) => verbose >= 2 && console.warn(...args);
const info = (...args) => verbose >= 3 && console.log(...args);
const debug = (...args) => verbose >= 4 && console.log(...args);

const analyzeAttachedDevice = (device) => {
    const descriptior = device.deviceDescriptor;

    debug(`Analyzing device on address ${('000' + device.deviceAddress).substr(-3)} -> (0x${descriptior.idVendor.toString(16)}:0x${descriptior.idProduct.toString(16)})`);

    if (usedDeviceInfo) {
        debug('Some device already defined');
        return false;
    }

    const vendorList = allowedVendorDevices[descriptior.idVendor];

    if (typeof vendorList === 'undefined' || (vendorList !== '*' && vendorList.indexOf(descriptior.idProduct) === -1)) {
        debug('Device not found in allowed list');
        return false;
    }

    device.open(true);
    const interface = device.interface(0);

    if (!interface) {
        debug('Interface not available for this device');
        device.close();
        return false;
    }

    inEndpoint = null;
    outEndpoint = null;

    interface.claim();

    for (let endpoint of interface.endpoints) {
        if (inEndpoint && outEndpoint) {
            break;
        }

        debug(`Verifying endpoint`);

        if (endpoint.direction == 'in') {
            if (!inEndpoint) {
                debug('Endpoint set as input');
                inEndpoint = endpoint;
            }
        } else {
            if (!outEndpoint) {
                debug('Endpoint set as output');
                outEndpoint = endpoint;
            }
        }
    }

    if (!inEndpoint || !outEndpoint) {
        debug('Endpoint not set for input or output');
        inEndpoint = null;
        outEndpoint = null;
        device.close();
        return false;
    }

    inEndpoint.startPoll(1, 8);
    inEndpoint.on('data', (dataBuf) => {
        debug(`Received data "${dataBuf}"`);

        if (typeof actionList[dataBuf] !== 'undefined') {
            actionList[dataBuf]();
        }
    });

    usedDeviceInfo = {
        addr: device.deviceAddress,
        vendor: descriptior.idVendor,
        product: descriptior.idProduct,
    };

    // manda uma mensagem pro dispositivo pra dizer que ativo
    sendDataToDevice(0xff).then(() => {
        info('Connection successfully established!');
    }).catch((e) => {
        inEndpoint = null;
        outEndpoint = null;
        inEndpoint.stopPoll();
        device.close();
        error(e);
    });

    return true;
};

const analyzeDetachedDevice = (device) => {
    if (usedDeviceInfo) {
        const descriptior = device.deviceDescriptor;

        if (usedDeviceInfo.addr === device.deviceAddress && usedDeviceInfo.vendor === descriptior.idVendor && usedDeviceInfo.product === descriptior.idProduct) {
            usedDeviceInfo = null;
            inEndpoint = null;
            outEndpoint = null;
        }
    }
};

const sendDataToDevice = (data) => {
    return new Promise((resolve, reject) => {
        if (!usedDeviceInfo || !outEndpoint) {
            return reject(new Error('USB device or output endpoint not defined'));
        }

        outEndpoint.transfer(data, error => (!error ? resolve() : reject(error)));
    });
};

usb.setDebugLevel(verbose);
usb.on('attach', device => analyzeAttachedDevice(device));
usb.on('detach', device => analyzeDetachedDevice(device));
usb.getDeviceList().some(device => analyzeAttachedDevice(device));
