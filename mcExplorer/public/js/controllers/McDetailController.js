angular.module('BlocksApp').controller('McDetailController', function($stateParams, $scope, $scope, $http, $location) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    
    $("#headHome").addClass("active");
	$("#headCommunity").removeClass("active");
	$("#headStatus").removeClass("active");
	
    $scope.microChainAddr = $stateParams.hash.split("&")[0];
    $scope.usedMonitorIp = $stateParams.hash.split("&")[2];
    $scope.usedMonitorPort = $stateParams.hash.split("&")[3];
    $scope.rpcType = $stateParams.hash.split("&")[4];
    
    if ($stateParams.hash.split("&")[1] == "0x") {
    	// microChain页面
        $scope.address = "";
        
    } else if ($stateParams.hash.split("&")[1] != "0x"){
    	// microChain addr页面
    	 $scope.address = $stateParams.hash.split("&")[1];
    }
   
    $scope.fetchDappList = function() {
    	$http({
			method : 'POST',
			url : '/dappList',
			data : {
				"microChainAddr": $scope.microChainAddr,
				"addr": $scope.address,
				"monitorIp": $scope.usedMonitorIp,
				"monitorPort": $scope.usedMonitorPort
			}
		}).success(function(data) {
          if (data != "0") {
        	  $scope.dappList = data.dappList;
        	  
        	  if ($scope.rpcType == "rpc debug") {
        		  $scope.rpcType = "rpc%20debug";
        	  } 
        	  $scope.dappList = data.dappList;
        	  $scope.balance = data.balance;
        	  $scope.fetchMcTxs();
          }
          
		});
    }
    
    //fetch transactions
    $scope.fetchMcTxs = function() {
      $("#table_txs").dataTable({
    	  retrieve: true,
        processing: true,
        serverSide: true,
        paging: true,
        ajax: {
          url: '/mcTx',
          type: 'POST',
          data: { "microChainAddr": $scope.microChainAddr, "addr": $scope.address}
        },
        "lengthMenu": [
                    [10, 20, 50],
                    [10, 20, 50] // change per page values here
                ],
        "pageLength": 20, 
        "language": {
          "lengthMenu": "_MENU_ transactions",
          "zeroRecords": "No transactions found",
          "infoEmpty": ":(",
          "infoFiltered": "(filtered from _MAX_ total txs)"
        },
        "searching": true,
        "columnDefs": [ 
          //{"type": "date", "targets": 6},
          { "render": function(data, type, row) {
        	  	
                        if ($scope.address == "") {
                        	// 子链页
                        	if (data == $scope.microChainAddr) {
                        		
                        		return getPartialRemarksHtml(data, 34)
                        		
                        	} else {
                        		return '<a class = "mc-a" href="/mcDetail/'+$scope.microChainAddr + "&" + data + "&" + 
                        		$scope.usedMonitorIp + "&" +$scope.usedMonitorPort + "&" + $scope.rpcType +'">'+getPartialRemarksHtml(data, 34)+'</a>'
                        	}
                        } else {
                        	// 地址页
                        	if (data == $scope.address) {
                        		
                        		return getPartialRemarksHtml(data, 34)
                        		
                        	} else {
                        		if (data == $scope.microChainAddr) {
                        			// 如果是子链地址
                        			return '<a class = "mc-a" href="/mcDetail/'+$scope.microChainAddr + "&0x&" + $scope.usedMonitorIp + 
                            		 "&" + $scope.usedMonitorPort + "&" + $scope.rpcType +'">'+getPartialRemarksHtml(data, 34)+'</a>'
                        		} else {
                        			// 如果不是子链地址
                        			return '<a class = "mc-a" href="/mcDetail/'+$scope.microChainAddr + "&" + data + "&" + $scope.usedMonitorIp + 
                        			"&" + $scope.usedMonitorPort + "&" + $scope.rpcType +'">'+getPartialRemarksHtml(data, 34)+'</a>'
                        		}
                        		
                        	}
                        }
                         
                      }, "targets": [2,3]},
          { "render": function(data, type, row) {
        	  	var urlParam = data + "&" + $scope.usedMonitorIp + "&" + $scope.usedMonitorPort + "&" + $scope.microChainAddr + "&" + $scope.rpcType;
                        return '&nbsp;&nbsp;<a class = "mc-a" href="/subchainBlock/'+urlParam+'">'+data+'</a>'
                      }, "targets": [1]},
          { "render": function(data, type, row) {
        	  var urlParam = $scope.usedMonitorIp + "&" + $scope.usedMonitorPort + "&" + $scope.microChainAddr + "&" + data + "&" + $scope.rpcType;
                        return '<a class = "mc-a" href="/sctx/'+urlParam+'">'+data+'</a>'
                      }, "targets": [0]},
            { "render": function(data, type, row) {
              return "&nbsp;&nbsp;" + data/1000000000000000000;
            }, "targets": [4]},
          { "render": function(data, type, row) {
              return ''+data+''
              }, "targets": [3]},
          { "render": function(data, type, row) {
        	  //alert(getDuration(data).toString());
        	  return transformTimeFromStamp(data * 1000, "datetime");
                      }, "targets": [5]},
          ],
          initComplete:function(){
        	  $("input[type=search]").attr("placeholder","Address / Hash");
          }
      });
      
    }
    // Internal txs
    $scope.fetchMcInternalTxs = function() {
      $("#table_internal_txs").dataTable({
    	  retrieve: true,
        processing: true,
        serverSide: true,
        paging: true,
        ajax: {
          url: '/mcInternalTxs',
          type: 'POST',
          data: {"microChainAddr": $scope.microChainAddr, "addr": $scope.address}
        },
        "lengthMenu": [
                    [10, 20, 50],
                    [10, 20, 50] // change per page values here
                ],
        "pageLength": 20, 
        "language": {
          "lengthMenu": "_MENU_ transactions",
          "zeroRecords": "No internal txs found",
          "infoEmpty": ":(",
          "infoFiltered": "(filtered from _MAX_ total txs)"
        },
        "searching": true,
        "columnDefs": [ 
//          {"type": "date", "targets": 6},
          { "render": function(data, type, row) {
        	  		
        	  
        	  if ($scope.address == "") {
              	// 子链页
              	if (data == $scope.microChainAddr) {
              		
              		return getPartialRemarksHtml(data, 25)
              		
              	} else {
              		return '<a class = "mc-a" href="/mcDetail/'+$scope.microChainAddr + "&" + data + "&" + 
              		$scope.usedMonitorIp + "&" +$scope.usedMonitorPort + "&" + $scope.rpcType +'">'+getPartialRemarksHtml(data, 25)+'</a>'
              	}
              } else {
              	// 地址页
              	if (data == $scope.address) {
              		
              		return getPartialRemarksHtml(data, 25)
              		
              	} else {
              		if (data == $scope.microChainAddr) {
              			// 如果是子链地址
              			return '<a class = "mc-a" href="/mcDetail/'+$scope.microChainAddr + "&0x&" + $scope.usedMonitorIp + 
                  		 "&" + $scope.usedMonitorPort + "&" + $scope.rpcType +'">'+getPartialRemarksHtml(data, 25)+'</a>'
              		} else {
              			// 如果不是子链地址
              			return '<a class = "mc-a" href="/mcDetail/'+$scope.microChainAddr + "&" + data + "&" + $scope.usedMonitorIp + 
              			"&" + $scope.usedMonitorPort + "&" + $scope.rpcType +'">'+getPartialRemarksHtml(data, 25)+'</a>'
              		}
              		
              	}
              }
        	  
//        	  if ($scope.address == "") {
//              	// 子链页
//              	if (data == $scope.microChainAddr) {
//              		
//              		return getPartialRemarksHtml(data, 25)
//              		
//              	} else {
//              		return '<a class = "mc-a" href="/mcDetail/'+$scope.microChainAddr + "&" + data+'">'+getPartialRemarksHtml(data, 25)+'</a>'
//              	}
//              } else {
//              	// 地址页
//              	if (data == $scope.address) {
//              		
//              		return getPartialRemarksHtml(data, 25)
//              		
//              	} else {
//              		if (data == $scope.microChainAddr) {
//              			// 如果是子链地址
//              			return '<a class = "mc-a" href="/mcDetail/'+$scope.microChainAddr +'">'+getPartialRemarksHtml(data, 25)+'</a>'
//              		} else {
//              			// 如果不是子链地址
//              			return '<a class = "mc-a" href="/mcDetail/'+$scope.microChainAddr + "&" + data+'">'+getPartialRemarksHtml(data, 25)+'</a>'
//              		}
//              		
//              	}
//              }
        	  
                      }, "targets": [2,3]},
          { "render": function(data, type, row) {
        	  var urlParam = data + "&" + $scope.usedMonitorIp + "&" + $scope.usedMonitorPort + "&" + $scope.microChainAddr + "&" + $scope.rpcType;
                        return '&nbsp;&nbsp;<a class = "mc-a" href="/subchainBlock/'+urlParam+'">'+data+'</a>'
                      }, "targets": [1]},
          { "render": function(data, type, row) {
        	  var urlParam = $scope.usedMonitorIp + "&" + $scope.usedMonitorPort + "&" + $scope.microChainAddr + "&" + data+ "&" + $scope.rpcType;
                        return '<a class = "mc-a" href="/sctx/'+urlParam+'">'+getPartialRemarksHtml(data, 25)+'</a>'
                      }, "targets": [0]},
            { "render": function(data, type, row) {
              return "&nbsp;&nbsp;" + data / Math.pow(10, 18);
            }, "targets": [4]},
          { "render": function(data, type, row) {
              return ''+getPartialRemarksHtml(data, 25)+''
              }, "targets": [3]},
          { "render": function(data, type, row) {
                        //return getDuration(data).toString();
        	  return transformTimeFromStamp(data * 1000, "datetime");
                      }, "targets": [5]},
          { "render": function(data, type, row) {
        	  var result;
        	  if (data == "" || data == undefined || data == null) {
        		  result =  "";
        	  } else {
        		  result = "&nbsp;&nbsp;&nbsp;" + getPartialRemarksHtml(data, 25);
        	  }
              return result;
              
            }, "targets": [6]}
          ],
          initComplete:function(){
        	  $("input[type=search]").attr("placeholder","Address / Hash");
          }
      });
      
    }
    $scope.count = 0;
    $scope.fetchMcTransfers = function() {
        $("#table_transfer").dataTable({
        	retrieve: true,
          processing: true,
          serverSide: true,
          paging: true,
          ajax: {
            url: '/mcTransfer',
            type: 'POST',
            data: { "microChainAddr": $scope.microChainAddr, "addr": $scope.address}
          },
          "lengthMenu": [
                      [10, 20, 50],
                      [10, 20, 50] // change per page values here
                  ],
          "pageLength": 20, 
          "order": [
              [6, "desc"]
          ],
          
          "language": {
            "lengthMenu": "_MENU_ transfers",
            "zeroRecords": "No transfers found",
            "infoEmpty": ":(",
            "infoFiltered": "(filtered from _MAX_ total txs)"
          },
          "columnDefs": [ 
//            {"type": "date", "targets": 6},
            { "render": function(data, type, row) {
            	var urlParam = $scope.usedMonitorIp + "&" + $scope.usedMonitorPort + "&" + $scope.microChainAddr + "&" + data + "&" + $scope.rpcType;
            	if (row[7] == "0") {
            		
            		return '<font size="2" color="red" rel="tooltip" data-placement="bottom" title="" data-original-title="Error in Main Txn: Reverted"><b><i class="fa fa-exclamation-circle"></i></b></font>'
            		+'<a class = "mc-a" href="/sctx/'+urlParam+'">'+getPartialRemarksHtml(data, 25)+'</a>'
            	} else if (row[7] == "2") {
            		return '<font size="2" color="red" rel="tooltip" data-placement="bottom" title="" data-original-title="Error in Main Txn: Reverted"><img src = "img/internal.png"> </img></font>'
            		+'<a class = "mc-a" href="/sctx/'+urlParam+'">'+getPartialRemarksHtml(data, 25)+'</a>'
            	} else {
            		return '<a class = "mc-a" href="/sctx/'+urlParam+'">'+getPartialRemarksHtml(data, 25)+'</a>'
            	}
                
            }, "targets": [0]},
            
            { "render": function(data, type, row) {
                //return getDuration(data).toString();
            	return transformTimeFromStamp(data * 1000, "datetime");
            }, "targets": [1]},
            
            { "render": function(data, type, row) {
            	var urlParam = data + "&" + $scope.usedMonitorIp + "&" + $scope.usedMonitorPort + "&" + $scope.microChainAddr + "&" + $scope.rpcType
                return '<a class = "mc-a" href="/subchainBlock/'+urlParam+'">'+data+'</a>'
            }, "targets": [2]},
              
            { "render": function(data, type, row) {
            	
            	if ($scope.address == "") {
                  	// 子链页
                  	if (data == $scope.microChainAddr) {
                  		
                  		return getPartialRemarksHtml(data, 25)
                  		
                  	} else {
                  		return '<a class = "mc-a" href="/mcDetail/'+$scope.microChainAddr + "&" + data + "&" + 
                  		$scope.usedMonitorIp + "&" +$scope.usedMonitorPort + "&" + $scope.rpcType +'">'+getPartialRemarksHtml(data, 25)+'</a>'
                  	}
                  } else {
                  	// 地址页
                  	if (data == $scope.address) {
                  		
                  		return getPartialRemarksHtml(data, 25)
                  		
                  	} else {
                  		if (data == $scope.microChainAddr) {
                  			// 如果是子链地址
                  			return '<a class = "mc-a" href="/mcDetail/'+$scope.microChainAddr + "&0x&" + $scope.usedMonitorIp + 
                      		 "&" + $scope.usedMonitorPort + "&" + $scope.rpcType +'">'+getPartialRemarksHtml(data, 25)+'</a>'
                  		} else {
                  			// 如果不是子链地址
                  			return '<a class = "mc-a" href="/mcDetail/'+$scope.microChainAddr + "&" + data + "&" + $scope.usedMonitorIp + 
                  			"&" + $scope.usedMonitorPort + "&" + $scope.rpcType +'">'+getPartialRemarksHtml(data, 25)+'</a>'
                  		}
                  		
                  	}
                  }
            	
//            	if ($scope.address == "") {
//                  	// 子链页
//                  	if (data == $scope.microChainAddr) {
//                  		
//                  		return getPartialRemarksHtml(data, 25)
//                  		
//                  	} else {
//                  		return '<a class = "mc-a" href="/mcDetail/'+$scope.microChainAddr + "&" + data+'">'+getPartialRemarksHtml(data, 25)+'</a>'
//                  	}
//                  } else {
//                  	// 地址页
//                  	if (data == $scope.address) {
//                  		
//                  		return getPartialRemarksHtml(data, 25)
//                  		
//                  	} else {
//                  		if (data == $scope.microChainAddr) {
//                  			// 如果是子链地址
//                  			return '<a class = "mc-a" href="/mcDetail/'+$scope.microChainAddr +'">'+getPartialRemarksHtml(data, 25)+'</a>'
//                  		} else {
//                  			// 如果不是子链地址
//                  			return '<a class = "mc-a" href="/mcDetail/'+$scope.microChainAddr + "&" + data+'">'+getPartialRemarksHtml(data, 25)+'</a>'
//                  		}
//                  		
//                  	}
//                  }
            	
             }, "targets": [3,4]},
            
            
              { "render": function(data, type, row) {
                return "&nbsp;&nbsp;&nbsp;" + data;
              }, "targets": [5]},
              { "render": function(data, type, row) {
                  return "&nbsp;&nbsp;&nbsp;" + data;
                }, "targets": [6]}
            
            ],
            initComplete:function(){
          	  $("input[type=search]").attr("placeholder","Address / Hash");
            }
        });
    }
    
    $scope.fetchHolders = function() {
        $("#table_token").dataTable({
        	retrieve: true,
          processing: true,
          serverSide: true,
          paging: true,
          ajax: {
            url: '/mcHolder',
            type: 'POST',
            data: { "microChainAddr": $scope.microChainAddr, "addr": $scope.address}
          },
          "lengthMenu": [
                      [10, 20, 50],
                      [10, 20, 50] // change per page values here
                  ],
          "pageLength": 20, 
          "order": [
              [6, "desc"]
          ],
          
          "language": {
            "lengthMenu": "_MENU_ holders",
            "zeroRecords": "No holders found",
            "infoEmpty": ":(",
            "infoFiltered": "(filtered from _MAX_ total txs)"
          },
          "columnDefs": [ 
            
	        { "render": function(data, type, row) {
	            //return "&nbsp;&nbsp;&nbsp;" + data;
	        	if ($scope.address == "") {
	        		// 子链页
	        		return '<a class = "mc-a" href="/mcDetail/'+$scope.microChainAddr + "&" + data + "&" + 
              		$scope.usedMonitorIp + "&" +$scope.usedMonitorPort + "&" + $scope.rpcType +'">'+data+'</a>'
	        		//return '<a class = "mc-a" href="/mcDetail/'+$scope.microChainAddr + "&" + data+'">'+ data+'</a>'

	        	} else {
	        		// 地址页
	        		return "&nbsp;&nbsp;&nbsp;" + data;
	        	}
	        	
	        }, "targets": [0]},
              
	          { "render": function(data, type, row) {
	            return "&nbsp;&nbsp;&nbsp;" + data;
	          }, "targets": [1]},
              
              { "render": function(data, type, row) {
                  return "&nbsp;&nbsp;&nbsp;" + data;
                }, "targets": [2]},
            { "render": function(data, type, row) {
                return "&nbsp;&nbsp;&nbsp;" + data;
              }, "targets": [3]},
                  { "render": function(data, type, row) {
                      return "&nbsp;&nbsp;&nbsp;" + data;
                    }, "targets": [4]},
                    { "render": function(data, type, row) {
                        return "&nbsp;&nbsp;&nbsp;" + data;
                      }, "targets": [5]},
                      { "render": function(data, type, row) {
                          return "&nbsp;&nbsp;&nbsp;" + data;
                        }, "targets": [6]}
            
            ],
            initComplete:function(){
           	    $("input[type=search]").attr("placeholder","Address / Hash");
            }
        });
    }
    
    $scope.fetchDappList();

})

//var remarkShowLength = 34;
function getPartialRemarksHtml(remarks, remarkShowLength){
      return remarks.substr(0,remarkShowLength) + '...';
}

function transformTimeFromStamp(timestamp, type) {
	var time = new Date(timestamp);
    var y = time.getFullYear();
    var M = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var m = time.getMinutes();
    var s = time.getSeconds();
    if (type == "datetime") {
    	var result = y + '-' + addZero(M) + '-' + addZero(d) + ' ' + addZero(h) + ':' + addZero(m) + ':' + addZero(s);
    } else if (type == "date"){
    	var result = y + '-' + addZero(M) + '-' + addZero(d);
    }
    return result
}
function addZero(m) {
    return m < 10 ? '0' + m : m;
}
