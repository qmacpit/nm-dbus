var DBusConnector = require("../dbusConnector"),
    _connection = DBusConnector.dbusData("Connection");

module.exports = {
    delete: function(connectionId, callback) {
        return DBusConnector.callMethod(connectionId, _connection.interface,
            "Delete", null, callback);
    },
    getSettings: function(connectionId, callback) {
        return DBusConnector.callMethod(connectionId, _connection.interface,
            "GetSettings", null, callback);
    },
    update: function(connectionId, connectionData, callback) {
        return DBusConnector.callMethod(connectionId, _connection.interface,
            "Update", connectionData, callback);
    }
};
