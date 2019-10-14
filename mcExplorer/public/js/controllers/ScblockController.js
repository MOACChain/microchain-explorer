angular.module('BlocksApp').controller('ScblockController',    
		function($stateParams, $rootScope, $scope, $http) {
			$scope.$on('$viewContentLoaded', function() {
				App.initAjax();
			});
			
			$("#headHome").addClass("active");
			$("#headCommunity").removeClass("active");
			$("#headStatus").removeClass("active");
			
			var ajaxbg = $("#scbackground,#progressBar");
			ajaxbg.show(); 
			
			
			
			$scope.init = function () {
		    	
		    	$http({
		    	      method: 'POST',
		    	      url: '/getConfig',
		    	      data: {}
		    	    }).success(function(configRes) {
		    	    	
		    	    	// 设置全局变量，当前子链所有monitor信息，正在使用的monitor, tunnel
		    	    	
		    	    	if (configRes == 0) {
		    	    		alert("no monitor can be connected!");
		    	    	} else {
		    	    		$rootScope.tunnel = configRes.tunnel;
			    	    	$rootScope.monitors = configRes.monitors;
			    	    	
			    	    	$rootScope.usedMonitorIp = configRes.monitor.split(":")[0];
							$rootScope.usedMonitorPort = configRes.monitor.split(":")[1];
			    	    	
			    	    	
			    	    	if ($rootScope.usedMonitorIp == null || $rootScope.usedMonitorPort == null) {
			    	    		alert("no monitor can be connected!");
			    	    	} else {
			    	    		$http({
			      	    	      method: 'POST',
			      	    	      url: '/getMcStatus',
			      	    	      data: {"ip": $rootScope.usedMonitorIp, "port": $rootScope.usedMonitorPort, "microChainAddr": configRes.microChainAddress, "tunnel": configRes.tunnel}
			      	    	    }).success(function(status) {
			      	    	    	
			      	    	    	if (status == 1 || status == 2) {  // rpc正常flush正常，rpc正常flush异常，都可以查看
					      	  			
					      	  			$scope.usedMonitorIp = $rootScope.usedMonitorIp;
					      	  			$scope.usedMonitorPort = $rootScope.usedMonitorPort;
					      	  			
					      	  			$rootScope.microChainAddr = configRes.microChainAddress;
					      	  			
					      	  			$scope.microChainAddr = configRes.microChainAddress;
					      	  			$scope.subChainAddress = configRes.microChainAddress;
					      	  			$scope.rpcType = configRes.tunnel;
					      	  			$rootScope.rpcType = configRes.tunnel;
					      	  			
					      	  			$scope.watchStatus = 1;
					      	  			
					      	  			$scope.community_item1 = configRes.community_item1;
					      	  			$scope.community_item1_url = configRes.community_item1_url;
					      	  			$scope.community_item2 = configRes.community_item2;
					      	  			$scope.community_item2_url = configRes.community_item2_url;
					      	  			
					      	  			$rootScope.monitors = JSON.stringify(configRes.monitors);
					      	  			
			      						$scope.initInfo();
			      					} else if (status == 0) {
			      						alert("The monitor cannot connect, please check!");
			      					}
			      	    	    	
			      	    	    });
			    	    	}
		    	    	}
		    	    	
		    	    	
//		    	    	for (var i = 0; i < configRes.monitors.length; i++) {
//							if (configRes.monitors[i].status == "success") {
//								$rootScope.usedMonitorIp = configRes.monitors[i].monitorHost.split(":")[0];
//								$rootScope.usedMonitorPort = configRes.monitors[i].monitorHost.split(":")[1];
//								break;
//							}
//		    	    	}
		    	    	
		    	    });
		    	
		    }
			$scope.init();
			
			
			$scope.initInfo = function () {
				
				$http({
				method : 'POST',
				url : '/subchain',
				data : {
					"ip" : $scope.usedMonitorIp,
					"port": $scope.usedMonitorPort,
					"subChainAddress": $scope.microChainAddr,
					"rpcType": $scope.rpcType
				}
				}).success(function(data) {
					if (data == "fail") {
						ajaxbg.hide(); 
						alert("Connect fail, please check your microchain configuration!");
						window.location.href= "http://" + window.location.host + "/scinfo"
					} else if (data == "timeout") {
						alert("The monitor rpc timeout, please try again later!");
					} else {
						ajaxbg.hide(); 
						
		    	    	$('#communityspan1').html($scope.community_item1);
		    	    	$('#communitya1').attr('href', $scope.community_item1_url); 

		    	    	$('#communityspan2').html($scope.community_item2);
		    	    	$('#communitya2').attr('href', $scope.community_item2_url);
		    	    	
		    	    	$('#headerIp').val($rootScope.usedMonitorIp);
		    	    	$('#headerPort').val($rootScope.usedMonitorPort);
		    	    	$('#headerMicroChainAddr').val($scope.microChainAddr);
		    	    	$('#headerRpcType').val($scope.rpcType);
		    	    	
		    	    	
						data.info.BlockReward = parseFloat((data.info.BlockReward / Math.pow(10, 18)).toFixed(8));
						data.info.ViaReward = parseFloat((data.info.ViaReward / Math.pow(10, 18)).toFixed(8));
						data.info.TxReward = parseFloat((data.info.TxReward / Math.pow(10, 18)).toFixed(8));
						
						$scope.info = data.info;
						
						$scope.latest_blocks = data.latestBlockArr;
						$scope.scsBalanceList = data.scsBalanceList;
						$scope.subchainBalance = parseFloat(data.subchainBalance.toFixed(8));
						
						$scope.type = data.type;
						
						$scope.protocolType = data.protocolType;
						
						if (data.protocolType == 0) {
							$scope.protocolTypeStr = "ProcWind";
						} else if (data.protocolType == 1) {
							$scope.protocolTypeStr = "FIleStorm";
						} else if (data.protocolType == 2) {
							$scope.protocolTypeStr = "RMCM";
						} else {
							$scope.protocolTypeStr = "Other";
						}
						
						$scope.status = data.status;
						$scope.totalExchange = parseFloat(data.totalExchange.toFixed(8));
						$scope.totalOperation = parseFloat(data.totalOperation.toFixed(8));
						$scope.totalBond = parseFloat(data.totalBond.toFixed(8));
						
					}
					
				});
			}
			
			$scope.reloadBlocks = function () {
				
				$scope.initInfo();
			}
			
			
});


