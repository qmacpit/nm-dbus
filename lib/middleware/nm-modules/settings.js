var DBusConnector = require("../dbusConnector");

var _settings = DBusConnector.dbusData("Settings");

module.exports = {
    addConnection: function(connectionData, callback) {

    },
    listConnections: function(callback) {
        return DBusConnector.callMethod("org.freedesktop.NetworkManager", _settings.object, _settings.interface,
        "ListConnections", callback);
    }
};
