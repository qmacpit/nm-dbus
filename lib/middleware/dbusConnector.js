var DBus = require("dbus"),
    dbus = new DBus(),
    DBus_system = dbus.getBus('system'),
    Q = require("q");

var _dbusData = {
    NetworkManager: "org.freedesktop.NetworkManager",
    Settings: {
        object: "/org/freedesktop/NetworkManager/Settings",
        interface: "org.freedesktop.NetworkManager.Settings"
    }

};

module.exports = {
    dbusData: function(object){
        if (!object || !_dbusData[object])
            return _dbusData
        return _dbusData[object];
    },
    callMethod: function(service, object, interface, method, callback) {
        var deferred = Q.defer();
        DBus_system.getInterface(service, object, interface,
            function(err, iface) {

                iface[method]['finish'] = function(data){
                    deferred.resolve(data);
                };

                iface[method]['error'] = function(err){
                    deferred.reject(err)
                };

                iface[method]();

            }
        );

        return deferred.promise.nodeify(callback);
    }
}


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