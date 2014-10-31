var DBusConnector = require("../dbusConnector"),
    DBusUtils = require("../dbusUtils");

var _connection = DBusConnector.dbusData("Connection"),
    _service = DBusConnector.dbusData("NetworkManager").interface;

module.exports = (function(initData){

    return DBusUtils.buildInterface(_service, initData);

})([
    {
        name: "delete",
        dbusName: "Delete",
        interface: _connection.interface,
        type: "method"
    },
    {
        name: "getSettings",
        dbusName: "GetSettings",
        interface: _connection.interface,
        type: "method"
    },
    {
        name: "update",
        dbusName: "Update",
        interface: _connection.interface,
        type: "method"
    }
]);
