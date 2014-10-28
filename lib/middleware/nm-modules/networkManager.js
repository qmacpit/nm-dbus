var DBusConnector = require("../dbusConnector");

var _networkManager = DBusConnector.dbusData("NetworkManager");

module.exports = {
    activateConnection: function(connectionId, deviceId, callback) {
        return DBusConnector.callMethod(_networkManager.object, _networkManager.interface,
        "ActivateConnection", [connectionId, deviceId, "/"], callback);
    },
    getDevices: function(callback){
        return DBusConnector.callMethod(_networkManager.object, _networkManager.interface,
            "GetDevices", null, callback);
    }
};
