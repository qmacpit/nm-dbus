var nmDbus = require("./middleware/nm-dbus"),
    Q = require("q")

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
    activateConnection: nmDbus.NetworkManager.activateConnection

};
