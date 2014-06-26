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