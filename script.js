var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
    //$scope.info_url='http://bazyad.com/';
    $scope.info_url = 'http://localhost/bazyad/';

    if (localStorage.getItem("dic_code") != null) {
        $scope.dic_code = localStorage.getItem("dic_code");
        $scope.dic_name = localStorage.getItem("dic_name");
        $scope.dic_l1_dir = localStorage.getItem("dic_l1_dir");
        $scope.dic_l1_align = localStorage.getItem("dic_l1_align");
        $scope.dic_l2_dir = localStorage.getItem("dic_l2_dir");
        $scope.dic_l2_align = localStorage.getItem("dic_l2_align");
    } else {
        $scope.dic_code = 'enfa';
        $scope.dic_name = 'انگلیسی به فارسی';
        $scope.dic_l1_dir = 'ltr';
        $scope.dic_l1_align = 'left';
        $scope.dic_l2_dir = 'rtl';
        $scope.dic_l2_align = 'right';
    }

    if (localStorage.getItem("dictionaries") != null) {
        $scope.dictionaries = JSON.parse(localStorage.getItem("dictionaries"));
    } else {
        $scope.dictionaries = [{'name': 'انگلیسی به فارسی','code':'enfa'}];
    }
    $http.get($scope.info_url + 'apis/dic_list.php')
        .then(function (response) {
            $scope.dictionaries = response.data;
            localStorage.setItem("dictionaries", JSON.stringify($scope.dictionaries));
        });


    if (localStorage.getItem("products") != null) {
        $scope.products = JSON.parse(localStorage.getItem("products"));
    } else {
        $scope.products = [];
    }
    $http.get($scope.info_url + 'apis/list_products.php?code=android_dictionary')
        .then(function (response) {
            $scope.products = response.data;
            localStorage.setItem("products", JSON.stringify($scope.products));
        });

    $scope.select_dictionary = function (dic) {
        $scope.result = [];
        $scope.result_sim = [];
        $scope.w=null;
        $scope.dic_code = dic['code'];
        $scope.dic_name = dic['name'];
        if(dic['l1_rtl']) {
            $scope.dic_l1_dir='rtl';
            $scope.dic_l1_align='right';
        }
        else {
            $scope.dic_l1_dir='ltr';
            $scope.dic_l1_align='left';
        }
        if(dic['l2_rtl']) {
            $scope.dic_l2_dir='rtl';
            $scope.dic_l2_align='right';
        }
        else {
            $scope.dic_l2_dir='ltr';
            $scope.dic_l2_align='left';
        }
        localStorage.setItem("dic_code", dic['code']);
        localStorage.setItem("dic_name", dic['name']);
        localStorage.setItem("dic_l1_dir", $scope.dic_l1_dir);
        localStorage.setItem("dic_l1_align", $scope.dic_l1_align);
        localStorage.setItem("dic_l2_dir", $scope.dic_l2_dir);
        localStorage.setItem("dic_l2_align", $scope.dic_l2_align);
        $.slidebars.close();
    };

    $scope.find_w = function (w,dic_code) {
        $scope.result = ['در حال جستجو ...'];
        $scope.result_sim = [];
        $http.get($scope.info_url + 'apis/dic_mean.php?w='+encodeURIComponent(w)+'&d='+encodeURIComponent(dic_code))
            .then(function (response) {
                $scope.result = response.data;
                if($scope.result=='') {
                    $scope.result = ['یافت نشد.'];
                }
            });
        $http.get($scope.info_url + 'apis/dic_sim.php?w='+encodeURIComponent(w)+'&d='+encodeURIComponent(dic_code))
            .then(function (response) {
                $scope.result_sim = response.data;
            });
    };

    $scope.change_w = function (w) {
        $scope.w=w;
        $scope.find_w(w,$scope.dic_code);
    };

    $scope.select_product = function(link) {
        window.open(link, '_system');
    };
});