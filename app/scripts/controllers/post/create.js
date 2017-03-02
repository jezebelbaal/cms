'use strict';

angular.module('cmsApp')
  .controller('PostCreateCtrl', function ($rootScope, $scope, $location, $routeParams, _, PostUtil, TagsUtil, PromiseUtil, ENV) {

    $scope.cleanAlerts();
    $scope.state = 'default';
    $scope.entity = {
      date: (new Date()).toString(),
    };
    $scope.body = '';
    $scope.editorLoaded = false;
    $scope.fields = $rootScope.user.skelleton || [];
    $scope.files = [];
    $scope.releatedPosts = [];
    $scope.suggestedPosts = [];
    $scope.tags = new TagsUtil();
    $scope.videoField = undefined;

    $scope.fields.forEach(function(element){
      if(element.type.view === 'video'){
        $scope.videoField = element;
      }
    });

    $scope.$on('upload-file', function(event, args) {
      $scope.files.push(args.file);
    });

    $scope.removeImage = function (imageIndex){
      if(window.confirm('Deseja realmente remover este item?')){
         $scope.files.splice(imageIndex, 1);
      }
    };
    $scope.imageToCover = function (imageIndex){
      var cover = $scope.files[imageIndex];
      $scope.$broadcast('imageToBeCover', cover.link);
    };

    $scope.$on('ckeditor.ready', function(){
      $scope.editorLoaded = true;
    });

    var getVideoUrl = function(){
      var field = $scope.videoField;

      if(!!field && !!field.name){
        return $scope.entity[field.name];
      }
      return '';
    };

    $scope.save = function(form, action){
      if(action !== 'publish' && action !== 'draft'){
        return;
      }
      var publish = (action === 'publish');
      var sha = $routeParams.sha;

      $scope.$broadcast('submited');

      if(!form.$invalid){
        $scope.state = (publish) ? 'publishing' : 'saving';
        var videoUrl = getVideoUrl();
        var promise = PostUtil.preparePost($scope.entity, $scope.body, $scope.filename, $scope.files, publish, videoUrl);
        promise.then(function(post){
          post.id = $scope.id;
          /*jshint camelcase: false */
          post.metadata.releated_posts = $scope.releatedPosts;

          PromiseUtil
            .request(ENV.api.news.save, 'POST', post)
            .then(function(){
              $scope.cleanAlerts();
              $scope.state = 'default';
              $location.path('/post/search');
            })
            .catch(function(error) {
              $scope.state = 'default';
              $scope.addError(error);
            });
        });
      } else {
        var inputs = form.$error.required || [];
        var inputNames = [];
        inputs.forEach(function(input) {
          var field = _.find($scope.fields, function(field) {
            return field.name === input.$name;
          });
          inputNames.push(field.title);
        });

        var message = 'Os campos: ' + inputNames.join(', ') + ' precisam ser preenchidos.';

        $scope.addWarning(message);
      }
    };

    var removeReleatedPost = function(post){
      var index = $scope.releatedPosts.indexOf(post);
      if( index >= 0 ){
        $scope.releatedPosts.splice(index, 1);
      }
    };

    var addReleatedPost = function(post){
      var index = $scope.releatedPosts.indexOf(post);
      if( index >= 0 ){
        removeReleatedPost(post);
      }else{
        $scope.releatedPosts.push(post);
      }
    };

    var isPostReleated = function(post){
      return _.find($scope.releatedPosts, function(e){ return e === post; });
    };

    $scope.addReleatedPost = addReleatedPost;
    $scope.removeReleatedPost = removeReleatedPost;
    $scope.isPostReleated = isPostReleated;

    var getReleatedPosts = function(tags){
      return $scope.tags.getReleatedPosts(tags, { postToRemove: $scope.filename });
    };

    var fillSuggestedPosts = function(){
        var tags = $scope.entity.tags || [];
        var suggestedPosts = [];
        tags.forEach(function(tag){
          suggestedPosts.push(getReleatedPosts([tag]));
        });

        $scope.suggestedPosts = _.uniq(_.flatten(suggestedPosts));
    };

    var fillReleatedPosts = function(){
      var tags = $scope.entity.tags || [];
      if(tags.length === 0 ){
        $scope.suggestedPosts = [];
        $scope.releatedPosts = [];
      }else{
        var releatedPosts = getReleatedPosts(tags);
        fillSuggestedPosts();

        if(tags.length > 1){
          $scope.releatedPosts = _.union(releatedPosts, $scope.releatedPosts);
        }
      }
    };

    $scope.fillReleatedPosts = fillReleatedPosts;

    $scope.load = function(){
      var post = {
        id: $routeParams.id
      };

      if(!!post.id){
        $scope.state = 'loading';
        var url = ENV.api.news.get.replace(":id", post.id)

        PromiseUtil
          .request(url)
          .then(function(post){
            /*jshint camelcase: false */
            $scope.entity = post.metadata;
            $scope.id = post.id;
            $scope.body   = post.body;
            $scope.filename = post.filename;
            $scope.files  = PostUtil.prepareListOfFiles(post.metadata);
            $scope.releatedPosts = post.metadata.releated_posts || [];
            $scope.state = 'default';
          });
      }
    };
  });
