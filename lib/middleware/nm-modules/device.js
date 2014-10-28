var DBusConnector = require("../dbusConnector"),
    _device = DBusConnector.dbusData("Device");

module.exports = {
    getProperty: function(deviceId, property, callback) {
        return DBusConnector.getProperty(deviceId, _device.interface,
            property, callback);
    }
};
