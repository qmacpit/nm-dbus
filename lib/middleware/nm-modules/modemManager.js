var DBusConnector = require("../dbusConnector"),
    DBusUtils = require("../dbusUtils");

var _modemManagerData = DBusConnector.dbusData("ModemManager");

module.exports = (function(initData){

    var interface = DBusUtils.buildInterface(_modemManagerData.interface, initData);

    interface.getModems = function(callback) {
        return DBusConnector.callMethod(_modemManagerData.interface, _modemManagerData.object, _modemManagerData.interface,
            "EnumerateDevices", null, callback);
    };

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