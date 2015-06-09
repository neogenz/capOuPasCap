appCapOuPasCap.controller('signin.ctrl', function ($scope, $state, authenticateWebApi, toastr) {

        (function scopeInit() {
            $scope.errorMessage = null;
        })();

        $scope.signin = function () {
            var formData = {
                email: $scope.email,
                password: $scope.password
            };

            authenticateWebApi.signin(formData, $scope).then(function () {
                $scope.errorMessage = null;
                $state.go('challenges');
            }, function (err) {
                console.log(err);
                toastr.warning(err, '');
            })
        };
    }
);