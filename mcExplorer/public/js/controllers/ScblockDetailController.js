angular.module('BlocksApp').controller('ScblockDetailController', function($stateParams, $rootScope, $scope, $http, $location) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
        //TableAjax.init();
    });
    
    $("#headHome").addClass("active");
	$("#headCommunity").removeClass("active");
	$("#headStatus").removeClass("active");
	

    $rootScope.$state.current.data["pageSubTitle"] = $stateParams.subchainBlockConfig.split("&")[0];
    
    //
    $scope.blockNum = $stateParams.subchainBlockConfig.split("&")[0];
    $scope.usedMonitorIp = $stateParams.subchainBlockConfig.split("&")[1];
    $scope.usedMonitorPort = $stateParams.subchainBlockConfig.split("&")[2];
    $scope.microChainAddr = $stateParams.subchainBlockConfig.split("&")[3];
    $scope.rpcType = $stateParams.subchainBlockConfig.split("&")[4];
    $scope.initInfo = function () {
		
    	$http({
    	      method: 'POST',
    	      url: '/subchainBlock',
    	      data: {"blockNum": $scope.blockNum, "ip": $scope.usedMonitorIp,
    	    	  "port": $scope.usedMonitorPort,
    	    	  "subChainAddress": $scope.microChainAddr,
    	    	  "rpcType": $scope.rpcType,
    	      },
    	    }).success(function(data) {
    	      if (data.error) {
    	      }
    	      else {
    	        $scope.blockDetail = data;
    	        $scope.blockDetail.datetime = new Date(data.Header.timestamp*1000); 
    	       // $scope.block.datetime = new Date(data.timestamp*1000); 
    	      }
    	    });
	}
	$scope.initInfo();
	
})