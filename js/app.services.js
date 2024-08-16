(function () {
    'use strict';
    var app = angular.module('uiApp');
    app.factory('svCanhDieu', ['$resource', function ($resource) {
        var baseUrl = _apicd + 'api';
        var vm = $resource(baseUrl + '/:tbName/:id',
            {
                id: '@id', tbName: '@tbName', fName: '@fName'
            },
            {
                'createOrUpdate': { method: 'POST' },
                'getAll': { method: 'GET', isArray: true },
                'show': { method: 'GET' },
                'delete': { method: 'DELETE' },
                'deactivate': {
                    method: 'POST',
                    url: baseUrl + '/:tbName/unActive',
                },
                'showPage': {
                    method: 'GET',
                    params: {
                        sSearch: '@sSearch',
                        from: '@from',
                        to: '@to',
                        iPageIndex: '@iPageIndex',
                        iPageSize: '@iPageSize'
                    },
                    url: baseUrl + '/:tbName/showPage',
                },
                'get': {
                    method: 'GET',
                    url: baseUrl + '/:tbName/:fName',
                },
                'getstr': {
                    method: 'GET',
                    url: baseUrl + '/:tbName/:fName',
                    transformResponse: function (data) {
                        return {
                            str: angular.fromJson(data)
                        };
                    }
                },
                'getList': {
                    method: 'GET',
                    url: baseUrl + '/:tbName/:fName',
                    isArray: true
                },
                'post': {
                    method: 'POST',
                    url: baseUrl + '/:tbName/:fName',
                },
                'poststr': {
                    method: 'POST',
                    url: baseUrl + '/:tbName/:fName',
                    transformResponse: function (data) {
                        return {
                            str: angular.fromJson(data)
                        };
                    }
                },
                'postList': {
                    method: 'POST',
                    url: baseUrl + '/:tbName/:fName',
                    isArray: true
                },
                'deleteMultipleFile': {
                    method: 'POST',
                    url: baseUrl + '/files/delete-multiple',
                    params: { delFile: '@delFile' }
                },
            });
        return vm;
    }]);

    app.factory('svApi', ['$resource', function ($resource) {
        var baseUrl = localStorage.getItem('apiUrl') + '/app';
        var vm = getApiResource($resource);
        var vmPrototype = vm.prototype;
        vm.uploadfile = vmPrototype.uploadfile = function (info, dsFiles) {
            var token = localStorage.getItem('bearerToken');
            var data = new FormData();
            _.each(dsFiles, (x) => data.append('files', x));
            return new Promise((resolve, reject) => {
                var ajaxRequest = $.ajax({
                    url: baseUrl + `/files/upload/${info.folder}?delFile=${info.delFile || ''}`,
                    type: 'POST',
                    dataType: 'json',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    },
                    contentType: false,
                    processData: false,
                    data: data,
                });
                ajaxRequest.done(resolve);
                ajaxRequest.fail(reject);
            });
        }

        vm.updatetable = vmPrototype.updatetable = function (info, dsFiles) {
            var token = localStorage.getItem('bearerToken');
            var data = new FormData();
            _.each(dsFiles, (x) => data.append('photos', x));
            if (info && typeof info === 'object') {
                Object.keys(info).filter(x => x != 'tbName' && x != 'fName').map((p) => {
                    data.append(p, info[p]);
                });
            }
            return new Promise((resolve, reject) => {
                var ajaxRequest = $.ajax({
                    url: baseUrl + `/${info.tbName}/${info.fName}`,
                    type: 'POST',
                    dataType: 'json',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    },
                    contentType: false,
                    processData: false,
                    data: data,
                });
                ajaxRequest.done(resolve);
                ajaxRequest.fail(reject);
            });
        }
        return vm;
    }]);
    app.service('svAlert', function () {
        this.show = function (title, message, icon, handlerYes, option) {
            $("#alertPopup").remove();
            let sBuild = `<div id="alertPopup" class="popup alert" style="display: none;">`;
            sBuild += "<div class='alert-icon'><img src='/img/icons/" + (icon || 'warning.svg') + "' /></div>";
            sBuild += '<div class="alert-body">';
            sBuild += "<div class='title'>" + title + "</div>";
            sBuild += "<div class='content'>" + message + "</div>";
            sBuild += '</div>';
            sBuild += `<a href="javascript:void(0)" id="btnOK" class="btn btn-primary btn-lg" style="min-width: 100px">Ok</a>`;
            sBuild += '</div>';
            $('body').append(sBuild);
            $("#alertPopup").bPopup(option);
            let btn = $("#alertPopup").find("#btnOK");
            btn.click(() => {
                $("#alertPopup").bPopup().close();
                $("#alertPopup").remove();
                if (handlerYes) handlerYes();
            });
            setTimeout(() => { btn.focus(); }, 10);
        }
        this.confirm = function (title, message, handlerYes, handlerNo, icon, option, textYes, textNo) {
            $("#confirmPopup").remove();
            let sBuild = `<div id="confirmPopup" class="popup alert" style="display: none;">`;
            sBuild += "<div class='alert-icon'><img src='/img/icons/" + (icon || 'warning.svg') + "' /></div>";
            sBuild += '<div class="alert-body">';
            sBuild += "<div class='title'>" + title + "</div>";
            sBuild += "<div class='content'>" + message + "</div>";
            sBuild += '</div>';
            sBuild += '<div class="alert-button">';
            sBuild += `<a href="javascript:void(0)" id="btnNO" class="btn btn-white btn-lg" style="min-width: 100px" tabindex="0">${textNo || 'Không'}</a>`;
            sBuild += `<a href="javascript:void(0)" id="btnOK" class="btn btn-primary btn-lg" style="min-width: 100px" tabindex="1">${textYes || 'Đồng ý'}</a>`;
            sBuild += '</div>';
            sBuild += '</div>';
            $('body').append(sBuild);
            $("#confirmPopup").bPopup(option || {

            });
            let btnOK = $("#confirmPopup").find("#btnOK");
            btnOK.click(() => {
                if (handlerYes) handlerYes();
                $("#confirmPopup").bPopup().close();
                $("#confirmPopup").remove();
            });
            let btnNO = $("#confirmPopup").find("#btnNO");
            btnNO.click(() => {
                if (handlerNo) handlerNo();
                $("#confirmPopup").bPopup().close();
                $("#confirmPopup").remove();
            });
            $("#confirmPopup").jkey('right', function () {
                var currentElement = $(document.activeElement); // ID set by OnFocusIn
                //var currentElement = $get(currentElementId); // ID set by OnFOcusIn
                var curIndex = currentElement[0].tabIndex; //get current elements tab index
                if (curIndex == 0) btnOK.focus();
            });
            $("#confirmPopup").jkey('left', function () {
                var currentElement = $(document.activeElement); // ID set by OnFocusIn
                //var currentElement = $get(currentElementId); // ID set by OnFOcusIn
                var curIndex = currentElement[0].tabIndex; //get current elements tab index
                if (curIndex == 1) btnNO.focus();
            });
            setTimeout(() => { btnOK.focus(); }, 10);
        }
    });

    app.filter('trusted', function ($sce) {
        return function (html) {
            return $sce.trustAsHtml(html)
        }
    })
    app.filter('numberFixedLen', function () {
        return function (n, len) {
            var num = parseInt(n, 10);
            len = parseInt(len, 10);
            if (isNaN(num) || isNaN(len)) {
                return n;
            }
            num = '' + num;
            while (num.length < len) {
                num = '0' + num;
            }
            return num;
        };
    });
    app.filter('strDate', function () {
        return function (value, format) {
            const Date = moment(value, format || EFormat.DateISO);
            const index = Date.day();
            return (index != 0 ? 'Thứ ' + (index + 1) : 'Chủ nhật') + ' ' + Date.format(EFormat.DateInViewNgay);
        };
    });
    app.filter('tien', function () {
        return function (value) {
            let result = formatCurrency(value || 0);
            return result;
        };
    });

    app.filter('substr', function () {
        return function (value, start, end) {
            let result = value?.substring(start, end);
            if (value?.length > end) {
                result += '...';
            }
            return result;
        };
    });
    app.filter('appUrl', function () {
        return function (value) {
            return _urlcdn + value;
        };
    });
    app.filter('filterStr', function () {
        return function (value, strSearch) {
            return value?.filter(x => strTimKiem(x.StrSearch || x.Ten || '', strSearch));;
        };
    });
    app.directive('bgImg', [function () {
        return {
            restrict: 'C',
            link: function (scope, element, attrs) {
                var bg = attrs.bg;
                $(element).css('background-image', 'url(' + bg + ')');
            }
        };
    }]);

    app.directive("mathjaxBind", function () {
        return {
            restrict: "A",
            controller: ["$scope", "$element", "$attrs",
                function ($scope, $element, $attrs) {
                    $scope.$watch($attrs.mathjaxBind, function (texExpression) {
                        texExpression = texExpression || "";
                        texExpression = texExpression.replace(/^\<p\>/, "").replace(/\<\/p\>$/, "");
                        $element.html(texExpression);
                        if (typeof MathJax != "undefined") {
                            MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]]);
                        }
                    });
                }]
        };
    });

    app.directive('checkDapan', function () {
        return {
            restrict: 'AC',
            link: function (scope, tElement, attr) {
                var dataId = newGuid();
                tElement.attr("id", dataId);
                var template = "<label class='check-box' for='" + dataId + "'><div class='check-label'>" + (attr.title || '') + "</div></label>";
                tElement.after(template);
                if (attr.mathml && typeof MathJax != "undefined") {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, template]);
                }
            }
        };
    });


    app.directive("ngProgress", function () {
        return {
            restrict: "A",
            controller: ["$scope", "$element", "$attrs",
                function ($scope, $element, $attrs) {
                    $scope.$watch($attrs.ngProgress, function (value) {
                        $element.width(value + "%");
                    });
                }]
        };
    });
})();

