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
      $scope.loadElements();
    };

    $scope.loadElements = function(){
      var start = ($scope.currentPage - 1) * $scope.maxSize;
      var limit = $scope.maxSize;
      var toLoad = $scope.posts.slice(start, start+limit);
      toLoad.forEach(function(element){
        if(!element.metadata){
          Repository.content.get(element.path, $scope.repository)
          .then(function(result){
            angular.extend(element, result);
          });
        }
      });
    };

    $scope.ready = function(){
      return !!$rootScope.user.skelleton;
    };

    $scope.create = function(){
      var year = $scope.filter.year;
      var month = $scope.filter.month;
      $location.path('/post/'+year+'/'+month);
    };

    $scope.edit = function(post){
      var year = $scope.filter.year;
      var month = $scope.filter.month;
      $location.path('/post/'+year+'/'+month+'/'+post.sha+'/'+post.path);
    };

    $scope.load = function(){
      $scope.filter.search();
      $scope.loadSkelleton();
    };

    $scope.load();
  });
