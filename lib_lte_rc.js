/**
 * Created by Wonseok, Jung in KETI on 2021-06-25.
 */

let mqtt = require('mqtt');
let fs = require('fs');
let SerialPort = require('serialport');

let sbusPort = null;

let sbusPortNum = libPort;
let sbusBaudrate = libBaudrate;

global.ch_min_val = 223; // 00 DF
global.ch_mid_val = 1023; // 03 FF
global.ch_max_val = 1823; // 07 1F

global.ch_gap = 100;
// data_range_each_CH = 0~2047

const RC = 0;
const GIMBAL = 1;

global.REMOTE_FLAG = RC;

let TIMEOUT = 50;

function key_to_signal(ch_num, ch_val) {
    try {
        if (ch_num === 1) {  // Roll
            ch1_target_val = ch_val;
        } else if (ch_num === 2) {  // Pitch
            ch2_target_val = ch_val;
        } else if (ch_num === 3) {// Throttle
            ch3_target_val = ch_val;
        } else if (ch_num === 4) {  // Yaw
            ch4_target_val = ch_val;
        } else if (ch_num === 5) {  // LED
            ch5_target_val = ch_val;
        } else if (ch_num === 6) {  // Arm/Disarm
            ch6_target_val = ch_val;
        } else if (ch_num === 7) {  // RTL
            ch7_target_val = ch_val;
        } else if (ch_num === 8) {  // AUTO
            ch8_target_val = ch_val;
        } else if (ch_num === 9) {  // Mode (Loiter, PosHold, AltHold)
            ch9_target_val = ch_val;
        } else if (ch_num === 10) {
            ch10_target_val = ch_val;
        } else if (ch_num === 11) {  // Landing Gear
            ch11_target_val = ch_val;
        } else if (ch_num === 12) {
            ch12_target_val = ch_val;
        } else if (ch_num === 13) {
            ch13_target_val = ch_val;
        } else if (ch_num === 14) {
            ch14_target_val = ch_val;
        } else if (ch_num === 15) {
            ch15_target_val = ch_val;
        } else if (ch_num === 16) {
            ch16_target_val = ch_val;
        } else {
            ch17_key();

            if (REMOTE_FLAG === RC) {
                ch1 = parseInt(ch_mid_val);
                ch2 = parseInt(ch_mid_val);
                ch3 = parseInt(ch_mid_val);
                ch4 = parseInt(ch_mid_val);
            } else if (REMOTE_FLAG === GIMBAL) {
                ch2 = parseInt(ch_mid_val);
                ch4 = parseInt(ch_mid_val);
                ch9 = parseInt(ch_mid_val);
            }
        }
    } catch (e) {
        ch1 = parseInt(ch_mid_val);
        ch2 = parseInt(ch_mid_val);
        ch3 = parseInt(ch_mid_val);
        ch4 = parseInt(ch_mid_val);
        ch5 = parseInt(ch_max_val);
        ch6 = parseInt(ch_min_val);
        ch7 = parseInt(ch_min_val);
        ch8 = parseInt(ch_min_val);
        ch9 = parseInt(ch_min_val);
        ch10 = parseInt(ch_min_val);
        ch11 = parseInt(ch_min_val);
        ch12 = parseInt(ch_min_val);
        ch13 = parseInt(ch_min_val);
        ch14 = parseInt(ch_min_val);
        ch15 = parseInt(ch_min_val);
        ch16 = parseInt(ch_min_val);
        ch17 = parseInt(330);
    }
}


function ch17_key() {
    ch17 = Math.floor(Math.random() * (347 - 325 + 1)) + 325;
}


setInterval(channel_val, TIMEOUT);


global.rxbuf = '';

global.ch1 = parseInt(ch_mid_val);
global.ch2 = parseInt(ch_mid_val);
global.ch3 = parseInt(ch_mid_val);
global.ch4 = parseInt(ch_mid_val);
global.ch5 = parseInt(ch_max_val);
global.ch6 = parseInt(ch_min_val);
global.ch7 = parseInt(ch_min_val);
global.ch8 = parseInt(ch_min_val);
global.ch9 = parseInt(ch_min_val);
global.ch10 = parseInt(ch_min_val);
global.ch11 = parseInt(ch_min_val);
global.ch12 = parseInt(ch_min_val);
global.ch13 = parseInt(ch_min_val);
global.ch14 = parseInt(ch_min_val);
global.ch15 = parseInt(ch_min_val);
global.ch16 = parseInt(ch_min_val);
global.ch17 = parseInt(330);

