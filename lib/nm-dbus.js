var DBus = require("dbus"),
    dbus = new DBus(),
    dbus_system = dbus.getBus('system'),
    Settings = require("./nm-modules/settings");

module.exports = {
    Settings: Settings
};
