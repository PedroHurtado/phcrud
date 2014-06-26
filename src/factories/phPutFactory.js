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