/**
 * Created by Wonseok, Jung in KETI on 2021-06-25.
 */

let mqtt = require('mqtt');
let fs = require('fs');
let SerialPort = require('serialport');

let my_lib_name = 'lib_lte_rc';

let msw_dir_name = (my_lib_name.replace('lib', 'msw') + '_' + my_lib_name.replace('lib', 'msw'));

let sbusPort = null;

let sbusPortNum = libPort;
let sbusBaudrate = libBaudrate;

global.ch_min_val = 0; // 00 DF
global.ch_mid_val = 1024; // 03 FF
global.ch_max_val = 2047; // 07 1F

global.ch_gap = 20;
// data_range_each_CH = 0~2047

global.check_ch_num = 0;
global.check_ch_val = 0.0;

let TIMEOUT = 40;

console.log('[ ' + drone_info.drone + ' ] RC_MAP_VALUE = \n', rc_map);

let sbus_module_value = JSON.parse(fs.readFileSync('./' + msw_dir_name + '/sbus_module_value(pwm).json', 'utf8'));

function min_max_scaler(val) {
    let nor_val = (val - (-1)) / (1 - (-1));
    return Math.round(nor_val * (ch_max_val - ch_min_val) + ch_min_val);
}

// function key_to_signal(ch_num, ch_val) {
//     try {
//         if (ch_num === 1) {  // Roll
//             ch1_target_val = min_max_scaler(ch_val);
//             if (ch1_target_val > sbus_module_value[rc_map.rc1_max]) {
//                 ch1_target_val = sbus_module_value[rc_map.rc1_max];
//             } else if (ch1_target_val < sbus_module_value[rc_map.rc1_min]) {
//                 ch1_target_val = sbus_module_value[rc_map.rc1_min];
//             } else {
//             }
//         } else if (ch_num === 2) {  // Pitch
//             ch2_target_val = min_max_scaler(ch_val);
//             if (ch2_target_val > sbus_module_value[rc_map.rc2_max]) {
//                 ch2_target_val = sbus_module_value[rc_map.rc2_max];
//             } else if (ch2_target_val < sbus_module_value[rc_map.rc2_min]) {
//                 ch2_target_val = sbus_module_value[rc_map.rc2_min];
//             } else {
//             }
//         } else if (ch_num === 3) {// Throttle
//             ch3_target_val = min_max_scaler(ch_val);
//             if (ch3_target_val > sbus_module_value[rc_map.rc3_max]) {
//                 ch3_target_val = sbus_module_value[rc_map.rc3_max];
//             } else if (ch3_target_val < sbus_module_value[rc_map.rc3_min]) {
//                 ch3_target_val = sbus_module_value[rc_map.rc3_min];
//             } else {
//             }
//         } else if (ch_num === 4) {  // Yaw
//             ch4_target_val = min_max_scaler(ch_val);
//             if (ch4_target_val > sbus_module_value[rc_map.rc4_max]) {
//                 ch4_target_val = sbus_module_value[rc_map.rc4_max];
//             } else if (ch4_target_val < sbus_module_value[rc_map.rc4_min]) {
//                 ch4_target_val = sbus_module_value[rc_map.rc4_min];
//             } else {
//             }
//         } else if (ch_num === 5) {  // Mode (Loiter, PosHold, AltHold)
//             ch5_target_val = min_max_scaler(ch_val);
//             if (ch5_target_val > sbus_module_value[rc_map.rc4_max]) {
//                 ch5_target_val = sbus_module_value[rc_map.rc4_max];
//             } else if (ch5_target_val < sbus_module_value[rc_map.rc4_min]) {
//                 ch5_target_val = sbus_module_value[rc_map.rc4_min];
//             } else {
//             }
//         } else if (ch_num === 6) {  // Arm/Disarm
//             ch6_target_val = min_max_scaler(ch_val);
//             if (ch6_target_val > sbus_module_value[rc_map.rc4_max]) {
//                 ch6_target_val = sbus_module_value[rc_map.rc4_max];
//             } else if (ch6_target_val < rsbus_module_value[rc_map.rc4_min]) {
//                 ch6_target_val = sbus_module_value[rc_map.rc4_min];
//             } else {
//             }
//         } else if (ch_num === 7) {  // RTL
//             ch7_target_val = min_max_scaler(ch_val);
//             if (ch7_target_val > sbus_module_value[rc_map.rc4_max]) {
//                 ch7_target_val = sbus_module_value[rc_map.rc4_max];
//             } else if (ch7_target_val < sbus_module_value[rc_map.rc4_min]) {
//                 ch7_target_val = sbus_module_value[rc_map.rc4_min];
//             } else {
//             }
//         } else if (ch_num === 8) {  // AUTO
//             ch8_target_val = min_max_scaler(ch_val);
//             if (ch8_target_val > sbus_module_value[rc_map.rc4_max]) {
//                 ch8_target_val = sbus_module_value[rc_map.rc4_max];
//             } else if (ch8_target_val < sbus_module_value[rc_map.rc4_min]) {
//                 ch8_target_val = sbus_module_value[rc_map.rc4_min];
//             } else {
//             }
//         } else if (ch_num === 9) {  // LED
//             ch9_target_val = min_max_scaler(ch_val);
//             if (ch9_target_val > sbus_module_value[rc_map.rc4_max]) {
//                 ch9_target_val = sbus_module_value[rc_map.rc4_max];
//             } else if (ch9_target_val < sbus_module_value[rc_map.rc4_min]) {
//                 ch9_target_val = sbus_module_value[rc_map.rc4_min];
//             } else {
//             }
//         } else if (ch_num === 10) {
//             ch10_target_val = min_max_scaler(ch_val);
//             if (ch10_target_val > sbus_module_value[rc_map.rc4_max]) {
//                 ch10_target_val = sbus_module_value[rc_map.rc4_max];
//             } else if (ch10_target_val < sbus_module_value[rc_map.rc4_min]) {
//                 ch10_target_val = sbus_module_value[rc_map.rc4_min];
//             } else {
//             }
//         } else if (ch_num === 11) {  // Landing Gear
//             ch15_target_val = min_max_scaler(ch_val);
//             if (ch11_target_val > sbus_module_value[rc_map.rc4_max]) {
//                 ch11_target_val = sbus_module_value[rc_map.rc4_max];
//             } else if (ch11_target_val < sbus_module_value[rc_map.rc4_min]) {
//                 ch11_target_val = sbus_module_value[rc_map.rc4_min];
//             } else {
//             }
//         } else if (ch_num === 12) {
//             ch12_target_val = min_max_scaler(ch_val);
//             if (ch12_target_val > sbus_module_value[rc_map.rc4_max]) {
//                 ch12_target_val = sbus_module_value[rc_map.rc4_max];
//             } else if (ch12_target_val < sbus_module_value[rc_map.rc4_min]) {
//                 ch12_target_val = sbus_module_value[rc_map.rc4_min];
//             } else {
//             }
//         } else if (ch_num === 13) {
//             ch13_target_val = min_max_scaler(ch_val);
//             if (ch13_target_val > sbus_module_value[rc_map.rc4_max]) {
//                 ch13_target_val = sbus_module_value[rc_map.rc4_max];
//             } else if (ch13_target_val < sbus_module_value[rc_map.rc4_min]) {
//                 ch13_target_val = sbus_module_value[rc_map.rc4_min];
//             } else {
//             }
//         } else if (ch_num === 14) {
//             ch14_target_val = min_max_scaler(ch_val);
//             if (ch14_target_val > sbus_module_value[rc_map.rc4_max]) {
//                 ch14_target_val = sbus_module_value[rc_map.rc4_max];
//             } else if (ch14_target_val < sbus_module_value[rc_map.rc4_min]) {
//                 ch14_target_val = sbus_module_value[rc_map.rc4_min];
//             } else {
//             }
//         } else if (ch_num === 15) {
//             ch15_target_val = min_max_scaler(ch_val);
//             if (ch15_target_val > sbus_module_value[rc_map.rc4_max]) {
//                 ch15_target_val = sbus_module_value[rc_map.rc4_max];
//             } else if (ch15_target_val < sbus_module_value[rc_map.rc4_min]) {
//                 ch15_target_val = sbus_module_value[rc_map.rc4_min];
//             } else {
//             }
//         } else if (ch_num === 16) {
//             ch16_target_val = min_max_scaler(ch_val);
//             if (ch16_target_val > sbus_module_value[rc_map.rc4_max]) {
//                 ch16_target_val = sbus_module_value[rc_map.rc4_max];
//             } else if (ch16_target_val < sbus_module_value[rc_map.rc4_min]) {
//                 ch16_target_val = sbus_module_value[rc_map.rc4_min];
//             } else {
//             }
//         } else {
//         }
//     } catch (e) {
//         ch1 = parseInt(ch_mid_val);
//         ch2 = parseInt(ch_mid_val);
//         ch3 = parseInt(ch_mid_val);
//         ch4 = parseInt(ch_mid_val);
//         ch5 = parseInt(ch_max_val);
//         ch6 = parseInt(ch_min_val);
//         ch7 = parseInt(ch_min_val);
//         ch8 = parseInt(ch_min_val);
//         ch9 = parseInt(ch_min_val);
//         ch10 = parseInt(ch_min_val);
//         ch11 = parseInt(ch_min_val);
//         ch12 = parseInt(ch_min_val);
//         ch13 = parseInt(ch_min_val);
//         ch14 = parseInt(ch_min_val);
//         ch15 = parseInt(ch_min_val);
//         ch16 = parseInt(ch_min_val);
//         ch17 = parseInt(330);
//     }
// }

