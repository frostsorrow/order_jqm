angular.module('orderModule',['ng','ngTouch']).controller('parentCtrl',function ($scope){
    $scope.loaded=true;

    $scope.jump=function (url) {
        if($scope.loaded){
            $scope.loaded=false;
            $.mobile.changePage(url,{transition:'slide'});
        }
    };
    //一旦有新的page生成dom树，pageinit,
    //就需要重新编译$compile($(div..))($scope)
    angular.element('body').on('pageinit',function (event) {
        $scope.loaded=true;
        var scope=angular.element(event.target).scope();
        angular.element(event.target).injector().
        invoke(function ($compile) {
          $compile(angular.element(event.target))(scope);
           scope.$digest();
         });
    });
}).controller('menuCtrl',function ($scope,$http) {
    $scope.hasMore=true;
    $scope.loading=false;
    $scope.dishlist=[];
    $http.get('../data/menu-load.php').success(function (data) {
        $scope.dishlist=data;
        if(data.length<5){
            $scope.hasMore=false;
        }
    });
    $scope.loadMore=function () {
        $scope.loading=true;
        $http.get('../data/menu-load.php?start='+$scope.dishlist.length).success(function (data) {
            $scope.loading=false;
            $scope.dishlist=$scope.dishlist.concat(data);
            if(data.length<5){
                $scope.hasMore=false;
            }
        });
    };
    $scope.$watch('kw',function () {
        if($scope.kw){
            $http.get('../data/menu-search.php?kw='+$scope.kw).success(function (data) {
                $scope.dishlist=data;
            })
        }
    })
}).controller('detailCtrl',function ($scope,$http,$timeout,parseSearch) {
    // 这里有问题，可能因为太快了，用location.href总是得到上一个页面的，所以我这里限制了20ms之后再执行
        $timeout(function () {
            var did=parseSearch(location.search).did;
            $http.get('../data/detail-dish.php?did='+did).success(function (data) {
                $scope.dish=data;
            })
        },20)
}).controller('reserveCtrl',function ($scope,$http,parseSearch,$timeout,$rootScope) {
    $timeout(function () {
        var did=parseSearch(location.search).did;
        $scope.user={'did':did};
        $scope.$watch('user.user_name');
        $scope.$watch('user.sex');
        $scope.$watch('user.phone');
        $scope.$watch('user.addr');
        $scope.submitOrder=function () {
            if(!$scope.user.user_name||!$scope.user.sex||!$scope.user.phone||!$scope.user.addr){
                alert('请填写完整');
                return;
            }
            var searchString=jQuery.param($scope.user);
            console.log(searchString)
            $http.post('../data/submitOrder.php',searchString).success(function (data) {
                if(data.status=='success'){
                    $scope.oid=data.oid;
                    $scope.orderSuccess=true;
                    $rootScope.phone=$scope.user.phone;
                }
            });

        };
    },20);

}).controller('userOrderCtrl',function ($scope,$rootScope,$http) {
    $http.get('../data/user-dishes.php?phone='+$rootScope.phone).success(function (data) {
        $scope.orders=data;
    })

}).service('parseSearch',function () {
    // 将查询字符串转换为关联数组
    return function (search) {
        var arr=[];
        // ?did=1&name='hei'
        search=search.substring(1);
        arr=search.split('&');
        // ['did=1','name=hei']
        //{did:1,name:'hei'}
        var searchArr={};
        angular.forEach(arr,function (v,k) {
            var vv=v.split('=');//[did,1]
            searchArr[vv[0]]=vv[1];
        });
        return searchArr;
    }
}).run(function ($http) {
    $http.defaults.headers.post={'Content-Type':'application/x-www-form-urlencoded'}
});


