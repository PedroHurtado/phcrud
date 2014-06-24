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
            ajaxButton: 'accept'
        };
    });

})(angular.module('phCrud'))