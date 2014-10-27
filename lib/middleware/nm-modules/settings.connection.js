var DBusConnector = require("../dbusConnector"),
    _connection = DBusConnector.dbusData("Connection");

module.exports = {
    delete: function(connectionId, callback) {
        return DBusConnector.callMethod(connectionId, _connection.interface,
            "AddConnection", connectionData, callback);
    }
};
