(function (module,undefined) {

   
    phSuccessFactoryEdit.$inject = ['phSpinnerFactory', 'phStatusFactory', 'phCreateModelFactory']
    function phSuccessFactoryEdit(spinner, status, createModel) {
        return {
            hide: spinner.hide,
            status: status.setStatus,
            createModel: createModel.createModel
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