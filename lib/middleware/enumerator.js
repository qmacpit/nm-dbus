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
    })(enumerators.NM_DEVICE_TYPE)
}