function getApiResource(resource) {
    var baseUrl = localStorage.getItem('apiUrl') + '/app';
    return resource(baseUrl + '/:tbName/:id',
        {
            id: '@id', tbName: '@tbName', fName: '@fName'
        },
        {
            'createOrUpdate': { method: 'POST' },
            'getAll': { method: 'GET', isArray: true },
            'show': { method: 'GET' },
            'delete': { method: 'DELETE' },
            'deactivate': {
                method: 'POST',
                url: baseUrl + '/:tbName/unActive',
            },
            'showPage': {
                method: 'GET',
                params: {
                    sSearch: '@sSearch',
                    from: '@from',
                    to: '@to',
                    iPageIndex: '@iPageIndex',
                    iPageSize: '@iPageSize'
                },
                url: baseUrl + '/:tbName/showPage',
            },
            'get': {
                method: 'GET',
                url: baseUrl + '/:tbName/:fName',
            },
            'getbyid': {
                method: 'GET',
                url: baseUrl + '/:tbName/:fName/:ma',
            },
            'getstr': {
                method: 'GET',
                url: baseUrl + '/:tbName/:fName',
                transformResponse: function (data) {
                    return {
                        str: angular.fromJson(data)
                    };
                }
            },
            'getList': {
                method: 'GET',
                url: baseUrl + '/:tbName/:fName',
                isArray: true
            },
            'post': {
                method: 'POST',
                url: baseUrl + '/:tbName/:fName',
            },
            'poststr': {
                method: 'POST',
                url: baseUrl + '/:tbName/:fName',
                transformResponse: function (data) {
                    return {
                        str: angular.fromJson(data)
                    };
                }
            },
            'postList': {
                method: 'POST',
                url: baseUrl + '/:tbName/:fName',
                isArray: true
            },
            'deleteMultipleFile': {
                method: 'POST',
                url: baseUrl + '/files/delete-multiple',
                params: { delFile: '@delFile' }
            },
        });
}

