var enumerators = {
    MM_MODEM_STATE: {
        0: "UNKNOWN",
        10: "DISABLED",
        20: "DISABLING",
        30: "ENABLING",
        40: "ENABLED",
        50: "SEARCHING",
        60: "REGISTERED",
        70: "DISCONNECTING",
        80: "CONNECTING",
        90: "CONNECTED"
    },
    NM_ACTIVE_CONNECTION_STATE: {
        0: "NM_ACTIVE_CONNECTION_STATE_UNKNOWN",
        1: "NM_ACTIVE_CONNECTION_STATE_ACTIVATING",
        2: "NM_ACTIVE_CONNECTION_STATE_ACTIVATED",
        3: "NM_ACTIVE_CONNECTION_STATE_DEACTIVATING",
        4: "NM_ACTIVE_CONNECTION_STATE_DEACTIVATED"
    },
    NM_DEVICE_TYPE: {
        0: "NM_DEVICE_TYPE_UNKNOWN",
        1: "NM_DEVICE_TYPE_ETHERNET",
        2: "NM_DEVICE_TYPE_WIFI",
        3: "NM_DEVICE_TYPE_UNUSED1",
        4: "NM_DEVICE_TYPE_UNUSED2",
        5: "NM_DEVICE_TYPE_BT",
        6: "NM_DEVICE_TYPE_OLPC_MESH",
        7: "NM_DEVICE_TYPE_WIMAX",
        8: "NM_DEVICE_TYPE_MODEM",
        9: "NM_DEVICE_TYPE_INFINIBAND",
        10: "NM_DEVICE_TYPE_BOND",
        11: "NM_DEVICE_TYPE_VLAN",
        12: "NM_DEVICE_TYPE_ADSL",
        13: "NM_DEVICE_TYPE_BRIDGE"
    },
    MM_MODEM_GSM_ACCESS_TECH : {
        0: "UNKNOWN",
        1: "GSM",
        2: "GSM_COMPACT",
        3: "GPRS",
        4: "EDGE",
        5: "UMTS",
        6: "HSDPA",
        7: "HSUPA",
        8: "HSPA",
        9: "HSPA_PLUS",
        10: "LTE"
    },
    MM_MODEM_GSM_ALLOWED_MODE: {
        0: "ANY",
        1: "2G_PREFERRED",
        2: "3G_PREFERRED",
        3: "2G_ONLY",
        4: "3G_ONLY",
        5: "4G_PREFERRED",
        6: "4G_ONLY"
    },
    MM_MODEM_GSM_NETWORK_REG_STATUS: {
        0: "IDLE",
        1: "HOME",
        2: "SEARCHING",
        3: "DENIED",
        4: "UNKNOWN",
        5: "ROAMING"
    },
    NM_STATE: {
        0: "NM_STATE_UNKNOWN",
        10: "NM_STATE_ASLEEP",
        20: "NM_STATE_DISCONNECTED",
        30: "NM_STATE_DISCONNECTING",
        40: "NM_STATE_CONNECTING",
        50: "NM_STATE_CONNECTED_LOCAL",
        60: "NM_STATE_CONNECTED_SITE",
        70: "NM_STATE_CONNECTED_GLOBAL"
    }
};

var Translator = function(translationData) {
    var _translationData = translationData;

    this.translate = function(key) {
        return _translationData[key];
    };

    this.translateBack = function(value) {
        for (var key in _translationData) {
            if (_translationData[key] === value)
                return key;
        }
    }
};

module.exports = {
    MM_MODEM_STATE: (function(translationData){
        return new Translator(translationData);
    })(enumerators.MM_MODEM_STATE),
    NM_ACTIVE_CONNECTION_STATE: (function(translationData){
        return new Translator(translationData);
    })(enumerators.NM_ACTIVE_CONNECTION_STATE),
    NM_DEVICE_TYPE: (function(translationData){
        return new Translator(translationData);
    })(enumerators.NM_DEVICE_TYPE),
    MM_MODEM_GSM_ACCESS_TECH: (function(translationData){
        return new Translator(translationData);
    })(enumerators.MM_MODEM_GSM_ACCESS_TECH),
    MM_MODEM_GSM_ALLOWED_MODE: (function(translationData){
        return new Translator(translationData);
    })(enumerators.MM_MODEM_GSM_ALLOWED_MODE),
    MM_MODEM_GSM_NETWORK_REG_STATUS: (function(translationData){
        return new Translator(translationData);
    })(enumerators.MM_MODEM_GSM_NETWORK_REG_STATUS),
    NM_STATE: (function(translationData){
        return new Translator(translationData);
    })(enumerators.NM_STATE)

}
