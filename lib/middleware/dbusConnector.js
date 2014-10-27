var DBus = require("dbus"),
    dbus = new DBus(),
    DBus_system = dbus.getBus('system');

module.exports = {
    callMethod: function(service, object, interface, method, callback) {
        DBus_system.getInterface(service, object, interface,
            function(err, iface) {

                iface[method]['finish'] = function(data){
                    callback(null, data);
                };

                iface[method]['error'] = function(err){
                    callback(err)
                };

                iface[method]();

            });
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