var DBusConnector = require("../dbusConnector");

var _settings = DBusConnector.dbusData("Settings"),
    _service = DBusConnector.dbusData("NetworkManager").interface;

module.exports = {
    addConnection: function(connectionData, callback) {
        return DBusConnector.callMethod(_service, _settings.object, _settings.interface,
            "AddConnection", connectionData, callback);
    },
    listConnections: function(callback) {
        return DBusConnector.callMethod(_service, _settings.object, _settings.interface,
        "ListConnections", null, callback);
    }
};

