(function (module, undefined) {
   

    module.factory('phPut', function () {
        return {
            as: 'put',            
            method: 'put',
            service: 'phHttpFactory',            
            before: 'phBeforeHttpFactory',
            success: 'phSuccessFactoryCreate',
            error: 'phErrorHttpFactory',
            cmd: 'phCommandCreate',
            ajaxCmd: 'accept'
        };
    });

})(angular.module('phCrud'))