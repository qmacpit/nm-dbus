var nmDbus = require("./middleware/nm-dbus"),
    DBusConnector = require("./middleware/dbusConnector"),
    Q = require("q");

var _dbusData = DBusConnector.dbusData(),
    _nmService = _dbusData["NetworkManager"].interface;

module.exports = {
    addConnection: function(connectionData, callback){
        return nmDbus.Settings.addConnection(connectionData, callback);
    },
    deleteConnection: function(connectionId, callback){
        return nmDbus.Connection.delete(connectionId, callback);
    },
    /*
     *  returns an array of connections.
     *  Parameters:
     *      type [String] - specify a type of connection to be returned i.e "gsm".
     *          If empty all connections will be returned
     */
    getConnections: function(type, callback) {
        if (type) {
            var me = this, connectionIds;
            return this.getConnections(null)
                .then(function(_connectionIds){
                    var i = 0, l = _connectionIds.length, promises = [];

                    connectionIds = _connectionIds;
                    for (; i < l;i++)
                        promises.push(me.getConnection(connectionIds[i]));
                    return Q.all(promises);
                })
                .then(function(allConnections){
                    var i = 0, l = allConnections.length,
                        current, matchingConnections = [];
                    for (; i < l;i++) {
                        current = allConnections[i];
                        if (current.connection.type === type)
                            matchingConnections.push(connectionIds[i]);
                    }

                    return matchingConnections;
                })

        }
        return nmDbus.Settings.listConnections(callback);
    },
    getConnection: function(connectionId, callback) {
        return nmDbus.Connection.getSettings(connectionId, callback);
    },
    updateConnection: function(connectionId, connectionData, callback) {
        return nmDbus.Connection.update(connectionId, connectionData, callback);
    },
    getDevices: function(type, callback) {
        if (type) {
            var devices = [], promises = [], me = this;
            return nmDbus.NetworkManager.getDevices()
                .then(function(_devices){
                    devices = _devices;
                    var i = 0, l = devices.length;
                    for (; i< l; i++) {
                        promises.push((function(deviceId){
                            return me.getDeviceProperty(deviceId, "DeviceType");
                        })(devices[i]));
                    }

                    return Q.all(promises);
                })
                .then(function(deviceTypes){
                    var i = 0, l = deviceTypes.length, matchingDevics = [];
                    for (; i < l; i++) {
                        if (deviceTypes[i] === type)
                            matchingDevics.push(devices[i]);
                    }
                    return matchingDevics;
                })
        }
        return nmDbus.NetworkManager.getDevices(callback);
    },
    getDeviceProperty: function(deviceId, property, callback) {
        return nmDbus.Device.getProperty(deviceId, property, callback);
    },
    activateConnection: nmDbus.NetworkManager.activateConnection,
    deactivateConnection: nmDbus.NetworkManager.deactivateConnection,
    /*
     *  Parameters:
     *      service - DBus service
     *      object - DBus object
     *      interface - DBus interface
     *      signal - DBus signal name
     *      callback - return callback call with following parameters:
     *          err - error info
     *          signalData [object]:
     *              object - DBus object
     *              interface - DBus interface
     *              data - signal data
     */
    on: function(service, object, interface, signal, callback) {
        return DBusConnector.on(service, object, interface, signal, function(err,data){
            if (callback)
                callback(err, {
                    object: object,
                    interface: interface,
                    data: data
                });
        });
    },
    onActiveConnectionStateChanged: (function(_interface){
        return function(activeConnectionId, callback) {
            this.on(_nmService, activeConnectionId, _interface, "PropertiesChanged", callback);
        };
    })(_dbusData["ActiveConnection"].interface),
    // =====================================
    // =            Modem methods          =
    // =====================================
    getModems: function(callback){
        return nmDbus.ModemManager.getModems(callback);
    },
    getModemInfo: function(modemId, callback) {
        return nmDbus.ModemManager.getInfo(modemId, callback);
    },
    getNetworkInfo: function(modemId, callback){
        return Q.all([
                nmDbus.ModemManager.getSignalQuality(modemId),
                nmDbus.ModemManager.getRegistrationInfo(modemId),
                nmDbus.ModemManager.getAllowedMode(modemId),
                nmDbus.ModemManager.getAccessTechnology(modemId)
            ])
            .then(function(data){
                var retObject = {
                    signalQuality: data[0],
                    registrationInfo: data[1],
                    allowedMode: data[2],
                    accessTechnology: data[3]
                }
                if (callback)
                    return callback(null, retObject);
                return retObject;
            });
    },
    onModemStateChanged: (function(_service, _interface){
        return function(modemId, callback) {
            this.on(_service, modemId, _interface, "StateChanged", callback);
        };
    })(_dbusData.ModemManager.interface, _dbusData.ModemManager.Modem.interface),
    onNetworkInfoChanged: (function(_service, _interface){
        return function(modemId, callback) {
            this.on(_service, modemId, _interface, "SignalQuality", callback);
            this.on(_service, modemId, _interface, "RegistrationInfo", callback);
        };
    })(_dbusData.ModemManager.interface, _dbusData.ModemManager.Modem.Gsm.Network.interface)

};