function key_to_signal(joystick) {
    // console.log(joystick.ch1);
    if (joystick.hasOwnProperty('ch1')) {  // Roll
        ch1_target_val = min_max_scaler(joystick.ch1);
        if (ch1_target_val > sbus_module_value[rc_map.rc1_max]) {
            ch1_target_val = sbus_module_value[rc_map.rc1_max];
        } else if (ch1_target_val < sbus_module_value[rc_map.rc1_min]) {
            ch1_target_val = sbus_module_value[rc_map.rc1_min];
        } else {
        }
    } else if (joystick.hasOwnProperty('ch2')) {  // Pitch
        ch2_target_val = min_max_scaler(joystick.ch2);
        if (ch2_target_val > sbus_module_value[rc_map.rc2_max]) {
            ch2_target_val = sbus_module_value[rc_map.rc2_max];
        } else if (ch2_target_val < sbus_module_value[rc_map.rc2_min]) {
            ch2_target_val = sbus_module_value[rc_map.rc2_min];
        } else {
        }
    } else if (joystick.hasOwnProperty('ch3')) {// Throttle
        ch3_target_val = min_max_scaler(joystick.ch3);
        if (ch3_target_val > sbus_module_value[rc_map.rc3_max]) {
            ch3_target_val = sbus_module_value[rc_map.rc3_max];
        } else if (ch3_target_val < sbus_module_value[rc_map.rc3_min]) {
            ch3_target_val = sbus_module_value[rc_map.rc3_min];
        } else {
        }
    } else if (joystick.hasOwnProperty('ch4')) {  // Yaw
        ch4_target_val = min_max_scaler(joystick.ch4);
        if (ch4_target_val > sbus_module_value[rc_map.rc4_max]) {
            ch4_target_val = sbus_module_value[rc_map.rc4_max];
        } else if (ch4_target_val < sbus_module_value[rc_map.rc4_min]) {
            ch4_target_val = sbus_module_value[rc_map.rc4_min];
        } else {
        }
    } else if (joystick.hasOwnProperty('ch5')) {  // Mode (Loiter, PosHold, AltHold)
        ch5_target_val = min_max_scaler(joystick.ch5);
        if (ch5_target_val > sbus_module_value[rc_map.rc4_max]) {
            ch5_target_val = sbus_module_value[rc_map.rc4_max];
        } else if (ch5_target_val < sbus_module_value[rc_map.rc4_min]) {
            ch5_target_val = sbus_module_value[rc_map.rc4_min];
        } else {
        }
    } else if (joystick.hasOwnProperty('ch6')) {  // Arm/Disarm
        ch6_target_val = min_max_scaler(joystick.ch6);
        if (ch6_target_val > sbus_module_value[rc_map.rc4_max]) {
            ch6_target_val = sbus_module_value[rc_map.rc4_max];
        } else if (ch6_target_val < rsbus_module_value[rc_map.rc4_min]) {
            ch6_target_val = sbus_module_value[rc_map.rc4_min];
        } else {
        }
    } else if (joystick.hasOwnProperty('ch7')) {  // RTL
        ch7_target_val = min_max_scaler(joystick.ch7);
        if (ch7_target_val > sbus_module_value[rc_map.rc4_max]) {
            ch7_target_val = sbus_module_value[rc_map.rc4_max];
        } else if (ch7_target_val < sbus_module_value[rc_map.rc4_min]) {
            ch7_target_val = sbus_module_value[rc_map.rc4_min];
        } else {
        }
    } else if (joystick.hasOwnProperty('ch8')) {  // AUTO
        ch8_target_val = min_max_scaler(joystick.ch8);
        if (ch8_target_val > sbus_module_value[rc_map.rc4_max]) {
            ch8_target_val = sbus_module_value[rc_map.rc4_max];
        } else if (ch8_target_val < sbus_module_value[rc_map.rc4_min]) {
            ch8_target_val = sbus_module_value[rc_map.rc4_min];
        } else {
        }
    } else if (joystick.hasOwnProperty('ch9')) {  // LED
        ch9_target_val = min_max_scaler(joystick.ch9);
        if (ch9_target_val > sbus_module_value[rc_map.rc4_max]) {
            ch9_target_val = sbus_module_value[rc_map.rc4_max];
        } else if (ch9_target_val < sbus_module_value[rc_map.rc4_min]) {
            ch9_target_val = sbus_module_value[rc_map.rc4_min];
        } else {
        }
    } else if (joystick.hasOwnProperty('ch10')) {
        ch10_target_val = min_max_scaler(joystick.ch10);
        if (ch10_target_val > sbus_module_value[rc_map.rc4_max]) {
            ch10_target_val = sbus_module_value[rc_map.rc4_max];
        } else if (ch10_target_val < sbus_module_value[rc_map.rc4_min]) {
            ch10_target_val = sbus_module_value[rc_map.rc4_min];
        } else {
        }
    } else if (joystick.hasOwnProperty('ch11')) {  // Landing Gear
        ch11_target_val = min_max_scaler(joystick.ch11);
        if (ch11_target_val > sbus_module_value[rc_map.rc4_max]) {
            ch11_target_val = sbus_module_value[rc_map.rc4_max];
        } else if (ch11_target_val < sbus_module_value[rc_map.rc4_min]) {
            ch11_target_val = sbus_module_value[rc_map.rc4_min];
        } else {
        }
    } else if (joystick.hasOwnProperty('ch12')) {
        ch12_target_val = min_max_scaler(joystick.ch12);
        if (ch12_target_val > sbus_module_value[rc_map.rc4_max]) {
            ch12_target_val = sbus_module_value[rc_map.rc4_max];
        } else if (ch12_target_val < sbus_module_value[rc_map.rc4_min]) {
            ch12_target_val = sbus_module_value[rc_map.rc4_min];
        } else {
        }
    } else if (joystick.hasOwnProperty('ch13')) {
        ch13_target_val = min_max_scaler(joystick.ch13);
        if (ch13_target_val > sbus_module_value[rc_map.rc4_max]) {
            ch13_target_val = sbus_module_value[rc_map.rc4_max];
        } else if (ch13_target_val < sbus_module_value[rc_map.rc4_min]) {
            ch13_target_val = sbus_module_value[rc_map.rc4_min];
        } else {
        }
    } else if (joystick.hasOwnProperty('ch14')) {
        ch14_target_val = min_max_scaler(joystick.ch14);
        if (ch14_target_val > sbus_module_value[rc_map.rc4_max]) {
            ch14_target_val = sbus_module_value[rc_map.rc4_max];
        } else if (ch14_target_val < sbus_module_value[rc_map.rc4_min]) {
            ch14_target_val = sbus_module_value[rc_map.rc4_min];
        } else {
        }
    } else if (joystick.hasOwnProperty('ch15')) {
        ch15_target_val = min_max_scaler(joystick.ch15);
        if (ch15_target_val > sbus_module_value[rc_map.rc4_max]) {
            ch15_target_val = sbus_module_value[rc_map.rc4_max];
        } else if (ch15_target_val < sbus_module_value[rc_map.rc4_min]) {
            ch15_target_val = sbus_module_value[rc_map.rc4_min];
        } else {
        }
    } else if (joystick.hasOwnProperty('ch16')) {
        ch16_target_val = min_max_scaler(joystick.ch16);
        if (ch16_target_val > sbus_module_value[rc_map.rc4_max]) {
            ch16_target_val = sbus_module_value[rc_map.rc4_max];
        } else if (ch16_target_val < sbus_module_value[rc_map.rc4_min]) {
            ch16_target_val = sbus_module_value[rc_map.rc4_min];
        } else {
        }
    } else {
        ch1_target_val = parseInt(ch_mid_val);
        ch2_target_val = parseInt(ch_mid_val);
        ch3_target_val = parseInt(ch_mid_val);
        ch4_target_val = parseInt(ch_mid_val);
        ch5_target_val = parseInt(ch_max_val);
        ch6_target_val = parseInt(ch_min_val);
        ch7_target_val = parseInt(ch_min_val);
        ch8_target_val = parseInt(ch_min_val);
        ch9_target_val = parseInt(ch_min_val);
        ch10_target_val = parseInt(ch_min_val);
        ch11_target_val = parseInt(ch_min_val);
        ch12_target_val = parseInt(ch_min_val);
        ch13_target_val = parseInt(ch_min_val);
        ch14_target_val = parseInt(ch_min_val);
        ch15_target_val = parseInt(ch_min_val);
        ch16_target_val = parseInt(ch_min_val);
        ch17_target_val = parseInt(330);
    }
    console.log(ch1_target_val, ch2_target_val, ch3_target_val, ch4_target_val, ch5_target_val, ch6_target_val, ch7_target_val, ch8_target_val, ch9_target_val, ch10_target_val, ch11_target_val, ch12_target_val, ch13_target_val, ch14_target_val, ch15_target_val, ch16_target_val, ch17_target_val);
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
    ch1 = ch1_target_val;
    hex_ch1 = ch1.toString(16);
    hex_ch1 = hex_ch1.padStart(4, '0');
    let ch1_high_byte = hex_ch1.substr(0, 2);
    let ch1_low_byte = hex_ch1.substr(2, 2);
    rxbuf += ch1_high_byte;
    rxbuf += ch1_low_byte;

    // CH2 - Pitch
    ch2 = ch2_target_val;
    hex_ch2 = ch2.toString(16);
    hex_ch2 = hex_ch2.padStart(4, '0');
    let ch2_high_byte = hex_ch2.substr(0, 2);
    let ch2_low_byte = hex_ch2.substr(2, 2);
    rxbuf += ch2_high_byte;
    rxbuf += ch2_low_byte;

    // CH3 - Throttle
    ch3 = ch3_target_val;
    hex_ch3 = ch3.toString(16);
    hex_ch3 = hex_ch3.padStart(4, '0');
    let ch3_high_byte = hex_ch3.substr(0, 2);
    let ch3_low_byte = hex_ch3.substr(2, 2);
    rxbuf += ch3_high_byte;
    rxbuf += ch3_low_byte;

    // CH4 - Yaw
    ch4 = ch4_target_val;
    hex_ch4 = ch4.toString(16);
    hex_ch4 = hex_ch4.padStart(4, '0');
    let ch4_high_byte = hex_ch4.substr(0, 2);
    let ch4_low_byte = hex_ch4.substr(2, 2);
    rxbuf += ch4_high_byte;
    rxbuf += ch4_low_byte;

    // Switch 1
    ch5 = ch5_target_val;
    hex_ch5 = ch5.toString(16);
    hex_ch5 = hex_ch5.padStart(4, '0');
    let ch5_high_byte = hex_ch5.substr(0, 2);
    let ch5_low_byte = hex_ch5.substr(2, 2);
    rxbuf += ch5_high_byte;
    rxbuf += ch5_low_byte;

    // Switch 2
    ch6 = ch6_target_val;
    hex_ch6 = ch6.toString(16);
    hex_ch6 = hex_ch6.padStart(4, '0');
    let ch6_high_byte = hex_ch6.substr(0, 2);
    let ch6_low_byte = hex_ch6.substr(2, 2);
    rxbuf += ch6_high_byte;
    rxbuf += ch6_low_byte;

    // Switch 3
    ch7 = ch7_target_val;
    hex_ch7 = ch7.toString(16);
    hex_ch7 = hex_ch7.padStart(4, '0');
    let ch7_high_byte = hex_ch7.substr(0, 2);
    let ch7_low_byte = hex_ch7.substr(2, 2);
    rxbuf += ch7_high_byte;
    rxbuf += ch7_low_byte;

    // Switch 4
    ch8 = ch8_target_val;
    hex_ch8 = ch8.toString(16);
    hex_ch8 = hex_ch8.padStart(4, '0');
    let ch8_high_byte = hex_ch8.substr(0, 2);
    let ch8_low_byte = hex_ch8.substr(2, 2);
    rxbuf += ch8_high_byte;
    rxbuf += ch8_low_byte;

    // Switch 5
    ch9 = ch9_target_val;
    hex_ch9 = ch9.toString(16);
    hex_ch9 = hex_ch9.padStart(4, '0');
    let ch9_high_byte = hex_ch9.substr(0, 2);
    let ch9_low_byte = hex_ch9.substr(2, 2);
    rxbuf += ch9_high_byte;
    rxbuf += ch9_low_byte;

    // Switch 6
    ch10 = ch10_target_val;
    hex_ch10 = ch10.toString(16);
    hex_ch10 = hex_ch10.padStart(4, '0');
    let ch10_high_byte = hex_ch10.substr(0, 2);
    let ch10_low_byte = hex_ch10.substr(2, 2);
    rxbuf += ch10_high_byte;
    rxbuf += ch10_low_byte;

    // Switch 7
    ch11 = ch11_target_val;
    hex_ch11 = ch11.toString(16);
    hex_ch11 = hex_ch11.padStart(4, '0');
    let ch11_high_byte = hex_ch11.substr(0, 2);
    let ch11_low_byte = hex_ch11.substr(2, 2);
    rxbuf += ch11_high_byte;
    rxbuf += ch11_low_byte;

    // Switch 8
    ch12 = ch12_target_val;
    hex_ch12 = ch12.toString(16);
    hex_ch12 = hex_ch12.padStart(4, '0');
    let ch12_high_byte = hex_ch12.substr(0, 2);
    let ch12_low_byte = hex_ch12.substr(2, 2);
    rxbuf += ch12_high_byte;
    rxbuf += ch12_low_byte;

    // Switch 9
    ch13 = ch13_target_val;
    hex_ch13 = ch13.toString(16);
    hex_ch13 = hex_ch13.padStart(4, '0');
    let ch13_high_byte = hex_ch13.substr(0, 2);
    let ch13_low_byte = hex_ch13.substr(2, 2);
    rxbuf += ch13_high_byte;
    rxbuf += ch13_low_byte;

    // Switch 10
    ch14 = ch14_target_val;
    hex_ch14 = ch14.toString(16);
    hex_ch14 = hex_ch14.padStart(4, '0');
    let ch14_high_byte = hex_ch14.substr(0, 2);
    let ch14_low_byte = hex_ch14.substr(2, 2);
    rxbuf += ch14_high_byte;
    rxbuf += ch14_low_byte;

    // Switch 11
    ch15 = ch15_target_val;
    hex_ch15 = ch15.toString(16);
    hex_ch15 = hex_ch15.padStart(4, '0');
    let ch15_high_byte = hex_ch15.substr(0, 2);
    let ch15_low_byte = hex_ch15.substr(2, 2);
    rxbuf += ch15_high_byte;
    rxbuf += ch15_low_byte;

    // Switch 12
    ch16 = ch16_target_val;
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

    // sbusPort.write(Buffer.from(rxbuf, 'hex'));
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
    lib = JSON.parse(fs.readFileSync('./' + config.directory_name + '/lib_lte_rc.json', 'utf8'));
} catch (e) {
    lib = {
        name: 'lib_lte_rc',
        target: 'armv6',
        description: "node [name] [portnum] [baudrate]",
        scripts: 'node lib_lte_rc /dev/ttyUSB3 115200',
        data: ['SBUS'],
        control: ['REMOTE', 'STATUS']
    };
}

let lib_mqtt_client = null;
let obj_lib_data = {};

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
            obj_lib_data = JSON.parse(message);
            // let ch_num = parseInt(obj_lib_data.num);
            // let ch_val = parseFloat(obj_lib_data.value);
            // key_to_signal(ch_num, ch_val);
            // console.log(obj_lib_data);
            key_to_signal(obj_lib_data);
        }
    });

    lib_mqtt_client.on('error', function (err) {
        console.log(err.message);
    });
}

// pkg lib_remote_gimbal.js --target node14-linux-armv6
