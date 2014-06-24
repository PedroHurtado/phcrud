(function (module, undefined) {

    phResolveFactory.$inject = ['$injector', '$parse', 'phResolvePathService','$location'];
    function phResolveFactory(injector, parse, resolvePath,location) {
      
        function resolveFactory  (factory, path) {
            var forEach = angular.forEach, extend = angular.extend;
            forEach(['config', 'before', 'success', 'error', 'cmd', 'auto', 'service', 'cacheService'], function (value) {
                factory[value] = factory[value] ? injector.get(factory[value]) : undefined;
            });
            if (factory.service && factory.method) {
                factory.service = factory.service[factory.method](factory.config, factory.before, factory.success, factory.error);
            }
            if (factory.cache) {
                factory.cache = parse(factory.cache)();
                factory.cacheKey = factory.cacheKey || location.path() + (factory.as || '');
            }
            return extend(factory, resolvePath.resolve(path));
        }
        return function (options, override, path) {
            var factory = injector.has(options) ? injector.get(options) : parse(options)() || {};
            var override = parse(override)() || {};

            return resolveFactory(angular.extend(factory, override), path);
        };
    }

    module.factory('phResolveFactory', phResolveFactory);

})(angular.module('phCrud'))