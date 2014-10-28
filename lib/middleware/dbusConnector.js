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
    Device: {
        object: "/org/freedesktop/NetworkManager/Device",
        interface: "org.freedesktop.NetworkManager.Device"
    }

};

module.exports = {
    dbusData: function(object){
        if (!object || !_dbusData[object])
            return _dbusData
        return _dbusData[object];
    },
    callMethod: function(object, interface, method, methodParams, callback) {
        var deferred = Q.defer();
        DBus_system.getInterface(_dbusData.NetworkManager.interface, object, interface,
            function(err, iface) {
//                console.log(err)
//                console.log(iface)
                if (err)
                    return deferred.reject(err);
                if (!iface[method])
                    return deferred.reject("no such method " + method + " in " + interface);

                iface[method]['timeout'] = 2000;
                iface[method]['finish'] = function(data){
                    deferred.resolve(data);
                };

                iface[method]['error'] = function(err){
                    deferred.reject(err)
                };

                iface[method](methodParams);

            }
        );

        return deferred.promise.nodeify(callback);
    },
    getProperty: function(object, interface, propertyName, callback) {
        var deferred = Q.defer();
        DBus_system.getInterface(_dbusData.NetworkManager.interface, object, interface,
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
    }
}

//bus.getInterface('org.freedesktop.NetworkManager',
//    '/org/freedesktop/NetworkManager/ActiveConnection/0',
//    'org.freedesktop.NetworkManager.Connection.Active',
//    function(err, iface) {
//
//        console.log(err)
//        console.log(iface)
//
////        iface.getProperty('ActiveConnections', function(err, value){
////            console.log(err)
////            console.log(value)
////        });
//
//    });

//bus.getInterface('org.freedesktop.NetworkManager',
//    '/org/freedesktop/NetworkManager/Settings',
//    'org.freedesktop.NetworkManager.Settings',
//    function(err, iface) {
//
//        iface.AddConnection['finish'] = function(){
//            console.log("finished");
//        }
//
//        iface.AddConnection['error'] = function(err){
//            console.log(err);
//        }
//
//        iface.AddConnection(new_connection);
//
//    });