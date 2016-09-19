'use strict';

/**
 * @ngdoc function
 * @name cmsApp.controller:PostsearchCtrl
 * @description
 * #.content.earchCtrl
 * Controller of the cmsApp
 */
angular.module('cmsApp')
  .controller('PostSearchCtrl', function ($rootScope, $scope, $location, DateUtil, PostUtil, Repository) {
    $scope.cleanAlerts();
    $scope.posts = [];
    $scope.maxSize = 5;
    $scope.currentPage = 1;
    $scope.ready = false;
    $scope.filter = {
      month: DateUtil.now.getMonth(),
      year: DateUtil.now.getYear(),
      title: '',
      search: function(){
        return Repository.content.list($rootScope.repository, this).then(function(result){
          $scope.updateView(result);
        });
      }
    };

    $scope.organization = $rootScope.user.organization;
    $scope.canStartFilter = function(){
      return $scope.filter.title &&  $scope.filter.title.length > 3;
    };

    $scope.updateView = function(posts){
      $scope.currentPage = 1;
      $scope.posts = posts || $scope.posts;
    };

    $scope.ready = function(){
      return !!$rootScope.user.skelleton;
    };

    $scope.create = function(){
      var year = $scope.filter.year;
      var month = $scope.filter.month;
      $location.path('/post');
    };

    $scope.edit = function(post){
      var year = $scope.filter.year;
      var month = $scope.filter.month;
      $location.path('/post/'+post._id);
    };

    $scope.load = function(){
      $scope.filter.search();
      $scope.loadSkelleton();
    };

    $scope.load();
  });
