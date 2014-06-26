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