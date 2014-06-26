'use strict';

(function (angular, undefined) {
    var module;
    if (!angular) return;
    module=angular.module('phCrud', ['ngRoute']);
    module.isEmpty = angular.isEmpty || (function (obj) {
        for (var p in obj) {
            if (obj.hasOwnProperty(p))  return false; 
        }
        return true;
    });
}
)(window.angular);
(function (module, undefined) {

    controller.$inject = ['$scope', '$attrs', 'phResolveFactory', '$routeParams'];
    function controller(scope, attrs, phFactory, params) {
        var factory = phFactory(attrs.options, attrs.override, attrs.path),
            self = resolveSelf(),
            forEach = angular.forEach,
            bind = angular.bind,
            isFunction = angular.isFunction,
            isEmpty = module.isEmpty;

        function resolveSelf() {
            var obj;
            if (factory.as) {
                if (obj = scope[factory.as]) {
                    return obj;
                }
                else {
                    return scope[factory.as] = {};
                }
            }
            return scope;
        }
        function createModel() {
            self.model = {};
        }
        function bindEval() {
            self.phEval = bind(scope, scope.$eval)
        }

        function resolvePath() {
            if (factory.regexPath) {
                var result = factory.regexPath.regexp.exec(attrs.path);
                if (result) {
                    factory.path = attrs.path;
                }
            }
        }

        function resolveCommandFunction(key, fn) {
            self[key] = function () {
                if (factory.ajaxCmd === key) {
                    resolvePath();
                }
                fn.call(self, factory, arguments);
            };
        }

        function bindFactories() {
            forEach(['config', 'before', 'success', 'error', 'auto'], function (value) {
                var fct = factory[value];
                forEach(fct, function (fn, key) {
                    if (isFunction(fn)) {
                        fct[key] = bind(self, fn);
                    }
                })
            });
        }

        function processCommand() {
            forEach(factory.cmd, function (fn, key) {
                if (isFunction(fn)) {
                    resolveCommandFunction(key, fn);
                }
            });
        }

        function processInitValues() {
            factory.init && self.phEval(factory.init);
        }

        function restoreCache() {
            var x = factory.cacheKey
        }

        function processRouteParams() {
            if (!isEmpty(params)) {
                self['params'] = params;
            }
        }

        function checkPath(fn) {
            if (factory.regexPath) {
                attrs.$observe('path', function (value) {
                    var result = factory.regexPath.regexp.exec(value);
                    if (result) {
                        factory.path = value;
                        fn();
                    };
                });
            } else {
                fn();
            }
        }

        function runAuto() {
            var fnauto = (factory.cmd && factory.cmd[factory.auto]) ? self[factory.auto] : undefined;
            if (isFunction(fnauto)) {
                checkPath(fnauto);
            }
        }
        createModel();
        bindEval();
        bindFactories();
        processCommand();
        processInitValues();
        processRouteParams();
        restoreCache();
        runAuto();

    }

    function phAjax() {

        return {
            restrict: 'EA',
            scope: true,
            dynamicScope: function (attr) {
                var value = attr.scope;
                return (value) ? (value.toLowerCase() === "true") ? true : false : true;
            },
            controller: controller
        };
    }

    module.directive('phAjax', phAjax);

})(angular.module('phCrud'));
(function (module, undefined) {

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
(function (module, undefined) {

    phSuccessFactoryCreate.$inject = ['$window', 'phSpinnerFactory', 'phStatusFactory', 'phCreateModelFactory'];
    function phSuccessFactoryCreate(window, spinner, status, createModel) {
        function back() {
            window.history.back();
        }
        return {
            hide: spinner.hide,
            status: status.setStatus,
            assignModel: createModel.assignModel,
            back: back
        };
    }

    phCommandCreate.$inject = ['phAcceptFactory', '$window']
    function phCommandCreate(phAcceptFactory, $window) {
        return {
            accept: phAcceptFactory.accept,
            close: function () {
                window.history.back();
            }
        }
    }

    module.factory('phSuccessFactoryCreate', phSuccessFactoryCreate);
    module.factory('phCommandCreate', phCommandCreate);


    module.factory('phCreate', function () {
        return {
            as: 'create',
            method: 'post',
            service: 'phHttpFactory',
            cacheService: 'phCacheFactory',
            cache: '["model"]',
            before: 'phBeforeHttpFactory',
            success: 'phSuccessFactoryCreate',
            error: 'phErrorHttpFactory',
            cmd: 'phCommandCreate',
            ajaxCmd: 'accept'
        };
    });

})(angular.module('phCrud'));
(function (module, undefined) {

    phSucessFactoryDelete.$inject = ['$window', 'phSpinnerFactory'];
    function phSucessFactoryDelete(window, spinner) {
        return {
            hide: spinner.hide,
            back: function () {
                window.history.back();
            }
        };
    }


    module.factory('phSucessFactoryDelete', phSucessFactoryDelete)

    module.factory('phDelete', function () {
        return {
            as: 'delete',
            method: 'delete',
            service: 'phHttpFactory',
            before: 'phBeforeHttpFactory',
            success: 'phSucessFactoryDelete',
            error: 'phErrorHttpFactory',
            cmd: 'phCommandCreate',
            ajaxCmd: 'accept'
        };
    });

})(angular.module('phCrud'));
(function (module, undefined) {


    phSuccessFactoryEdit.$inject = ['phSpinnerFactory', 'phStatusFactory', 'phCreateModelFactory']
    function phSuccessFactoryEdit(spinner, status, createModel) {
        return {
            hide: spinner.hide,
            status: status.setStatus,
            assingModel: createModel.assingModel
        }

    }

    module.factory('phSuccessFactoryEdit', phSuccessFactoryEdit);


    module.factory('phEdit', function () {
        return {
            as: 'edit',
            method: 'get',
            service: 'phHttpFactory',
            cacheService: 'phCacheFactory',
            cache: '["model"]',
            before: 'phBeforeHttpFactory',
            success: 'phSuccessFactoryIndex',
            error: 'phErrorHttpFactory',
            cmd: 'phAcceptFactory',
            auto: 'accept'
        };
    });


})(angular.module('phCrud'));
(function (module, undefined) {

    //Show Hide Spinner
    spinnerFactory.$inject = [];
    function spinnerFactory() {
        function hide() {
            this.show = false;
        }
        function show() {
            this.show = true;
        }
        return {
            hide: hide,
            show: show
        };
    }

    //Set http status
    statusFactory.$inject = [];
    function statusFactory() {
        function setStatus(response) {
            this.status = response.status;
        }
        return {
            setStatus: setStatus
        };
    }

    //Set response http(data) to model
    createModelFactory.$inject = [];
    function createModelFactory() {
        function assignModel(response) {
            angular.extend(this.model, response.data || {});
        }
        return {
            assignModel: assignModel
        };
    }
    //call service http 
    acceptFactory.$inject = [];
    function acceptFactory() {
        function accept(factory) {
            var model = this.phEval(factory.fields || '') || this.filter || this.model || {};
            factory.service(factory.path, model);
        }
        return {
            accept: accept
        };
    }
    //run before call http
    beforeHttpFactory.$inject = ['phSpinnerFactory'];
    function beforeHttpFactory(spinner) {
        return {
            show: spinner.show
        };
    }
    //run error http
    errorHttpFactory.$inject = ['phSpinnerFactory', 'phStatusFactory'];
    function errorHttpFactory(spinner, status) {
        return {
            hide: spinner.hide,
            setStatus: status.setStatus
        };
    }


    module.factory('phSpinnerFactory', spinnerFactory);
    module.factory('phStatusFactory', statusFactory);
    module.factory('phCreateModelFactory', createModelFactory);
    module.factory('phAcceptFactory', acceptFactory);
    module.factory('phBeforeHttpFactory', beforeHttpFactory);
    module.factory('phErrorHttpFactory', errorHttpFactory);

    module.constant('accept', 'accept');

})(angular.module('phCrud'));
(function (module, undefined) {

    phHttpFactory.$inject = ['$http'];
    function phHttpFactory(http) {

        var forEach = angular.forEach, service = {}, extend = angular.extend, isFunction = angular.isFunction;

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
(function (module, undefined) {


    phSuccessFactoryIndex.$inject = ['phSpinnerFactory', 'phStatusFactory', 'phCreateModelFactory']
    function phSuccessFactoryIndex(spinner, status, createModel) {
        return {
            hide: spinner.hide,
            status: status.setStatus,
            assignModel: createModel.assignModel
        }

    }

    phCommandIndex.$inject = ['phAcceptFactory'];
    function phCommandIndex(accept) {

        function nextPage(factory) {
            this.filter.page++;
            this.accept(factory);
        }
        function previousPage(factory) {
            if (this.filter.page === 0) return;
            this.filter.page--;
            this.accept(factory);
        }
        return {
            accept: accept.accept,
            nextPage: nextPage,
            previousPage: previousPage
        };

    }

    module.factory('phSuccessFactoryIndex', phSuccessFactoryIndex);
    module.factory('phCommandIndex', phCommandIndex);


    module.factory('phIndex', function () {
        return {
            as: 'index',
            init: 'index.filter={page:0,records:20}',
            method: 'query',
            service: 'phHttpFactory',
            cacheService: 'phCacheFactory',
            cache: '["filter"]',
            before: 'phBeforeHttpFactory',
            success: 'phSuccessFactoryIndex',
            error: 'phErrorHttpFactory',
            cmd: 'phCommandIndex',
            auto: 'accept'
        };
    });


})(angular.module('phCrud'));
(function (module, undefined) {


    module.factory('phPut', function () {
        return {
            as: 'put',
            init: 'put.model=edit.model',
            method: 'put',
            service: 'phHttpFactory',
            before: 'phBeforeHttpFactory',
            success: 'phSuccessFactoryCreate',
            error: 'phErrorHttpFactory',
            cmd: 'phCommandCreate',
            ajaxCmd: 'accept'
        };
    });

})(angular.module('phCrud'));
(function (module, undefined) {

    phResolveFactory.$inject = ['$injector', '$parse', 'phResolvePathService', '$location'];
    function phResolveFactory(injector, parse, resolvePath, location) {

        function resolveFactory(factory, path) {
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

})(angular.module('phCrud'));
(function (module, undefined) {

    resolvePath.$inject = ['$location'];
    function resolvePath(location) {

        function pathRegExp(path, opts) {
            var insensitive = opts.caseInsensitiveMatch,
                ret = {
                    originalPath: path,
                    regexp: path
                },
                keys = ret.keys = [];

            path = path
              .replace(/([().])/g, '\\$1')
              .replace(/(\/)?:(\w+)([\?\*])?/g, function (_, slash, key, option) {
                  var optional = option === '?' ? option : null;
                  var star = option === '*' ? option : null;
                  keys.push({ name: key, optional: !!optional });
                  slash = slash || '';
                  return ''
                    + (optional ? '' : slash)
                    + '(?:'
                    + (optional ? slash : '')
                    + (star && '(.+?)' || '([^/]+)')
                    + (optional || '')
                    + ')'
                    + (optional || '');
              })
              .replace(/([\/$\*])/g, '\\$1');

            ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
            return ret;
        }
        this.resolve = function (path) {
            if (!path) return { path: location.path() };

            if (path && path.indexOf('{{') === -1) return { path: path };

            return {
                path: path,
                regexPath: pathRegExp(path.replace(/\{+/g, ':').replace(/\}+/g, '').replace(/\./g, ''), { caseInsensitiveMatch: true })
            };
        }
    }

    module.service('phResolvePathService', resolvePath)

})(angular.module('phCrud'));