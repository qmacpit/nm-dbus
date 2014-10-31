var DBusConnector = require("./dbusConnector");

module.exports = {
    /*
     * function used to create generic methods and property getters that are performed
     * on DBus Objects.
     *
     * parameters:
     *      service [String] - DBus service name. The same for all created methods
     *      interfaceData [Array] - array of data to be used to populate.
     *          array object:
     *              name [String] - name of created method
     *              dbusName [String]  - dbus name of method/property
     *              interface [String] - dbus interface of method/property
     *              type [String] - "method" or "property"
     *
     *      Example
     *      [
     *          {
     *              name: "enable",
     *              dbusName: "Enable",
     *              interface: _modemManagerData.Modem.interface,
     *              type: "method"
     *          },
     *          {
     *              name: "getAllowedMode",
     *              dbusName: "AllowedMode",
     *              interface: _modemManagerData.Modem.Gsm.Network.interface,
     *              type: "property"
     *          },
     *      ]
     *
     * Method calls created this way must follow the following pattern:
     *      methodName(objectId, methodParameters, callback)
     *
     * Property getters created this way must follow the following pattern:
     *      propertyGetterName(objectId, callback)
     */
    buildInterface: function(service, interfaceData) {

        var current, interface = {},
            i = 0, l = interfaceData.length;

        for (; i < l; i++) {
            current = interfaceData[i];
            switch (current.type) {
                case "method":
                    interface[current.name] = (function(context){
                        return function() {

                            var args = Array.prototype.slice.call(arguments, 0),
                                object = args[0],
                                callback,
                                methodParams;

                            if (args.length > 1) {
                                var lastArg = args[args.length -1];
                                if (typeof  lastArg === "function")
                                    callback = lastArg;
                                methodParams = args.splice(1, args.length - 2);
                            }
                            return DBusConnector.callMethod(service, object, context.interface,
                                context.dbusName, methodParams, callback);
                        };
                    })(current);
                    break;
                case "property":
                    interface[current.name] = (function(context){
                        return function() {

                            var args = Array.prototype.slice.call(arguments, 0),
                                object = args[0],
                                callback = args.length === 2 ? args[1] : null;

                            return DBusConnector.getProperty(service, object, context.interface,
                                context.dbusName, callback);
                        };
                    })(current);
                    break;
            }

        }

        return interface;
    },
    Deactiveable: function(callback) {

        var _deactivated, _callback = callback;

        this.deactivate = function(){
            _deactivated = true;
        }

        this.activate = function(){
            _deactivated = false;
        }

        this.performCallback= function(err, data){
            if (_callback && !_deactivated)
                _callback(err, data);
        }
    }
}
