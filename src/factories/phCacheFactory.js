﻿(function (module, undefined) {

    phCacheFactory.$inject = ['$cacheFactory'];
    function phCacheFactory(cacheFactory) {
        var cache = cacheFactory('phCache');
        return {
            get: cache.get,
            put: cache.put,
            remove: cache.remove,
            removeAll: cache.removeAll,
            pop: function (key) {
                var value = this.get(key);
                if (value) {
                    this.remove(key);
                }
                return value;
            }
        };
    }
    module.factory('phCacheFactory', phCacheFactory);

})(angular.module('phCrud'));