var BlocksApp = angular.module("BlocksApp", [
    "ui.router", 
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize"
]); 

BlocksApp.config(['$ocLazyLoadProvider',  '$locationProvider', 
    function($ocLazyLoadProvider, $locationProvider) {
    $ocLazyLoadProvider.config({
        cssFilesInsertBefore: 'ng_load_plugins_before' // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
    });
    $locationProvider.html5Mode({
      enabled: true
    });
}]);


/* Setup global settings */
BlocksApp.factory('settings', ['$rootScope', '$http', function($rootScope, $http) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: false, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '/',
        globalPath: '/',
        layoutPath: '/',
    };

    $rootScope.settings = settings;
    return settings;
}]);

/* Setup App Main Controller */
BlocksApp.controller('MainController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive.
***/

/* Setup Layout Part - Header */
BlocksApp.controller('HeaderController', ['$scope', '$location', function($scope, $location) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });

    $scope.searchMcQuery = function (s) {
        var search = s.toLowerCase();

        if (isAddress(search)) {
        	alert("Please type block number or transaction hash!");
        	
        } else if (isTransaction(search)) {
        	var urlParam = $("#headerIp").val() + "&" + $("#headerPort").val() + "&" + $("#headerMicroChainAddr").val() + "&" + search;
        	$location.path("/sctx/" + urlParam);
            
        } else if (!isNaN(search)) {
        	var urlParam = search + "&" + $("#headerIp").val() + "&" + $("#headerPort").val() + "&" + $("#headerMicroChainAddr").val() + "&" + $("#headerRpcType").val()
        	$location.path("/subchainBlock/" + urlParam);
        } else {
        	$scope.form.searchInput = search;
        }
    }
    
    
}]);

/* Search Bar */
BlocksApp.controller('PageHeadController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {        
        
    });
}]);

/* Setup Layout Part - Footer */
BlocksApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
BlocksApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/");  
    
    $stateProvider

        .state('index', {
        	url: "/",
        	templateUrl: "views/scblock.html",
        	data: {pageTitle: 'MicroChain Details', tabName: "MicroChain Details"},
        	controller: "ScblockController",
        	resolve: {
        		deps: ['$ocLazyLoad', function($ocLazyLoad) {
        			return $ocLazyLoad.load({
        				name: 'BlocksApp',
        				insertBefore: '#ng_load_plugins_before', 
        				files: [
        					'/js/controllers/ScblockController.js',
        					'/css/todo-2.min.css'
        					]
        			});
        		}]
        	}
        })
        
        .state('monitorStatus', {
            url: "/monitorStatus",
            templateUrl: "views/monitorStatus.html",            
            data: {pageTitle: '', tabName: "Home"},
            controller: "MonitorStatusController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'BlocksApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                            '/js/controllers/MonitorStatusController.js',
                            '/css/todo-2.min.css'
                        ]}]);
                }]
            }
        })
        
        .state('mcDetail', {
            url: "/mcDetail/{hash}",
            templateUrl: "views/mcDetail.html",
            data: {pageTitle: '', tabName: "MicroChain"},
            controller: "McDetailController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'BlocksApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                             '/js/controllers/McDetailController.js',
                            '/plugins/datatables/datatables.min.css',
                            '/plugins/datatables/datatables.bootstrap.css',
                            '/plugins/datatables/datatables.all.min.js',
                            '/plugins/datatables/datatable.min.js'
                        ]
                    });
                }]
            }
        })
        

        .state('sctx', {
        	url: "/sctx/{txconfig}",
        	templateUrl: "views/scTx.html",
        	data: {pageTitle: 'MicroChain Transaction', tabName: "MicroChain Transaction"},
        	controller: "ScTxController",
        	resolve: {
        		deps: ['$ocLazyLoad', function($ocLazyLoad) {
        			return $ocLazyLoad.load({
        				name: 'BlocksApp',
        				insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
        				files: [
        					'/js/controllers/ScTxController.js'
        					]
        			});
        		}]
        	}
        })

        .state('scinfo', {
        	url: "/scinfo",
        	templateUrl: "views/scinfo.html",
        	data: {pageTitle: '', tabName: "MicroChain Form"},
        	controller: "ScinfoController",
        	resolve: {
        		deps: ['$ocLazyLoad', function($ocLazyLoad) {
        			return $ocLazyLoad.load({
        				name: 'BlocksApp',
        				insertBefore: '#ng_load_plugins_before', 
        				files: [
        					'/js/controllers/ScinfoController.js'
        					]
        			});
        		}]
        	}
        })

        .state('subchainBlock', {
        	url: "/subchainBlock/{subchainBlockConfig}",
        	templateUrl: "views/scblockDetail.html",
        	data: {pageTitle: 'Block', tabName: "MicroChain Block"},
        	controller: "ScblockDetailController",
        	resolve: {
        		deps: ['$ocLazyLoad', function($ocLazyLoad) {
        			return $ocLazyLoad.load({
        				name: 'BlocksApp',
        				insertBefore: '#ng_load_plugins_before', 
        				files: [
        					'/js/controllers/ScblockDetailController.js'
        					]
        			});
        		}]
        	}
        })


        .state('err404', {
            url: "/err404/{thing}/{hash}",
            templateUrl: "views/err_404.html",
            data: {pageTitle: '404 Not Found.', tabName: "404"},
            controller: "ErrController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'BlocksApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                             '/js/controllers/ErrController.js'
                        ]
                    });
                }]
            }
        })
}]);

BlocksApp.filter('timeDuration', function() {
  return function(timestamp) {
    return getDuration(timestamp).toString();
  };
})
.filter('totalDifficulty', function() {
  return function(hashes) {
    return getDifficulty(hashes);
  };
}) 
.filter('teraHashes', function() {
    return function(hashes) {
        var result = hashes / Math.pow(1000, 4);
        return parseInt(result);
  }
})

/* Init global settings and run the app */
BlocksApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
}]);