global.ch1_target_val = parseInt(ch_mid_val);
global.ch2_target_val = parseInt(ch_mid_val);
global.ch3_target_val = parseInt(ch_mid_val);
global.ch4_target_val = parseInt(ch_mid_val);
global.ch5_target_val = parseInt(ch_max_val);
global.ch6_target_val = parseInt(ch_min_val);
global.ch7_target_val = parseInt(ch_min_val);
global.ch8_target_val = parseInt(ch_min_val);
global.ch9_target_val = parseInt(ch_min_val);
global.ch10_target_val = parseInt(ch_min_val);
global.ch11_target_val = parseInt(ch_min_val);
global.ch12_target_val = parseInt(ch_min_val);
global.ch13_target_val = parseInt(ch_min_val);
global.ch14_target_val = parseInt(ch_min_val);
global.ch15_target_val = parseInt(ch_min_val);
global.ch16_target_val = parseInt(ch_min_val);
global.ch17_target_val = parseInt(330);

function channel_val() {
    rxbuf = '';
    rxbuf += 'C0';
    rxbuf += 'D0';

    // CH1 - Roll
    if (parseInt(ch1) < parseInt(ch1_target_val)) {
        ch1 = parseInt(ch1) + ch_gap;
        if (parseInt(ch1) >= parseInt(ch1_target_val)) {
            ch1 = parseInt(ch1_target_val);
        }
    }
    else if (parseInt(ch1) > parseInt(ch1_target_val)) {
        ch1 = parseInt(ch1) - ch_gap;
        if (parseInt(ch1) <= parseInt(ch1_target_val)) {
            ch1 = parseInt(ch1_target_val);
        }
    }
    hex_ch1 = ch1.toString(16);
    hex_ch1 = hex_ch1.padStart(4, '0');
    let ch1_high_byte = hex_ch1.substr(0, 2);
    let ch1_low_byte = hex_ch1.substr(2, 2);
    rxbuf += ch1_high_byte;
    rxbuf += ch1_low_byte;

    // CH2 - Pitch
    if (parseInt(ch2) < parseInt(ch2_target_val)) {
        ch2 = parseInt(ch2) + ch_gap;
        if (parseInt(ch2) >= parseInt(ch2_target_val)) {
            ch2 = parseInt(ch2_target_val);
        }
    }
    else if (parseInt(ch2) > parseInt(ch2_target_val)) {
        ch2 = parseInt(ch2) - ch_gap;
        if (parseInt(ch2) <= parseInt(ch2_target_val)) {
            ch2 = parseInt(ch2_target_val);
        }
    }
    hex_ch2 = ch2.toString(16);
    hex_ch2 = hex_ch2.padStart(4, '0');
    let ch2_high_byte = hex_ch2.substr(0, 2);
    let ch2_low_byte = hex_ch2.substr(2, 2);
    rxbuf += ch2_high_byte;
    rxbuf += ch2_low_byte;

    // CH3 - Throttle
    if (parseInt(ch3) < parseInt(ch3_target_val)) {
        ch3 = parseInt(ch3) + ch_gap;
        if (parseInt(ch3) >= parseInt(ch3_target_val)) {
            ch3 = parseInt(ch3_target_val);
        }
    }
    else if (parseInt(ch3) > parseInt(ch3_target_val)) {
        ch3 = parseInt(ch3) - ch_gap;
        if (parseInt(ch3) <= parseInt(ch3_target_val)) {
            ch3 = parseInt(ch3_target_val);
        }
    }
    hex_ch3 = ch3.toString(16);
    hex_ch3 = hex_ch3.padStart(4, '0');
    let ch3_high_byte = hex_ch3.substr(0, 2);
    let ch3_low_byte = hex_ch3.substr(2, 2);
    rxbuf += ch3_high_byte;
    rxbuf += ch3_low_byte;

    // CH4 - Yaw
    if (parseInt(ch4) < parseInt(ch4_target_val)) {
        ch4 = parseInt(ch4) + ch_gap;
        if (parseInt(ch4) >= parseInt(ch4_target_val)) {
            ch4 = parseInt(ch4_target_val);
        }
    }
    else if (parseInt(ch4) > parseInt(ch4_target_val)) {
        ch4 = parseInt(ch4) - ch_gap;
        if (parseInt(ch4) <= parseInt(ch4_target_val)) {
            ch4 = parseInt(ch4_target_val);
        }
    }
    hex_ch4 = ch4.toString(16);
    hex_ch4 = hex_ch4.padStart(4, '0');
    let ch4_high_byte = hex_ch4.substr(0, 2);
    let ch4_low_byte = hex_ch4.substr(2, 2);
    rxbuf += ch4_high_byte;
    rxbuf += ch4_low_byte;

    // Switch 1
    if (parseInt(ch5) < parseInt(ch5_target_val)) {
        ch5 = parseInt(ch5) + ch_gap;
        if (parseInt(ch5) >= parseInt(ch5_target_val)) {
            ch5 = parseInt(ch5_target_val);
        }
    }
    else if (parseInt(ch5) > parseInt(ch5_target_val)) {
        ch5 = parseInt(ch5) - ch_gap;
        if (parseInt(ch5) <= parseInt(ch5_target_val)) {
            ch5 = parseInt(ch5_target_val);
        }
    }
    hex_ch5 = ch5.toString(16);
    hex_ch5 = hex_ch5.padStart(4, '0');
    let ch5_high_byte = hex_ch5.substr(0, 2);
    let ch5_low_byte = hex_ch5.substr(2, 2);
    rxbuf += ch5_high_byte;
    rxbuf += ch5_low_byte;

    // Switch 2
    if (parseInt(ch6) < parseInt(ch6_target_val)) {
        ch6 = parseInt(ch6) + ch_gap;
        if (parseInt(ch6) >= parseInt(ch6_target_val)) {
            ch6 = parseInt(ch6_target_val);
        }
    }
    else if (parseInt(ch6) > parseInt(ch6_target_val)) {
        ch6 = parseInt(ch6) - ch_gap;
        if (parseInt(ch6) <= parseInt(ch6_target_val)) {
            ch6 = parseInt(ch6_target_val);
        }
    }
    hex_ch6 = ch6.toString(16);
    hex_ch6 = hex_ch6.padStart(4, '0');
    let ch6_high_byte = hex_ch6.substr(0, 2);
    let ch6_low_byte = hex_ch6.substr(2, 2);
    rxbuf += ch6_high_byte;
    rxbuf += ch6_low_byte;

    // Switch 3
    if (parseInt(ch7) < parseInt(ch7_target_val)) {
        ch7 = parseInt(ch7) + ch_gap;
        if (parseInt(ch7) >= parseInt(ch7_target_val)) {
            ch7 = parseInt(ch7_target_val);
        }
    }
    else if (parseInt(ch7) > parseInt(ch7_target_val)) {
        ch7 = parseInt(ch7) - ch_gap;
        if (parseInt(ch7) <= parseInt(ch7_target_val)) {
            ch7 = parseInt(ch7_target_val);
        }
    }
    hex_ch7 = ch7.toString(16);
    hex_ch7 = hex_ch7.padStart(4, '0');
    let ch7_high_byte = hex_ch7.substr(0, 2);
    let ch7_low_byte = hex_ch7.substr(2, 2);
    rxbuf += ch7_high_byte;
    rxbuf += ch7_low_byte;

    // Switch 4
    if (parseInt(ch8) < parseInt(ch8_target_val)) {
        ch8 = parseInt(ch8) + ch_gap;
        if (parseInt(ch8) >= parseInt(ch8_target_val)) {
            ch8 = parseInt(ch8_target_val);
        }
    }
    else if (parseInt(ch8) > parseInt(ch8_target_val)) {
        ch8 = parseInt(ch8) - ch_gap;
        if (parseInt(ch8) <= parseInt(ch8_target_val)) {
            ch8 = parseInt(ch8_target_val);
        }
    }
    hex_ch8 = ch8.toString(16);
    hex_ch8 = hex_ch8.padStart(4, '0');
    let ch8_high_byte = hex_ch8.substr(0, 2);
    let ch8_low_byte = hex_ch8.substr(2, 2);
    rxbuf += ch8_high_byte;
    rxbuf += ch8_low_byte;

    // Switch 5
    if (parseInt(ch9) < parseInt(ch9_target_val)) {
        ch9 = parseInt(ch9) + ch_gap;
        if (parseInt(ch9) >= parseInt(ch9_target_val)) {
            ch9 = parseInt(ch9_target_val);
        }
    }
    else if (parseInt(ch9) > parseInt(ch9_target_val)) {
        ch9 = parseInt(ch9) - ch_gap;
        if (parseInt(ch9) <= parseInt(ch9_target_val)) {
            ch9 = parseInt(ch9_target_val);
        }
    }
    hex_ch9 = ch9.toString(16);
    hex_ch9 = hex_ch9.padStart(4, '0');
    let ch9_high_byte = hex_ch9.substr(0, 2);
    let ch9_low_byte = hex_ch9.substr(2, 2);
    rxbuf += ch9_high_byte;
    rxbuf += ch9_low_byte;

    // Switch 6
    if (parseInt(ch10) < parseInt(ch10_target_val)) {
        ch10 = parseInt(ch10) + ch_gap;
        if (parseInt(ch10) >= parseInt(ch10_target_val)) {
            ch10 = parseInt(ch10_target_val);
        }
    }
    else if (parseInt(ch10) > parseInt(ch10_target_val)) {
        ch10 = parseInt(ch10) - ch_gap;
        if (parseInt(ch10) <= parseInt(ch10_target_val)) {
            ch10 = parseInt(ch10_target_val);
        }
    }
    hex_ch10 = ch10.toString(16);
    hex_ch10 = hex_ch10.padStart(4, '0');
    let ch10_high_byte = hex_ch10.substr(0, 2);
    let ch10_low_byte = hex_ch10.substr(2, 2);
    rxbuf += ch10_high_byte;
    rxbuf += ch10_low_byte;


    // Switch 7
    if (parseInt(ch11) < parseInt(ch11_target_val)) {
        ch11 = parseInt(ch11) + ch_gap;
        if (parseInt(ch11) >= parseInt(ch11_target_val)) {
            ch11 = parseInt(ch11_target_val);
        }
    }
    else if (parseInt(ch11) > parseInt(ch11_target_val)) {
        ch11 = parseInt(ch11) - ch_gap;
        if (parseInt(ch11) <= parseInt(ch11_target_val)) {
            ch11 = parseInt(ch11_target_val);
        }
    }
    hex_ch11 = ch11.toString(16);
    hex_ch11 = hex_ch11.padStart(4, '0');
    let ch11_high_byte = hex_ch11.substr(0, 2);
    let ch11_low_byte = hex_ch11.substr(2, 2);
    rxbuf += ch11_high_byte;
    rxbuf += ch11_low_byte;



    // Switch 8
    if (parseInt(ch12) < parseInt(ch12_target_val)) {
        ch12 = parseInt(ch12) + ch_gap;
        if (parseInt(ch12) >= parseInt(ch12_target_val)) {
            ch12 = parseInt(ch12_target_val);
        }
    }
    else if (parseInt(ch12) > parseInt(ch12_target_val)) {
        ch12 = parseInt(ch12) - ch_gap;
        if (parseInt(ch12) <= parseInt(ch12_target_val)) {
            ch12 = parseInt(ch12_target_val);
        }
    }
    else {
        ch12 = parseInt(ch12_target_val);
    }
    hex_ch12 = ch12.toString(16);
    hex_ch12 = hex_ch12.padStart(4, '0');
    let ch12_high_byte = hex_ch12.substr(0, 2);
    let ch12_low_byte = hex_ch12.substr(2, 2);
    rxbuf += ch12_high_byte;
    rxbuf += ch12_low_byte;

    // Switch 9
    if (parseInt(ch13) < parseInt(ch13_target_val)) {
        ch13 = parseInt(ch13) + ch_gap;
        if (parseInt(ch13) >= parseInt(ch13_target_val)) {
            ch13 = parseInt(ch13_target_val);
        }
    }
    else if (parseInt(ch13) > parseInt(ch13_target_val)) {
        ch13 = parseInt(ch13) - ch_gap;
        if (parseInt(ch13) <= parseInt(ch13_target_val)) {
            ch13 = parseInt(ch13_target_val);
        }
    }
    hex_ch13 = ch13.toString(16);
    hex_ch13 = hex_ch13.padStart(4, '0');
    let ch13_high_byte = hex_ch13.substr(0, 2);
    let ch13_low_byte = hex_ch13.substr(2, 2);
    rxbuf += ch13_high_byte;
    rxbuf += ch13_low_byte;

    // Switch 10
    if (parseInt(ch14) < parseInt(ch14_target_val)) {
        ch14 = parseInt(ch14) + ch_gap;
        if (parseInt(ch14) >= parseInt(ch14_target_val)) {
            ch14 = parseInt(ch14_target_val);
        }
    }
    else if (parseInt(ch14) > parseInt(ch14_target_val)) {
        ch14 = parseInt(ch14) - ch_gap;
        if (parseInt(ch14) <= parseInt(ch14_target_val)) {
            ch14 = parseInt(ch14_target_val);
        }
    }
    hex_ch14 = ch14.toString(16);
    hex_ch14 = hex_ch14.padStart(4, '0');
    let ch14_high_byte = hex_ch14.substr(0, 2);
    let ch14_low_byte = hex_ch14.substr(2, 2);
    rxbuf += ch14_high_byte;
    rxbuf += ch14_low_byte;

    // Switch 11
    if (parseInt(ch15) < parseInt(ch15_target_val)) {
        ch15 = parseInt(ch15) + ch_gap;
        if (parseInt(ch15) >= parseInt(ch15_target_val)) {
            ch15 = parseInt(ch15_target_val);
        }
    }
    else if (parseInt(ch15) > parseInt(ch15_target_val)) {
        ch15 = parseInt(ch15) - ch_gap;
        if (parseInt(ch15) <= parseInt(ch15_target_val)) {
            ch15 = parseInt(ch15_target_val);
        }
    }
    hex_ch15 = ch15.toString(16);
    hex_ch15 = hex_ch15.padStart(4, '0');
    let ch15_high_byte = hex_ch15.substr(0, 2);
    let ch15_low_byte = hex_ch15.substr(2, 2);
    rxbuf += ch15_high_byte;
    rxbuf += ch15_low_byte;

    // Switch 12
    if (parseInt(ch16) < parseInt(ch16_target_val)) {
        ch16 = parseInt(ch16) + ch_gap;
        if (parseInt(ch16) >= parseInt(ch16_target_val)) {
            ch16 = parseInt(ch16_target_val);
        }
    }
    else if (parseInt(ch16) > parseInt(ch16_target_val)) {
        ch16 = parseInt(ch16) - ch_gap;
        if (parseInt(ch16) <= parseInt(ch16_target_val)) {
            ch16 = parseInt(ch16_target_val);
        }
    }
    hex_ch16 = ch16.toString(16);
    hex_ch16 = hex_ch16.padStart(4, '0');
    let ch16_high_byte = hex_ch16.substr(0, 2);
    let ch16_low_byte = hex_ch16.substr(2, 2);
    rxbuf += ch16_high_byte;
    rxbuf += ch16_low_byte;
    // Switch 13
    hex_ch17 = ch17.toString(16);
    hex_ch17 = hex_ch17.padStart(4, '0');
    let ch17_high_byte = hex_ch17.substr(0, 2);
    let ch17_low_byte = hex_ch17.substr(2, 2);
    rxbuf += ch17_high_byte;
    rxbuf += ch17_low_byte;
    checksum_extra();

    sbusPort.write(Buffer.from(rxbuf, 'hex'));
    sbusData();
}

