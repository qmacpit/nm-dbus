var DBus = require("dbus"),
    dbus = new DBus(),
    DBus_system = dbus.getBus('system'),
    Q = require("q");

var _dbusData = {
    NetworkManager: {
        object: "/org/freedesktop/NetworkManager",
        interface: "org.freedesktop.NetworkManager"
    },
    Settings: {
        object: "/org/freedesktop/NetworkManager/Settings",
        interface: "org.freedesktop.NetworkManager.Settings"
    },
    Connection: {
        object: "/org/freedesktop/NetworkManager/Settings/Connection",
        interface: "org.freedesktop.NetworkManager.Settings.Connection"
    },
    ActiveConnection: {
        object: "/org/freedesktop/NetworkManager/Connection.Active",
        interface: "org.freedesktop.NetworkManager.Connection.Active"
    },
    Device: {
        object: "/org/freedesktop/NetworkManager/Device",
        interface: "org.freedesktop.NetworkManager.Device"
    },
    ModemManager: {
        object: "/org/freedesktop/ModemManager",
        interface: "org.freedesktop.ModemManager",
        Modem: {
            object: "/org/freedesktop/ModemManager/Modem",
            interface: "org.freedesktop.ModemManager.Modem",
            Gsm: {
                object: "/org/freedesktop/ModemManager/Modem/Gsm",
                interface: "org.freedesktop.ModemManager.Modem.Gsm",
                Network: {
                    object: "/org/freedesktop/ModemManager/Modem/Gsm/Network",
                    interface: "org.freedesktop.ModemManager.Modem.Gsm.Network"
                }
            }
        }
    }
};

var _subscribers = {};

module.exports = {
    dbusData: function(object){
        if (!object || !_dbusData[object])
            return _dbusData
        return _dbusData[object];
    },
    callMethod: function(service, object, interface, method, methodParams, callback) {
        var deferred = Q.defer();
//        console.log(service)
//        console.log(object)
//        console.log(interface)
        DBus_system.getInterface(service, object, interface,
            function(err, iface) {
//                console.log(err)
//                console.log(iface)
                if (err)
                    return deferred.reject(err);
                if (!iface[method])
                    return deferred.reject("no such method " + method + " in " + interface);

//                iface[method]['timeout'] = 2000;
                iface[method]['finish'] = function(data){
                    deferred.resolve(data);
                };

                iface[method]['error'] = function(err){
                    console.log(err);
                    deferred.reject(err)
                };

                if (Array.isArray(methodParams)) {
                    return  iface[method].apply(iface, methodParams);
                }
                iface[method](methodParams);

            }
        );

        return deferred.promise.nodeify(callback);
    },
    getProperty: function(service, object, interface, propertyName, callback) {
        var deferred = Q.defer();
        DBus_system.getInterface(service, object, interface,
            function(err, iface) {
//                console.log(propertyName)
//                console.log(iface.object.property)
                if (err)
                    return deferred.reject(err);
                if (!iface.object.property[propertyName])
                    return deferred.reject("no such property " + propertyName + " in " + interface);

                iface.getProperty(propertyName, function(err, value){
                    if (err)
                        return deferred.reject(err);
                    deferred.resolve(value);
                });

            }
        );

        return deferred.promise.nodeify(callback);
    },
    on: function(service, object, interface, signal, callback){
        DBus_system.getInterface(service, object, interface,
            function(err, iface) {
                if (err)
                    return callback(err)
                if (!iface.object.signal[signal])
                    return callback("no such signal " + signal + " in " + interface);

                iface.on(signal, function(data){
//                    return callback(null, data);
                    return callback.apply(null, arguments);
                });
            }
        );
    }
}
