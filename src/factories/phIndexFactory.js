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