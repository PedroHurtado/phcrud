(function (angular, undefined) {
    if (!angular) return;    
    angular.module('phCrud', ['ngRoute']);
    angular.isEmpty = angular.isEmpty || (function (obj) {
        for (var p in obj) {
            if (obj.hasOwnProperty(p))  return false; 
        }
        return true;
    });
}
)(window.angular);