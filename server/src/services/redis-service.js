const redis = require('../redis');
const tokenUtils = require('../utils/token-utils');

_getUserLinkedKeyName = function(uid, name) {
    return  uid + '_' + name;
}

// TODO: update docker config
exports.createAndCacheUserLinkedToken = async function(uid, name, expiryInSec=0) {
    try {
        if (!redis.get())
            throw 'Lost connection with redis'; 
        if (typeof(uid) !== 'string' || typeof(name) !== 'string')
            throw 'createAndCacheUserLinkedToken: parameters must be string';
        const key = _getUserLinkedKeyName(uid, name);
        const keyExists = await redis.get().getAsync(key);
        if (keyExists)
            throw 'Key already created and cached';
        const token = await tokenUtils.createUserLinkedJWTToken(uid);
        await redis.get().setAsync(key, token, 'EX', expiryInSec);
        return token;
    } catch (e) {
        throw e;
    }
}

exports.getCachedUserLinkedToken = async function(uid, name) {
    try {
        if (!redis.get())
            throw 'Lost connection with redis';
        const key = _getUserLinkedKeyName(uid, name);
        const res = await redis.get().getAsync(key);
        return res;
    } catch (e) {
        throw e;
    }
}

exports.destroyKey = async function(key) {
    try {
        if (!redis.get())
            throw 'Lost connection with redis'; 
        const delRes = await redis.get().delAsync(key);
    } catch (e) {
        throw e;
    }
}