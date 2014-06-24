(function (module,undefined) {

    phSuccessFactoryCreate.$inject = ['$window', 'phSpinnerFactory','phStatusFactory'];
    function phSuccessFactoryCreate(window,spinner,status) {        

        function assignData(response) {
            var extend = angular.extend;
            this.model = extend(this.model, response.data || {});
        }
        function back(){
            window.history.back();
        }        
        return {
            hide: spinner.hide,
            status: status.setStatus,
            assignData: assignData,
            back: back
        };
    }

    phCommandCreate.$inject = ['phAcceptFactory', '$window']
    function phCommandCreate(phAcceptFactory,$window) {
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
            ajaxCmd:'accept'
        };
    });

})(angular.module('phCrud'))