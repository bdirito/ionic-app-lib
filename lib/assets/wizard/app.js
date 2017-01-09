angular.module('app', ['ngAnimate'])

.run(['$rootScope', '$http', function($rootScope, $http) {
}])

.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.loading = false;
  $scope.loadingMessage = 'Loading...';
  $scope.step = 2;
  $scope.isAuthenticated = false;

  $scope.app = {
    name: 'My App',
    directory: 'myApp',
    path: '',
    id: generateId(),
    template: 'super'
  };
  function generateId() {
    var packageName = '' + Math.round((Math.random() * 899999) + 100000);
    packageName = 'com.ionicframework.app' + packageName.replace(/\./g, '');
    return packageName;
  }


  $scope.env = {
    cwd: ''
  };
  $http.get('/api/env').then(function(res) {
    $scope.env = res.data;
  });

  $scope.nextStep = function() {
    ++$scope.step;
  };
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

  $scope.setAuthenticated = function(isAuthenticated) {
    $scope.isAuthenticated = isAuthenticated;
  }
}])

.controller('CreateCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.userModifiedDirectory = false;

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
        $scope.nextStep();
      }
    }, function(err) {
      $scope.endLoading();
      $scope.errors = err.message;
      console.error('Unable to execute command', err);
    });
  }

}])

.controller('CloudCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.data = {
    name: 'Max Lynch',
    username: 'maxxxxxxxxx',
    email: 'ihasmax@gmail.com',
    password: ''
  };

  $scope._showLogin = false;
  $scope.showLogin = function() {
    $scope._showLogin = true;
  }
  $scope.showSignup = function() {
    $scope._showLogin = false;
  }

  $scope.skip = function() {
    $scope.nextStep();
  }

  $scope.doLogin = function() {
    $scope.errors = {};
    $scope.disabled = true;
    $scope.startLoading('Logging in...');
    $http.post('/api/login', {
      email: $scope.data.email,
      password: $scope.data.password
    }).then(function(resp) {
      console.log('Login resp', resp);
      $scope.endLoading();
      $scope.disabled = false;
      $scope.setAuthenticated(true);
      $scope.nextStep();
    }, function(err) {
      $scope.endLoading();
      $scope.disabled = false;
      console.error('Error logging in ', err);
      console.error('asdfasdf', err.data);
      $scope.errors = {
        email: [err.data && err.data.data]
      };
    });
  };

  $scope.doSignup = function() {
    $scope.errors = {};
    $scope.startLoading('Creating ID...');
    $scope.disabled = true;
    $http.post('/api/signup', {
      username: $scope.data.username,
      name: $scope.data.name,
      company: $scope.data.company,
      email: $scope.data.email,
      password1: $scope.data.password
    }).then(function(resp) {
      $scope.setAuthenticated(true);
      $scope.endLoading();
      $scope.disabled = false;
      $scoep.nextStep();
    }, function(err) {
      $scope.endLoading();
      $scope.disabled = false;
      console.error('Unable to signup', err);
      $scope.errors = err.data && err.data.data;
    }).catch(function(err) {
      $scope.endLoading();
      $scope.disabled = false;
      console.error('Unable to signup', err);
      $scope.errors = err.data && err.data.data;
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
