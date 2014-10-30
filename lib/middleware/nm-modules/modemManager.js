var DBusConnector = require("../dbusConnector");

var _modemManagerData = DBusConnector.dbusData("ModemManager");

module.exports = {
    getModems: function(callback) {
        return DBusConnector.callMethod(_modemManagerData.interface, _modemManagerData.object, _modemManagerData.interface,
            "EnumerateDevices", null, callback);
    }
};

module.exports = (function(initData){

    var current, interface = {},
        i = 0, l = initData.length;

    for (; i < l; i++) {
        current = initData[i];
        switch (current.type) {
            case "method":
                interface[current.name] = (function(context){
                    return function() {

                        var args = Array.prototype.slice.call(arguments, 0),
                            object = args[0],
                            callback,
                            methodParams;

                        if (args.length > 1) {
                            var lastArg = args[args.length -1];
                            if (typeof  lastArg === "function")
                                callback = lastArg;
                            methodParams = args.splice(1, args.length - 2);
                        }
                        return DBusConnector.callMethod(_modemManagerData.interface, object, context.interface,
                            context.dbusName, methodParams, callback);
                    };
                })(current);
                break;
            case "property":
                interface[current.name] = (function(context){
                    return function() {

                        var args = Array.prototype.slice.call(arguments, 0),
                            object = args[0],
                            callback = args.length === 2 ? args[1] : null;

                        return DBusConnector.getProperty(_modemManagerData.interface, object, context.interface,
                            context.dbusName, callback);
                    };
                })(current);
                break;
        }

    }

    interface.getModems = function(callback) {
        return DBusConnector.callMethod(_modemManagerData.interface, _modemManagerData.object, _modemManagerData.interface,
            "EnumerateDevices", null, callback);
    };

    interface.onModemStateChanged = function(modemId, callback) {

    }

    return interface;
})([
    {
        name: "enable",
        dbusName: "Enable",
        interface: _modemManagerData.Modem.interface,
        type: "method"
    },
    {
        name: "getInfo",
        dbusName: "GetInfo",
        interface: _modemManagerData.Modem.interface,
        type: "method"
    },
    {
        name: "getSignalQuality",
        dbusName: "GetSignalQuality",
        interface: _modemManagerData.Modem.Gsm.Network.interface,
        type: "method"
    },
    {
        name: "getRegistrationInfo",
        dbusName: "GetRegistrationInfo",
        interface: _modemManagerData.Modem.Gsm.Network.interface,
        type: "method"
    },
    {
        name: "getAllowedMode",
        dbusName: "AllowedMode",
        interface: _modemManagerData.Modem.Gsm.Network.interface,
        type: "property"
    },
    {
        name: "getAccessTechnology",
        dbusName: "AccessTechnology",
        interface: _modemManagerData.Modem.Gsm.Network.interface,
        type: "property"
    }
]);