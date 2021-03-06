﻿(function (module, undefined) {

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