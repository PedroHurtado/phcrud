(function (module, undefined) {

    phHttpFactory.$inject = ['$http'];
    function phHttpFactory(http) {

        var forEach = angular.forEach, service = {}, extend = angular.extend,isFunction=angular.isFunction;

        function resolve(action, response) {
            forEach(action, function (value) {
                if (isFunction(value)) {
                    (response) ? value(response) : value();
                }
            });
        }
        function resolveMethod(name) {
            return (name === 'query') ? 'get' : name;
        }
        function resolveData(name, data) {
            return (name === 'query') ? { params: data } : { data: data };
        }
        function createResponse(data, status, headers, config) {
            return { data: data, status: status, headers: headers, config: config };
        }
        function runService(config, before, success, error) {
            resolve(before);
            http(config).
               success(function (data, status, headers, config) {
                   resolve(success, createResponse(data, status, headers, config));
               }).
               error(function (data, status, headers, config) {
                   resolve(error, createResponse(data, status, headers, config));
               });
        }
        function createShortMethod() {
            forEach(arguments, function (name) {
                service[name] = function (config, before, sucess, error) {
                    return function (url) {
                        runService(extend({ method: name, url: url }, config || {}), before, sucess, error);
                    };
                };
            });
        }
        function createShortMethodWithData() {
            forEach(arguments, function (name) {
                service[name] = function (config, before, sucess, error) {
                    return function (url, data) {
                        runService(extend(extend({ method: resolveMethod(name), url: url }, resolveData(name, data)), config || {}), before, sucess, error);
                    };
                };
            });
        }

        createShortMethod('get', 'delete');
        createShortMethodWithData('post', 'put', 'query');

        return service;
    };

   
    module.factory('phHttpFactory', phHttpFactory);

})(angular.module('phCrud'));