var DBusConnector = require("../dbusConnector"),
    _device = DBusConnector.dbusData("Device");

var _service = DBusConnector.dbusData("NetworkManager").interface;

module.exports = {
    getProperty: function(deviceId, property, callback) {
        return DBusConnector.getProperty(_service, deviceId, _device.interface,
            property, callback);
    }
};
