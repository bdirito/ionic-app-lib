angular.module('app', [])

.run(['$rootScope', '$http', function($rootScope, $http) {
}])

.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.loading = false;
  $scope.loadingMessage = 'Loading...';
  $scope.step = 2;

  $scope.env = {
    cwd: ''
  };
  $http.get('/api/env').then(function(res) {
    $scope.env = res.data;
  });

  $scope.setStep = function(step) {
    $scope.step = step;
  };

  $scope.startLoading = function(loadingMessage) {
    $scope.loading = true;
    $scope.loadingMessage = loadingMessage;
  };
  $scope.endLoading = function() {
    $scope.loading = false;
  };
}])

.controller('CreateCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.app = {
    name: 'My App',
    directory: 'myApp',
    path: '',
    id: generateId(),
    template: 'super'
  };

  $scope.userModifiedDirectory = false;

  function generateId() {
    var packageName = '' + Math.round((Math.random() * 899999) + 100000);
    packageName = 'com.ionicframework.app' + packageName.replace(/\./g, '');
    return packageName;
  }

  function generateDirectory(name) {
    return name.trim()
      .toLowerCase()
      .replace(/([^A-Z0-9]+)(.)/ig,
      function(match) {
        return arguments[2].toUpperCase();  //3rd index is the character we need to transform uppercase
      });
  }

  $scope.$watch('app.name', function(nv, ov) {
    console.log('App name', nv);
    if(!$scope.userModifiedDirectory) {
      $scope.app.directory = generateDirectory(nv);
    }
  })

  $scope.onSubmit = function() {
    $scope.errors = null;
    $scope.startLoading('Creating app...');
    $http.post('/api/cli', {
      command: 'start',
      app: $scope.app
    }).then(function(resp) {
      $scope.endLoading();
      if(resp.data.status == "error") {
        $scope.errors = resp.data.data;
      } else {
        $scope.errors = null;
        $scope.setStep(2);
      }
    }, function(err) {
      $scope.endLoading();
      $scope.errors = err.message;
      console.error('Unable to execute command', err);
    });
  }

  var aid = document.querySelector('#app-directory');
  aid.addEventListener('input', function(e) {
    $scope.$apply(function() {
      $scope.userModifiedDirectory = true;
    });
  })
}])

.controller('CloudCtrl', ['$scope', function($scope) {
  $scope.data = {};

  $scope._showLogin = false;
  $scope.showLogin = function() {
    $scope._showLogin = true;
  }
  $scope.showSignup = function() {
    $scope._showLogin = false;
  }

  $scope.doSignup = function() {
    $http.post('/api/signup', $scope.data).then(function(resp) {

    }, function(err) {
      console.error('Unable to signup', err);

    }).catch(function(err) {
      console.error('Unable to signup', err);
    });
  };
}])
.controller('LaunchCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.runApp = function() {
    $http.post('/api/run').then(function(resp) {
    }).catch(function(err) {
      console.error('Unabe to run', err);
    });
  }
}])
