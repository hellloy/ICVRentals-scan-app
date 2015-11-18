angular.module('starter.controllers', [])


.controller('SignInCtrl', function ($scope, $state, $ionicLoading, $http) {
    $scope.user = {
    name: "",
    password: ""
};

    $scope.signIn = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });
        console.log($scope.user);
        var URL = "http://icvrentals.com/Account/LoginJSON?UserName=" + $scope.user.name + "&Password=" + $scope.user.password;
        $http.post(URL, "").success(function (result, status) {
            console.log(result);
            $ionicLoading.hide();
            if (result != "false") {
                $state.go('list');
            }
            else {
                $ionicLoading.hide();
                $scope.alert = "Email or Password is Incorrect";
            }
        })
        .error(function (data, status, headers, config) {
            $ionicLoading.hide();
        })

    };

 

})
.controller('listCtrl', function ($scope, $ionicLoading, $http) {
    $scope.eqipments = [];
    $scope.RunScan = function () {
        
        cordova.plugins.barcodeScanner.scan(
         function (result) {
             if (result.format == "QR_CODE") {
                 $ionicLoading.show({
                     template: 'Loading...'
                 });
                 var URL = "http://icvrentals.com/Equipment/GetEqCheck/" + result.text;
                 $http.post(URL, "").success(function (data, status) {
                     $ionicLoading.hide();
                     

                     if (typeof data.used != 'undefined')
                     {
                         alert("This equipment used order " + data.used);
                     }
                     else
                     {
                         var stop = false;
                         for (var i = 0; i < $scope.eqipments.length; i++) {
                             if ($scope.eqipments[i].id == data.Eq[0].id) {
                                 stop = true;
                             }
                         }

                         if (stop == false)
                         {
                             $scope.equipmentItem = {}
                             $scope.equipmentItem.id = data.Eq[0].id;
                             $scope.equipmentItem.name = data.Eq[0].name;
                             $scope.eqipments.push($scope.equipmentItem);
                         }
                         else
                         {
                             alert("This equipment has been added to the list");
                         }
                     }
                    
                 })
                 .error(function (data, status, headers, config) {
                     $ionicLoading.hide();
                     alert(data);
                    
                 })
             }
             else {

             }
             
         },
         function (error) {
             alert("Scanning failed: " + error);
         }
      );
    };
    $scope.SendDataToServer = function () {

        var dateRet = new Date();
        dateRet.setDate(dateRet.getDate() + 1);

        var jsonData = {};

        jsonData.Phone ="888-888-88-88";
        jsonData.datePick = new Date().toLocaleString();
        jsonData.clientLName="Ryazanov";
        jsonData.BDays="1";
        jsonData.timePick="";
        jsonData.timeRet="";
        jsonData.dateRet = dateRet.toLocaleString();
        jsonData.orderStatus="Placed";
        jsonData.clientPass="";
        jsonData.clientId="1";
        jsonData.userID="1";
        jsonData.clientFName="Max";
        jsonData.Days="1";
        jsonData.Company="lab322";
        jsonData.clientRePass="";
        jsonData.clientEmail="mryazanov@lab322.com";
        jsonData.items = []

        

        for (var i = 0; i < $scope.eqipments.length; i++) {
            jsonData.items.push("{ "+$scope.eqipments[i].id+" }");
        }
        
        var URL = "http://icvrentals.com/Order/CreateOrderJ";
        console.log(JSON.stringify(jsonData));
        $http.post(URL, JSON.stringify(jsonData)).success(function (result, status) {
            if (result == "true")
            {
                $scope.eqipments = [];
                alert("Done.");
            }
            else
            {
                alert("Error !");
            }
            
        });
        
    }
})

