var nmDbus = require("./middleware/nm-dbus"),
    DBusConnector = require("./middleware/dbusConnector"),
    DBusUtils = require("./middleware/dbusUtils"),
    Enumerator = require("./middleware/enumerator"),
    Q = require("q");

var _dbusData = DBusConnector.dbusData(),
    _nmService = _dbusData["NetworkManager"].interface;

module.exports = {
    addConnection: function(connectionData, callback){
        DBusUtils.prepareDBusData(connectionData)
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
        DBusUtils.prepareDBusData(connectionData)
        return nmDbus.Connection.update(connectionId, connectionData, callback);
    },
    /*
     *  returns an array of devices.
     *  Parameters:
     *      type [Number/String] - specify a type of device to be returned i.e 8 for modems.
     *          If empty all devices available will be returned
     *          The parameter can be either Number or String representing one of the keys/values
     *          if NM_DEVICE_TYPE
     */
    getDevices: function(type, callback) {
        if (type) {
            var devices = [], promises = [], me = this;
            if (typeof type === "string")
                type = Enumerator.NM_DEVICE_TYPE.translateBack(type);
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
                        if (deviceTypes[i].toString() === type.toString())
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
     *              signal - DBus signal
     *              data - signal data
     *  Returns:
     *        DBusUtils.Deactiveable object that allow you to
     *        (de)activate callback you have passed. Deactivated callbacks
     *        will not be called until activated
     */
    on: function(service, object, interface, signal, callback) {
        var deactiveable = new DBusUtils.Deactiveable(callback);
        DBusConnector.on(service, object, interface, signal, function(data){
            deactiveable.performCallback(null, {
                object: object,
                interface: interface,
                signal: signal,
                data: arguments.length > 1 ? Array.prototype.slice.call(arguments) : data
            });
        });
        return deactiveable;
    },
    onActiveConnectionStateChanged: (function(_interface){
        function processSignalData(err, signalData, callback) {
            if (!err)
                signalData.data.State = Enumerator.NM_ACTIVE_CONNECTION_STATE.translate(signalData.data.State);
            callback(err, signalData);
        }
        return function(activeConnectionId, callback) {
            this.on(_nmService, activeConnectionId, _interface, "PropertiesChanged", function(err, signalData){
                processSignalData(err, signalData, callback);
            });
        };
    })(_dbusData["ActiveConnection"].interface),
    // =====================================
    // =            Modem methods          =
    // =====================================
    enableModem: function(modemId, callback) {
        return nmDbus.ModemManager.enable(modemId, callback);
    },
    getModems: function(callback){
        return nmDbus.ModemManager.getModems(callback);
    },
    getModemInfo: function(modemId, callback) {
        return Q.all([
                nmDbus.ModemManager.getInfo(modemId),
                nmDbus.ModemManager.getState(modemId)
            ])
            .then(function(data){
                var retObject = {
                    info: data[0],
                    state: Enumerator.MM_MODEM_STATE.translate(data[1])
                }
                if (callback)
                    return callback(null, retObject);
                return retObject;
            });
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
                    allowedMode: Enumerator.MM_MODEM_GSM_ALLOWED_MODE.translate(data[2]),
                    accessTechnology: Enumerator.MM_MODEM_GSM_ACCESS_TECH.translate(data[3])
                }
                if (callback)
                    return callback(null, retObject);
                return retObject;
            });
    },
    /*
     *  Parameters:
     *      modemId
     *      callback - return callback call with following parameters:
     *          err - error info
     *          signalData [object]:
     *              object - DBus object
     *              interface - DBus interface
     *              signal - DBus signal
     *              data - signal data array [oldState, newState, reason]
     *
     *  Returns:
     *        DBusUtils.Deactiveable object that allow you to
     *        (de)activate callback you have passed. Deactivated callbacks
     *        will not be called until activated
     */
    onModemStateChanged: (function(_service, _interface){
        function processSignalData(err, signalData, callback) {
            if (err || signalData.data.length < 3)
                return callback("onModemStateChanged signal processing failed");
            signalData.data[0] = Enumerator.MM_MODEM_STATE.translate(signalData.data[0]);
            signalData.data[1] = Enumerator.MM_MODEM_STATE.translate(signalData.data[1]);
            callback(err, signalData);
        }
        return function(modemId, callback) {
            this.on(_service, modemId, _interface, "StateChanged", function(err, signalData){
                processSignalData(err, signalData, callback);
            });
        };
    })(_dbusData.ModemManager.interface, _dbusData.ModemManager.Modem.interface),
    onNetworkInfoChanged: (function(_service, _interface){
        return function(modemId, callback) {
            this.on(_service, modemId, _interface, "RegistrationInfo", function(err, signalData){
                console.log("====================")
                console.log("RegistrationInfo")
                console.log("====================")
                callback(err, signalData);
            });
            this.on(_service, modemId, _interface, "SignalQuality", function(err, signalData) {
                console.log("====================")
                console.log("SignalQuality")
                console.log("====================")
                callback(err, signalData);
            });
        };
    })(_dbusData.ModemManager.interface, _dbusData.ModemManager.Modem.Gsm.Network.interface)

};