function checksum_extra() {
    var crc_res = 0;
    for (let i = 0; i < 34; i++) {
        crc_res += parseInt(rxbuf.substr(4 + (i * 2), 2), 16);
        crc_res = crc_res & 0x00ff;
    }

    crc_res = crc_res & 0x00ff;

    crc_res = crc_res.toString(16);
    hex_crc_res = crc_res.toString(16);
    hex_crc_res = hex_crc_res.padEnd(4, '0');
    let crc_res_byte = hex_crc_res.substr(0, 2);
    let tail_byte = hex_crc_res.substr(2, 2);
    rxbuf += crc_res_byte;
    rxbuf += tail_byte;
}


function sbusData() {
    let sbus = {};
    sbus.ch1 = ch1;
    sbus.ch2 = ch2;
    sbus.ch3 = ch3;
    sbus.ch4 = ch4;
    sbus.ch5 = ch5;
    sbus.ch6 = ch6;
    sbus.ch7 = ch7;
    sbus.ch8 = ch8;
    sbus.ch9 = ch9;
    sbus.ch10 = ch10;
    sbus.ch11 = ch11;
    sbus.ch12 = ch12;
    sbus.ch13 = ch13;
    sbus.ch14 = ch14;
    sbus.ch15 = ch15;
    sbus.ch16 = ch16;
    sbus.ch17 = ch17;
    lib_mqtt_client.publish(data_topic, JSON.stringify(sbus));
}


