angular.module('BlocksApp').controller('MonitorStatusController', function($stateParams, $rootScope, $scope, $http, $location) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    $("#headHome").removeClass("active");
	$("#headCommunity").removeClass("active");
	$("#headStatus").addClass("active");
    
   var init = function () {
    	
    	$http({
    	      method: 'POST',
    	      url: '/getMonitors',
    	      data: {}
    	    }).success(function(monitors) {
    	    	$scope.microChainAddr = $rootScope.microChainAddr;
    	        $scope.monitors = monitors;
    	    });
    }
    
    init();

});