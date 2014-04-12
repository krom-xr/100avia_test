/*global angular, _ */
angular.module('TEST', [])
    .controller("MainCtrl", function($scope, ItemsSrv) {
        $scope.items = ItemsSrv;

    }).factory('ItemsSrv', function($timeout) {
        var item_example = {key: {value: ""}, value: {value:""}};

        var items = {
            items: [_.cloneDeep(item_example)],
            addItem: function() {
                !this.checkItemError(this.items[0]) &&
                    this.items.unshift(_.cloneDeep(item_example));
            },
            checkItemError: function(item) {
                !item.key.value && this.setFieldError(item.key);
                !item.value.value && this.setFieldError(item.value);
                return !item.key.value || !item.value.value;
            },
            setFieldError: function(field) {
                field.error = true;
                $timeout(function() { field.error = false; }, 1000);
            },
            save: function() {

                if (this.items.length === 1 && this.checkItemError(this.items[0])) { return; }


                var data = [];
                _.each(this.items, function(item) {
                    if (item.key.value && item.value.value) {
                        data.push({key: item.key.value, value: item.value.value});
                    }
                });

                $.ajax({
                    url: "http://httpbin.org/post",
                    method: 'POST',
                    data: {data: data},
                    success: function(data) {
                        console.log(data);
                    }
                });

            }
        };
        return items;
    })

    .controller("ListCtrl", function($scope, ItemsList) {
        $scope.list = ItemsList;


    }).factory('ItemsList', function() {
        var list = {
            items: [
                {key: 'keyfds', value: 'vasdfalue', full_info: "yesssadf dd", show_full: false},
                {key: 'keyfds', value: 'vasdfalue', full_info: "yesssadf dd", show_full: true}
            ],
            showFull: function(item, state) {
                item.show_full = state;
            },
        };
        return list;
    })

    .directive("ngWith", function() {
        var createScopes = function(scope, scope_vars_ob) {
            if (!scope_vars_ob) { return; }
            _.each(scope_vars_ob, function(value, key) { scope[key] = value; });

        };
        return {
            scope: true,
            compile: function (tElement, tAttr) {
                return function(scope, element, attrs) {
                    scope.$watch(function() {
                        var scope_vars_ob = scope.$eval(attrs.ngWith);
                        createScopes(scope, scope_vars_ob);
                    });

                };
            }
        };
    });
    
