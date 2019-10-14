angular.module('BlocksApp').controller('ScTxController', function($stateParams, $rootScope, $scope, $http, $location) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });

    $("#headHome").addClass("active");
	$("#headCommunity").removeClass("active");
	$("#headStatus").removeClass("active");
	
    $scope.usedMonitorIp = $stateParams.txconfig.split("&")[0];
    $scope.usedMonitorPort = $stateParams.txconfig.split("&")[1];
    $scope.microChainAddr = $stateParams.txconfig.split("&")[2];
    $scope.rpcType = $stateParams.txconfig.split("&")[4];
    
    var requestScTx = function (params) {
		
		$http({
		method : 'POST',
		url : '/getScTxByHash',
		data : {
			"ip" : params.split("&")[0],
			"port": params.split("&")[1],
			"subChainAddress": params.split("&")[2],
			"hash": params.split("&")[3]
		}
		}).success(function(data) {
			$rootScope.$state.current.data["pageSubTitle"] = data.hash;
		    $scope.hash = data.hash;
		    $scope.blockNumber = data.blockNumber;
		    
		    $scope.datetime = new Date(data.timestamp *1000);
		    $scope.timestamp = data.timestamp;
		    $scope.from = data.from;
		    $scope.to = data.to;
		    $scope.value = data.value;
		    $scope.gas = data.gas;
		    $scope.gasPrice = data.gasPrice;
		    $scope.nonce = data.nonce;
		    $scope.status = data.status;
		    $scope.input = data.input;
		});
	}
    
    requestScTx($stateParams.txconfig);
})