sbusPortOpening();

function sbusPortOpening() {
    if (sbusPort == null) {
        sbusPort = new SerialPort(sbusPortNum, {
            baudRate: parseInt(sbusBaudrate, 10),
        });

        sbusPort.on('open', sbusPortOpen);
        sbusPort.on('close', sbusPortClose);
        sbusPort.on('error', sbusPortError);
        sbusPort.on('data', sbusPortData);
    } else {
        if (sbusPort.isOpen) {

        } else {
            sbusPort.open();
        }
    }
}

function sbusPortOpen() {
    console.log('sbusPort open. ' + sbusPortNum + ' Data rate: ' + sbusBaudrate);
}

function sbusPortClose() {
    console.log('sbusPort closed.');

    setTimeout(sbusPortOpening, 2000);
}

function sbusPortError(error) {
    let error_str = error.toString();
    console.log('[sbusPort error]: ' + error.message);
    if (error_str.substring(0, 14) === "Error: Opening") {

    } else {
        console.log('sbusPort error : ' + error);
    }

    setTimeout(sbusPortOpening, 2000);
}

function sbusPortData(data) {
    //console.log(data.toString());
}


let lib;

try {
    lib = JSON.parse(fs.readFileSync('./' + config.directory_name + '/lib_sparrow_gun.json', 'utf8'));
} catch (e) {
    lib = {
        name: 'lib_remote_gimbal',
        target: 'armv6',
        description: "node [name] [portnum] [baudrate]",
        scripts: 'node lib_remote_gimbal /dev/ttyUSB3 115200',
        data: ['SBUS'],
        control: ['REMOTE']
    };
}

