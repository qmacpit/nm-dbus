var DBusConnector = require("../dbusConnector");

var _settings = DBusConnector.dbusData("Settings");

module.exports = {
    addConnection: function(connectionData, callback) {

    },
    listConnections: function(callback) {
        return DBusConnector.callMethod(_settings.object, _settings.interface,
        "ListConnections", callback);
    }
};
