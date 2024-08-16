(function () {
    'use strict';
    var app = angular.module('uiApp', [
        'ngAnimate',
        'ngResource',
        'ngSanitize',
        'toaster',
        'ngProgress',
        'ui.router',
        'cfp.hotkeys'
    ]).factory('authInterceptor', function ($q) {
        return {
            request: function (config) {
                var vUrl = config.url;
                if (vUrl && (
                    // html bắt đầu với `/partials` là static files của dự án
                    (vUrl.endsWith('.html') && /^\/(partials|js)/.test(vUrl))
                    || ['.css', '.js'].some(x => vUrl.endsWith(x))
                )) {
                    config.url = vUrl + '?v=' + _version;
                }
                return config;
            }
        }
    }).run(['$rootScope', '$state', '$stateParams', '$http', function ($rootScope, $state, $stateParams, $http) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            console.log('$state change: ', fromState, toState);
            $(".popup").remove();
            $(".bModal").remove();
            $(".iframePrintPage").remove();
        });
        $http({
            method: 'GET',
            url: _apicd + 'api/HTConfig/ConfigFooter'
        }).success(function (res) {
            if (res) {
                $rootScope.configFooter = res || { Value: '', GhiChu: '' };
            }
        });
    }]).service('_reloadState_', ['$rootScope', '$state', '$window', function ($rootScope, $state, $window) {
        var once = $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            console.log('$state reload by redirect: ', toState);
            once(); // de-register first
            let target = $state.href(toState, toParams, {
                absolute: false
            });
            $window.location.href = target;
            // do not change $state, just redirect & reload page.
            return event.preventDefault();
        });
    }]).config(['$locationProvider', '$stateProvider', '$urlRouterProvider',
        function ($locationProvider, $stateProvider, $urlRouterProvider) {
            // use the HTML5 History API
            $locationProvider.html5Mode(true);
            $urlRouterProvider.otherwise(function ($injector, $location) {
                let state = $injector.get('$state');
                state.go('notfound', {
                    url: $location.path()
                });
                return $location.path();
            });
            console.log('config, app_base-controller.states');
            ///////////////////////////
            // State Configurations ///
            ///////////////////////////

            $stateProvider
                .state('root', {
                    title: 'home',
                    url: '/',
                    templateUrl: '/partials/home.html',
                    controller: 'HomeCtrl'
                })
                .state('notfound', {
                    url: '/not-found/?url',
                    parent: 'thpt',
                    templateUrl: '/partials/notfound.html',
                    controller: ['$scope', function ($scope) {
                        $scope.notFoundUrl = $scope.$stateParams.url;
                    }]
                })
                .state('profile', {
                    url: '/profile',
                    templateUrl: '/partials/profile.html',
                    controller: 'ProfileCtrl'
                })
                .state('dat-sach', {
                    title: 'datsach',
                    url: '/dat-sach',
                    templateUrl: '/partials/dat-sach.html',
                    controller: 'DatSachCtrl'
                })
                .state('chuyen-khoan', {
                    title: 'datsach',
                    url: '/chuyen-khoan',
                    templateUrl: '/partials/chuyen-khoan.html',
                    controller: 'ChuyenKhoanCtrl'
                })
                .state('lich-su', {
                    url: '/lich-su',
                    templateUrl: '/partials/lich-su.html',
                    controller: 'LichSuCtrl'
                })
                .state('gioi-thieu', {
                    url: '/gioi-thieu/:id',
                    templateUrl: '/partials/gioi-thieu.html',
                    controller: 'GioiThieuCtrl'
                })
                .state('thanh-toan-vmn', {
                    url: '/thanh-toan-vmn/:id',
                    templateUrl: '/partials/thanh-toan.html',
                    controller: 'ThanhToanCtrl'
                })
                .state('don-hang', {
                    url: '/don-hang/:id',
                    templateUrl: '/partials/don-hang.html',
                    controller: 'DonHangCtrl'
                })
            $urlRouterProvider.rule(function ($injector, $location) {
                if ($location.protocol() === 'file')
                    return;

                var path = $location.path()
                    // Note: misnomer. This returns a query object, not a search string
                    ,
                    search = $location.search(),
                    params;

                // check to see if the path already ends in '/'
                if (path[path.length - 1] === '/') {
                    return;
                }

                // If there was no search string / query params, return with a `/`
                if (Object.keys(search).length === 0) {
                    return path + '/';
                }

                // Otherwise build the search string and return a `/?` prefix
                params = [];
                angular.forEach(search, function (v, k) {
                    params.push(k + '=' + v);
                });
                return path + '/?' + params.join('&');
            });

        }
    ]);
})();