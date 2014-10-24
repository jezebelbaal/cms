"use strict";angular.module("config",[]).constant("ENV",{name:"production",basepath:"/cms"}),angular.module("cmsApp",["config","ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ngTagsInput","ui.bootstrap","mgcrea.ngStrap.datepicker","mgcrea.ngStrap.tooltip","mgcrea.ngStrap.helpers.dateParser","mgcrea.ngStrap.timepicker"]).config(["$routeProvider",function(a){a.when("/auth",{templateUrl:"views/auth.html",controller:"AuthCtrl"}).when("/post/search",{templateUrl:"views/post/search.html",controller:"PostSearchCtrl"}).when("/post/:year/:month",{templateUrl:"views/post/create.html",controller:"PostCreateCtrl"}).when("/post/:year/:month/:sha/:url*",{templateUrl:"views/post/create.html",controller:"PostCreateCtrl"}).otherwise({redirectTo:"/auth"})}]).run(["$rootScope","$location","Resource",function(a,b,c){a.$on("$locationChangeStart",function(){return a.error=null,c.github?void 0:(b.path("/auth").replace(),!1)})}]),angular.module("cmsApp").filter("startFrom",function(){return function(a,b){return b=+b,"object"==typeof a&&a.length>0?a.slice(b):[]}}),angular.module("cmsApp").controller("AuthCtrl",["$rootScope","$scope","$timeout","$location","oauth","User","Resource","Repository",function(a,b,c,d,e,f,g,h){b.finish=function(c){if(c){var e=angular.fromJson(c);b.user.repository=e,a.user=b.user,d.path("/post/search")}},b.getRepositories=function(a){if(b.user.organization=void 0,b.user.repositories=[],a){var c=angular.fromJson(a);b.user.organization=c,h.organization.get(c).repositories().then(function(a){b.user.repositories=a})}},b.authenticate=function(){e.popup("github",function(a,d){return a?window.alert(a):(g.github=d,void c(function(){b.user=f.info()},0))})}}]),angular.module("cmsApp").controller("PostSearchCtrl",["$rootScope","$scope","$location","DateUtil","Repository",function(a,b,c,d,e){b.posts=[],b.maxSize=5,b.currentPage=1,b.ready=!1,b.filter={month:d.now.getMonth(),year:d.now.getYear()},b.pageChanged=function(){var a=(b.currentPage-1)*b.maxSize,c=b.maxSize,d=b.posts.slice(a,a+c);d.forEach(function(a){a.metadata||e.post.get(a).then(function(b){angular.extend(a,b)})})},b.loadSkelleton=function(){e.skelleton.get(b.user).then(function(c){a.user.skelleton=angular.fromJson(c),b.ready=!0})},b.create=function(){var a=b.filter.year,d=b.filter.month;c.path("/post/"+a+"/"+d)},b.edit=function(a){var d=b.filter.year,e=b.filter.month;c.path("/post/"+d+"/"+e+"/"+a.sha+"/"+a.url)},b.find=function(){e.post.list(a.user,b.filter).then(function(a){b.posts=a.reverse(),b.pageChanged()})},b.find(),b.loadSkelleton()}]),angular.module("cmsApp").controller("PostCreateCtrl",["$rootScope","$scope","$location","$routeParams","PostUtil","Repository",function(a,b,c,d,e,f){b.state="default",b.entity={date:(new Date).toString()},b.body="",b.cover="",b.fields=a.user.skelleton,b.files=[],b.upload={length:0,done:0,working:function(){return this.length!==this.done}},b.fields.every(function(a){return"cover"===a.type.view?(b.coverField=a,!1):!0}),b.save=function(g,h){if("publish"===h||"draft"===h){var i="publish"===h,j=d.sha;if(b.$broadcast("submited"),!g.$invalid){b.state=i?"publishing":"saving";var k=e.preparePost(b.entity,b.body,b.filename,b.files,i);k.metadata[b.coverField.name]=b.cover,f.post.save(a.user,k,j).then(function(){b.state="default",c.path("/post/search")})}}},b.$on("upload-file",function(a,c){b.files.push(c.file),b.upload.done=b.upload.done+1}),b.$on("prepared-to-upload",function(a,c){b.upload.length=c.length,b.upload.done=0}),b.load=function(){var a={url:d.url};a.url&&f.post.get(a).then(function(a){b.entity=a.metadata,b.body=a.body,b.filename=a.filename,b.files=e.prepareListOfFiles(a.metadata,b.coverField.name),b.cover=a.metadata[b.coverField.name]})},b.toggleCover=function(a){return b.cover===a?void(b.cover=null):void(b.cover=a)}}]),angular.module("cmsApp").controller("UploadCtrl",["$scope","$http","$rootScope","Resource","_",function(a,b,c,d,e){var f=function(a){var b=new FormData;return angular.forEach(a,function(a,c){b.append(c,a)}),b};a.uploadFiles=function(a){var g="http://mst-image-service.herokuapp.com/upload";c.$broadcast("prepared-to-upload",{length:a.length}),e.each(a,function(a){b({url:g,method:"POST",transformRequest:f,headers:{"Content-Type":void 0},data:{token:d.github.access_token,myfile:a}}).success(function(a){c.$broadcast("upload-file",{file:a})}).error(function(a){console.log(a)})})}}]),angular.module("cmsApp").factory("Resource",function(){return{github:""}}),angular.module("cmsApp").factory("User",["_","Github",function(a,b){return{info:function(){var a=b.user.getAuth(),c=b.organization.list(),d={info:"",organizations:[],repositories:[]};return a.then(function(a){d.info=a}),c.then(function(a){d.organizations=a}),d}}}]),angular.module("cmsApp").factory("oauth",function(){var a=window.OAuth;return a.initialize("Szfec4hwKtUV3-BPVLEdvP93fUM"),a}),angular.module("cmsApp").factory("_",function(){return window._}),angular.module("cmsApp").service("DateUtil",["$filter",function(a){function b(a){var b=Math.abs(Math.floor(a));return(10>b?"0":"")+b}function c(a){var c=-a.getTimezoneOffset(),d=c>=0?"+":"-";return a.getFullYear()+"-"+b(a.getMonth()+1)+"-"+b(a.getDate())+"T"+b(a.getHours())+":"+b(a.getMinutes())+":"+b(a.getSeconds())+d+b(c/60)+":"+b(c%60)}this.now={getMonth:function(){return(new Date).getMonth()},getYear:function(){return(new Date).getFullYear()}},this.format=function(b){return a("date")(new Date(b),"yyyy/MM")},this.toISO8601=function(a){return c(new Date(a))},this.fromISO8601=function(a){return{toMilliseconds:function(){return new Date(a).getTime()}}}}]),angular.module("cmsApp").service("PostUtil",["DateUtil","_",function(a,b){function c(a){return a.replace(/[^\w\s]/gi,"")}function d(a){var b=a.replace(/\s+/g,"-");return b}function e(a){var b=new Date(a.metadata.date);return b.toISOString().split("T")[0]}this.decodeContent=function(a){return decodeURIComponent(escape(atob(a)))},this.load=function(c){var d={},e=this.decodeContent(c).split("---");e=b.compact(e);var f=e.shift(),g=e.join("---");return d.body=g.replace(/^\n/,""),d.metadata=window.jsyaml.load(f),d.createdTime=a.fromISO8601(d.metadata.date).toMilliseconds(),d},this.serialize=function(b){b.metadata.date=a.toISO8601(b.metadata.date);var c=["---",window.jsyaml.dump(b.metadata),"---",b.body].join("\n");return unescape(encodeURIComponent(c))},this.generateFileName=function(a){if(a.filename)return a.filename;var b=a.metadata.title.toLowerCase();return b=c(b),b=d(b),e(a)+"-"+b+".md"},this.preparePost=function(a,b,c,d,e){var f={metadata:a,body:b,filename:c};return f.filename=this.generateFileName(f),f.metadata.layout="post",f.metadata.files=d,f.metadata.published=e===!0,f},this.prepareListOfFiles=function(a,c){var d=[];if(c){var e=b.find(a.files,function(b){return b.small===a[c]});e||(e={thumbnail:a[c],small:a[c]},d.push(e))}return d.push(a.files),b.flatten(d)}}]),angular.module("cmsApp").factory("YoutubeLinkUtil",function(){function a(a){return a?c.exec(a)[1]:""}function b(b){return b?'<p style="text-align: center;"><iframe allowfullscreen="" name="coverVideo" frameborder="0" height="360" src="//www.youtube.com/embed/'+a(b)+'" width="640"></iframe></p>':""}var c=/(?:youtube\.(?:com|com\.br)\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/,d={pattern:function(){return c},link:function(c){return{getId:function(){return a(c)},getEmbed:function(){return b(c)}}}};return d}),angular.module("cmsApp").factory("Repository",["Github",function(a){var b={list:function(b,c){return a.content.posts(b,c)},get:function(b){return a.content.post(b)},save:function(b,c,d,e,f){return a.content.save(b,c,d,e,f)}},c={get:function(b){return a.content.skelleton(b)}};return{post:b,organization:a.organization,skelleton:c}}]),angular.module("cmsApp").factory("GithubOrganization",["$q","_","Resource",function(a,b,c){function d(b){var d=a.defer(),e=d.promise,f=c.github;return f.get("orgs/"+b.login).then(function(a){return d.resolve(a)}),e}function e(b){var d=a.defer(),e=d.promise,f=c.github;return f.get("orgs/"+b.login+"/repos").then(function(a){return d.resolve(a)}),e}function f(){var e=a.defer(),f=e.promise,g=c.github;return g.get("user/orgs").then(function(a){e.resolve(a)}),f.then(function(a){return b.each(a,function(b,c){var e=d(b);e.then(function(b){angular.extend(a[c],b)})}),a}),f}return{list:function(){return f()},get:function(a){return{repositories:function(){return e(a)},org:function(){return d(a)}}}}}]),angular.module("cmsApp").factory("GithubUser",["Resource","$q",function(a,b){return{getAuth:function(){var c=b.defer(),d=a.github;return d.get("user").then(function(a){c.resolve(a)}),c.promise}}}]),angular.module("cmsApp").factory("GithubContent",["$q","Resource","PostUtil","DateUtil",function(a,b,c,d){function e(c,d){var e=a.defer(),f=e.promise,g=b.github;return d=d||function(a){return a},g.get(c,{cache:!1}).then(function(a){return e.resolve(d(a))}),f}return{skelleton:function(a){var b=["repos",a.repository.full_name,"contents/skelleton.json?ref=master"].join("/"),d=function(a){return c.decodeContent(a.content)};return e(b,d)},post:function(a){var b=function(a){var b=c.load(a.content);return b.filename=a.name,b};return e(a.url,b)},posts:function(a,b){var c=d.format(new Date(b.year,b.month)),f=["repos",a.repository.full_name,"contents/_posts",c].join("/");return e(f)},save:function(e,f,g){var h=c.serialize(f),i=JSON.stringify({sha:g,content:btoa(h),message:"commit from cms"}),j=d.format(f.metadata.date),k=["repos",e.repository.full_name,"contents/_posts",j,f.filename].join("/"),l=a.defer(),m=l.promise,n=b.github;return n.put(k,{data:i,cache:!1}).error(function(a,b){console.log(a,b)}).then(function(a){return l.resolve(a)}),m}}}]),angular.module("cmsApp").factory("Github",["GithubOrganization","GithubContent","GithubUser",function(a,b,c){return{organization:a,content:b,user:c}}]),angular.module("cmsApp").directive("expand",function(){return{restrict:"A",link:function(a,b){var c=function(){for(var a=b[0];a.rows>1&&a.scrollHeight<a.offsetHeight;)a.rows--;for(var c=0;a.scrollHeight>a.offsetHeight&&c!==a.offsetHeight;)c=a.offsetHeight,a.rows++};b.bind("keyup",function(){c()}),a.$watch(function(){return b[0].value},function(){c()}),a.$on("$destroy",function(){b.unbind("keyup")})}}});var $defer,loaded;angular.module("cmsApp").run(["$rootScope","$q","$timeout",function(a,b,c){function d(){"loaded"===CKEDITOR.status?(loaded=!0,$defer.resolve()):d()}if($defer=b.defer(),angular.isUndefined(window.CKEDITOR))throw new Error("CKEDITOR not found");CKEDITOR.disableAutoInline=!0,CKEDITOR.on("loaded",d),c(d,100),a.insertImageCKEditor=function(a){var b=CKEDITOR.instances.editor_loko,c="<strong>Algo deu errado :/</strong>",d=a.title;a.small?c='<img src="'+a.small+'" alt="'+a.title+'" />':a.link&&(d=prompt("Digite o texto do link",a.title)||a.title,c='<a href="'+a.link+'">'+d+"</a>"),b.insertHtml(c),b.focus()}}]).directive("ckEditor",["$q","$timeout","ENV",function(a,b,c){return{require:"?ngModel",link:function(d,e,f,g){var h=null,i="<p></p>",j=[],k=!1,l=function(){var f={toolbar:"full",toolbar_full:[{name:"basicstyles",items:["Bold","Italic","Strike","Underline"]},{name:"paragraph",items:["BulletedList","NumberedList","Blockquote"]},{name:"editing",items:["JustifyLeft","JustifyCenter","JustifyRight","JustifyBlock"]},{name:"links",items:["Link","Unlink","Anchor"]},{name:"tools",items:["SpellChecker","Maximize"]},"/",{name:"styles",items:["Format","FontSize","TextColor","PasteText","PasteFromWord","RemoveFormat"]},{name:"insert",items:["Image","Youtube","Table","SpecialChar"]},{name:"forms",items:["Outdent","Indent"]},{name:"clipboard",items:["Undo","Redo"]},{name:"document",items:["PageBreak","Source"]}],disableNativeSpellChecker:!1,uiColor:"#FAFAFA",height:"400px",width:"100%"},l=CKEDITOR.replace(e[0],f);CKEDITOR.plugins.addExternal("youtube",c.basepath+"/ckeditor-plugins/youtube/","plugin.js"),l.config.extraPlugins="youtube,justify,image2",l.config.language="pt-BR";var m=a.defer();e.bind("$destroy",function(){l.destroy(!1)});var n=function(a){var c=l.getData();""===c&&(c=null),b(function(){(a!==!0||c!==g.$viewValue)&&g.$setViewValue(c),a===!0&&h&&h.$setPristine()},0)},o=function(a){if(j.length){var b=j.pop()||i;k=!1,l.setData(b,function(){n(a),k=!0})}};l.on("pasteState",n),l.on("change",n),l.on("blur",n),l.on("drop",n),l.on("instanceReady",function(){d.$broadcast("ckeditor.ready"),d.$apply(function(){o(!0)}),l.document.on("keyup",n),l.document.on("drop",function(a){var b=a.data.$.dataTransfer,c=/<img.*src="(.*)"/g,d=c.exec(b.getData("text/html"));if(d){a.data.preventDefault();var e=d[1],f='<img src="'+e+'" />';return l.insertHtml(f),!1}})}),l.on("customConfigLoaded",function(){m.resolve()}),g.$render=function(){j.push(g.$viewValue),k&&o()}};"loaded"===CKEDITOR.status&&(loaded=!0),loaded?l():$defer.promise.then(l)}}}]),angular.module("cmsApp").directive("showErrors",function(){return{restrict:"A",require:"^form",link:function(a,b,c,d){var e=b[0].querySelector("input, select, textarea"),f=angular.element(e),g=f.attr("name"),h=function(){if(d[g]){var a=d[g].$invalid;window.$(b.parent().get(0)).toggleClass("has-error",a),b.toggleClass("has-error",a)}};f.bind("blur",function(){h()}),a.$on("submited",function(){h()}),a.$on("$destroy",function(){b.unbind("submited blur")})}}}),angular.module("cmsApp").directive("dynamicField",["$compile","_",function(a,b){function c(a,b){a.attr("name",b.name)}function d(a,c){var d=c.need;if(d){var e=d.field,f=[],g=b.flatten([d.value]);g.forEach(function(a){var b=a,c=d.equal?"===":"!==";f.push(["entity.",e,c,"'",b,"'"].join(""))});var h=f.join("&&");a.attr("ng-required",h),a.attr("ng-show",h)}else a.attr("ng-required","field.required")}return{restrict:"A",terminal:!0,priority:1e3,link:function(b,e,f){var g=b.$eval(f.dynamicField);g&&(c(e,g),d(e,g),e.removeAttr("dynamic-field"),a(e)(b))}}}]),angular.module("cmsApp").directive("upload",function(){return{restrict:"A",controller:"UploadCtrl",scope:{},link:function(a,b){b.bind("change",function(b){var c=b.target.files;a.uploadFiles(c),b.target.value=""}),a.$on("$destroy",function(){b.unbind("change")})}}}),angular.module("cmsApp").directive("yearDrop",function(){var a=(new Date).getFullYear();return{require:"?ngModel",link:function(b,c,d){b.years=[];for(var e=+d.offset;e<+d.range+1;e++)b.years.push(a+e);b.selected=a},template:'<select ng-model="filter.year" class="form-control" ng-change="find()" ng-options="y for y in years"></select>'}});