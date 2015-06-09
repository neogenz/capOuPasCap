appCapOuPasCap.controller('home.ctrl', function($localStorage, $state){
    if ($localStorage.token && $localStorage.token !== "") {
        $state.go('challenges');
    }
});