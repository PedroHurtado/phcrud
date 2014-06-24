(function (module,undefined) {

    phSucessFactoryDelete.$inject = ['$window', 'phSpinnerFactory'];
    function phSucessFactoryDelete(window, spinner) {
        return {
            hide: spinner.hide,
            back: function () {
                window.history.back();
            }
        };
    }


    module.factory('phSucessFactoryDelete', phSucessFactoryDelete)

    module.factory('phDelete', function () {
        return {
            as: 'delete',
            method: 'delete',
            service: 'phHttpFactory',
            before: 'phBeforeHttpFactory',
            success: 'phSucessFactoryDelete',
            error: 'phErrorHttpFactory',
            cmd: 'phCommandCreate',
            ajaxCmd: 'accept'
        };
    });

})(angular.module('phCrud'))