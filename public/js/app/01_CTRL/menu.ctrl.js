'user strict';

appCapOuPasCap.controller('menu.ctrl',
    function ($scope, $modal, userWebApi, $rootScope) {
        (function init() {
            $scope.users = [];

            $scope.openUsersListModalListener = function () {
                userWebApi.findAll().then(function (users) {
                    $scope.users = users;
                    openUserListModal();
                }, function (err) {
                    console.log(err);
                    throw new Error(err);
                });
            };

        })();

        function openUserListModal() {
            var userListModalOpts = {
                templateUrl: 'views/modal/user.list', // Url du template HTML
                controller: 'user.list.ctrl',
                resolve: {
                    users: function () {
                        return $scope.users;
                    }
                }
            };

            var modalInstance = $modal.open(userListModalOpts);
            modalInstance.result.then(function () {
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }
    }
);