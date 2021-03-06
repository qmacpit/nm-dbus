var DBusConnector = require("../dbusConnector");

var _networkManager = DBusConnector.dbusData("NetworkManager");

module.exports = {
    activateConnection: function(connectionId, deviceId, callback) {
        return DBusConnector.callMethod(_networkManager.interface, _networkManager.object, _networkManager.interface,
            "ActivateConnection", [connectionId, deviceId, "/"], callback);
    },
    deactivateConnection: function(connectionId, callback) {
        return DBusConnector.callMethod(_networkManager.interface, _networkManager.object, _networkManager.interface,
            "DeactivateConnection", connectionId, callback);
    },
    getDevices: function(callback){
        return DBusConnector.callMethod(_networkManager.interface, _networkManager.object, _networkManager.interface,
            "GetDevices", null, callback);
    },
    getState: function(callback) {
        return DBusConnector.getProperty(_networkManager.interface, _networkManager.object, _networkManager.interface,
            "State", callback);
    }
};