let lib_mqtt_client = null;

lib_mqtt_connect('localhost', 1883);

let control_topic = '/MUV/control/' + lib.name + '/' + lib.control[0]
let data_topic = '/MUV/data/' + lib.name + '/' + lib.data[0]

function lib_mqtt_connect(broker_ip, port) {
    if (lib_mqtt_client == null) {
        var connectOptions = {
            host: broker_ip,
            port: port,
            protocol: "mqtt",
            keepalive: 10,
            protocolId: "MQTT",
            protocolVersion: 4,
            clean: true,
            reconnectPeriod: 2000,
            connectTimeout: 2000,
            rejectUnauthorized: false
        };

        lib_mqtt_client = mqtt.connect(connectOptions);
    }

    lib_mqtt_client.on('connect', function () {
        console.log('[lib_mqtt_connect] connected to ' + broker_ip);
        lib_mqtt_client.subscribe(control_topic);
        console.log('[lib_mqtt_connect] control_topic: ' + control_topic);
    });

    lib_mqtt_client.on('message', function (topic, message) {
        if (topic === control_topic) {
            let obj_lib_data = JSON.parse(message);
            let ch_num = parseInt(obj_lib_data.num);
            let ch_val = parseInt(obj_lib_data.value);

            key_to_signal(ch_num, ch_val);
        }
    });

    lib_mqtt_client.on('error', function (err) {
        console.log(err.message);
    });
}

// pkg lib_remote_gimbal.js --target node14-linux-armv6
