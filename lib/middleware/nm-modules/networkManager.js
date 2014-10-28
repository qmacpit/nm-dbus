var DBusConnector = require("../dbusConnector");

var _settings = DBusConnector.dbusData("NetworkManager");

module.exports = {
    activateConnection: function(connectionId, deviceId, callback) {

    },
    getDevices: function(callback){
        return DBusConnector.callMethod(_settings.object, _settings.interface,
            "GetDevices", null, callback);
    }
};
