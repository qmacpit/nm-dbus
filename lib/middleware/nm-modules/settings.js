var DBusConnector = require("../dbusConnector");

module.exports = {
    addConnection: function(connectionData, callback) {

    },
    listConnections: function(callback) {
        DBusConnector.callMethod("org.freedesktop.NetworkManager", "/org/freedesktop/NetworkManager/Settings", "org.freedesktop.NetworkManager.Settings",
        "ListConnections", callback);
    }
};
