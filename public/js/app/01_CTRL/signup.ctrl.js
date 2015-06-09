appCapOuPasCap.controller('signup.ctrl', function ($rootScope, $scope, $location, $state, $localStorage, authenticateWebApi) {

        (function init() {
            $scope.email = null;
            $scope.lastName = null;
            $scope.firstName = null;
            $scope.password = null;
            $scope.passwordConfirm = null;
        })();

        $scope.signup = function (formIsValid) {
            if ($scope.password != $scope.passwordConfirm) {
                $scope.signupForm.passwordConfirm.$invalid = true;
                return;
            }
            if (formIsValid) {
                var formData = {
                    email: $scope.email,
                    password: $scope.password,
                    firstName: $scope.firstName,
                    lastName: $scope.lastName
                };

                authenticateWebApi.signup(formData).then(function () {
                    $state.go('challenges');
                }, function (err) {
                    console.log(err);
                    $rootScope.error = 'Failed to signup';
                });
            }
        };
    }
);