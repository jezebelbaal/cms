"use strict";angular.module("config",[]).constant("ENV",{name:"production",basepath:"/cms"}),angular.module("cmsApp",["config","ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ngTagsInput","ui.bootstrap","mgcrea.ngStrap.datepicker","mgcrea.ngStrap.tooltip","mgcrea.ngStrap.helpers.dateParser","mgcrea.ngStrap.timepicker"]).config(["$routeProvider",function(a){a.when("/auth",{templateUrl:"views/auth.html",controller:"AuthCtrl"}).when("/post/search",{templateUrl:"views/post/search.html",controller:"PostSearchCtrl"}).when("/post/:year/:month",{templateUrl:"views/post/create.html",controller:"PostCreateCtrl"}).when("/post/:year/:month/:sha/:url*",{templateUrl:"views/post/create.html",controller:"PostCreateCtrl"}).otherwise({redirectTo:"/auth"})}]).run(["$rootScope","$location","$http","Resource","ENV","Repository",function(a,b,c,d,e,f){a.alerts=[],a.addError=function(b){a.alerts.push({msg:b,type:"danger"})},a.addWarning=function(b){a.alerts.push({msg:b,type:"warning"})},a.closeAlert=function(b){a.alerts.splice(b,1)},a.cleanAlerts=function(){a.alerts=[]},a.loadSkelleton=function(){f.skelleton.get(a.repository).then(function(b){a.user.skelleton=angular.fromJson(b)})["catch"](function(b){a.addWarning(b),c.get("default-skelleton.json").success(function(b){a.user.skelleton=angular.fromJson(b)})})},a.$on("$locationChangeStart",function(){return a.error=null,d.github?void 0:(b.path("/auth").replace(),!1)}),d.isProduction="production"===e.name}]),angular.module("cmsApp").filter("startFrom",function(){return function(a,b){return b=+b,"object"==typeof a&&a.length>0?a.slice(b):[]}}),angular.module("cmsApp").controller("AuthCtrl",["$rootScope","$scope","$timeout","$location","oauth","_","User","Resource","Repository",function(a,b,c,d,e,f,g,h,i){var j=function(a){var c=b.user.organization;return i.organization.get(c).repository(a)};b.user={logged:!1,organization:!1,repositories:[]},b.finish=function(c){if(c){var e=angular.fromJson(c);b.user.repository=e,a.user=b.user,a.repository=b.user.repository,d.path("/post/search")}},b.isOrgSelected=function(a){return b.user.organization?b.user.organization.login===a.login:!1},b.getRepositories=function(a){if(b.user.organization=void 0,b.user.repositories=[],a){var c=angular.fromJson(a);b.user.organization=c,c.repositories&&1===c.repositories.length?j(c.repositories[0]).then(function(a){b.finish(a)}):c.repositories?f.each(c.repositories,function(a){j(a).then(function(a){b.user.repositories.push(a)})}):i.organization.get(c).repositories().then(function(a){b.user.repositories=a})}},b.authenticate=function(){e.popup("github",{cache:!0}).done(function(a){h.github=a,c(function(){b.user=g.info(),b.user.logged=!0},0)}).fail(function(a){return a?window.alert(a):void 0})}}]),angular.module("cmsApp").controller("PostSearchCtrl",["$rootScope","$scope","$location","DateUtil","PostUtil","Repository",function(a,b,c,d,e,f){b.cleanAlerts(),b.posts=[],b.maxSize=5,b.currentPage=1,b.ready=!1,b.filter={month:d.now.getMonth(),year:d.now.getYear(),title:"",search:function(){return f.content.list(a.repository,this).then(function(a){b.updateView(a)})}},b.organization=a.user.organization,b.canStartFilter=function(){return b.filter.title&&b.filter.title.length>3},b.updateView=function(a){b.currentPage=1,b.posts=a||b.posts,b.loadElements()},b.loadElements=function(){var a=(b.currentPage-1)*b.maxSize,c=b.maxSize,d=b.posts.slice(a,a+c);d.forEach(function(a){a.metadata||f.content.get(a).then(function(b){angular.extend(a,b)})})},b.ready=function(){return!!a.user.skelleton},b.create=function(){var a=b.filter.year,d=b.filter.month;c.path("/post/"+a+"/"+d)},b.edit=function(a){var d=b.filter.year,e=b.filter.month;c.path("/post/"+d+"/"+e+"/"+a.sha+"/"+a.url)},b.load=function(){b.filter.search(),b.loadSkelleton()},b.load()}]),angular.module("cmsApp").controller("PostCreateCtrl",["$rootScope","$scope","$location","$routeParams","$q","_","PostUtil","Repository","TagsUtil",function(a,b,c,d,e,f,g,h,i){b.cleanAlerts(),b.state="default",b.entity={date:(new Date).toString()},b.body="",b.cover="",b.editorLoaded=!1,b.fields=a.user.skelleton||[],b.files=[],b.releatedPosts=[],b.suggestedPosts=[],b.tags=new i,b.coverField=void 0,b.videoField=void 0,b.fields.forEach(function(a){"cover"===a.type.view?b.coverField=a:"video"===a.type.view&&(b.videoField=a)}),b.$on("upload-file",function(a,c){b.files.push(c.file)}),b.removeImage=function(a){window.confirm("Deseja realmente remover este item?")&&b.files.splice(a,1)},b.$on("ckeditor.ready",function(){b.editorLoaded=!0});var j=function(){var a=b.videoField;return a&&a.name?b.entity[a.name]:""};b.save=function(e,i){if("publish"===i||"draft"===i){var k="publish"===i,l=d.sha;if(b.$broadcast("submited"),e.$invalid){var m=e.$error.required||[],n=[];m.forEach(function(a){var c=f.find(b.fields,function(b){return b.name===a.$name});n.push(c.title)});var p="Os campos: "+n.join(", ")+" precisam ser preenchidos.";b.addWarning(p)}else{b.state=k?"publishing":"saving";var q=j(),r=g.preparePost(b.entity,b.body,b.filename,b.files,k,q);r.then(function(d){d.metadata[b.coverField.name]=b.cover,d.metadata.releated_posts=o(b.entity.tags),h.content.save(a.repository,d,l).then(function(){b.cleanAlerts(),b.state="default",c.path("/post/search")})["catch"](function(a){b.state="default",b.addError(a)})})}}};var k=function(a){a=a||function(){},h.tagsFile.get(b.user).then(function(c){b.tags=new i(angular.fromJson(c)),a()})},l=function(a){var c=b.releatedPosts.indexOf(a);c>=0&&b.releatedPosts.splice(c,1)},m=function(a){var c=b.releatedPosts.indexOf(a);c>=0?l(a):b.releatedPosts.push(a)},n=function(a){return f.find(b.releatedPosts,function(b){return b===a})};b.addReleatedPost=m,b.removeReleatedPost=l,b.isPostReleated=n;var o=function(a){return b.tags.getReleatedPosts(a,{postToRemove:b.filename})},p=function(){var a=b.entity.tags||[];if(0===a.length)b.suggestedPosts=[],b.releatedPosts=[];else{var c=o(a),d=[];a.forEach(function(a){d.push(o([a]))}),b.suggestedPosts=f.flatten(d),a.length>1&&(b.releatedPosts=f.union(c,b.releatedPosts))}};b.fillReleatedPosts=p,b.load=function(){var a={url:d.url};a.url?(b.state="loading",h.content.get(a).then(function(a){b.entity=a.metadata,b.body=a.body,b.filename=a.filename,b.files=g.prepareListOfFiles(a.metadata,b.coverField.name),b.cover=a.metadata[b.coverField.name],k(function(){p(),b.state="default"})})):k()},b.toggleCover=function(a){return b.cover===a?void(b.cover=null):void(b.cover=a)}}]),angular.module("cmsApp").controller("UploadCtrl",["$scope","$http","$rootScope","Resource","_",function(a,b,c,d,e){this.upload={length:0,done:0,working:function(){return this.length!==this.done}},a.upload=this.upload;var f=function(a){var b=new FormData;return angular.forEach(a,function(a,c){b.append(c,a)}),b};a.uploadFiles=function(a){var d="//mst-image-service.herokuapp.com/upload";c.$broadcast("prepared-to-upload",{length:a.length}),e.each(a,function(a){b({url:d,method:"POST",transformRequest:f,headers:{"Content-Type":void 0},data:{organization:c.user.organization.id,myfile:a}}).success(function(a){c.$broadcast("upload-file",{file:a})}).error(function(a){console.log(a),c.addError("Desculpa, algo de errado aconteceu ao adicionar o arquivo na notícia.")})})},a.$on("upload-file",function(){a.upload.done=a.upload.done+1}),a.$on("prepared-to-upload",function(b,c){a.upload.length=c.length,a.upload.done=0})}]),angular.module("cmsApp").factory("Resource",function(){return{github:"",isProduction:!1}}),angular.module("cmsApp").factory("User",["_","Github",function(a,b){var c=function(c,d){b.organization.searchJekyllFiles(d).then(function(b){if(b.total_count>0){var e=[];a.each(b.items,function(a){e.push(a.repository.name)}),d.repositories=a.uniq(e),c.organizations.push(d)}})};return{info:function(){var d=b.user.getAuth(),e={info:"",organizations:[],repositories:[]};return d.then(function(d){e.info=d;var f=b.organization.list();f.then(function(b){var f=a.union(b,[d]);a.each(f,function(a){c(e,a)})})}),e}}}]),angular.module("cmsApp").factory("oauth",function(){var a=window.OAuth;return a.initialize("Szfec4hwKtUV3-BPVLEdvP93fUM"),a}),angular.module("cmsApp").factory("_",function(){return window._}),angular.module("cmsApp").service("DateUtil",["$filter",function(a){function b(a){var b=Math.abs(Math.floor(a));return(10>b?"0":"")+b}function c(a){var c=-a.getTimezoneOffset(),d=c>=0?"+":"-";return a.getFullYear()+"-"+b(a.getMonth()+1)+"-"+b(a.getDate())+"T"+b(a.getHours())+":"+b(a.getMinutes())+":"+b(a.getSeconds())+d+b(c/60)+":"+b(c%60)}this.now={getMonth:function(){return(new Date).getMonth()},getYear:function(){return(new Date).getFullYear()}},this.isValidMonth=function(a){return!isNaN(a)&&isFinite(a)&&12>a?!0:!1},this.parseMonth=function(a){return a=parseInt(a)+1,10>a?"0"+a:a},this.format=function(b){return a("date")(new Date(b),"yyyy/MM")},this.toISO8601=function(a){return c(new Date(a))},this.fromISO8601=function(a){return{toMilliseconds:function(){return new Date(a).getTime()}}}}]),angular.module("cmsApp").service("PostUtil",["$http","$q","DateUtil","_","YoutubeLinkUtil","VimeoLinkUtil",function(a,b,c,d,e,f){function g(a){var b=new Date(a.metadata.date);return b.toISOString().split("T")[0]}function h(a){var c=b.defer(),d=c.promise;return c.resolve(e.link(a).getValidUrl()?e.link(a).getVideoThumbnailUrl():f.link(a).getValidUrl()?f.link(a).getVideoThumbnailUrl():""),d}function i(a){return encodeURIComponent(["---",window.jsyaml.dump(a.metadata),"---",a.body].join("\n"))}this.downloadMarkdown=function(a){window.open("data:application/octet-stream;charset=utf-8,filename="+a.filename+","+i(a),a.filename)},this.decodeContent=function(a){return decodeURIComponent(escape(atob(a)))},this.load=function(a){var b={},c=this.decodeContent(a).split("---");c=d.compact(c);var e=c.shift(),f=c.join("---");return b.body=f.replace(/^\n/,""),b.metadata=window.jsyaml.load(e),b},this.getYearMonthCreated=function(a){var b=a.metadata?a.metadata.created_date:!1,d=new Date(c.now.getYear(),c.now.getMonth());return c.format(b||d)},this.serialize=function(a){return a.metadata.date=c.toISO8601(a.metadata.date),unescape(i(a))},this.generateFileName=function(a){return a.filename?a.filename:g(a)+"-"+this.formatName(a.metadata.title)+".md"},this.formatName=function(a){return getSlug(a)},this.preparePost=function(a,d,e,f,g,i){var j=b.defer(),k=j.promise,l={metadata:a,body:d,filename:e};return l.filename=this.generateFileName(l),l.metadata.layout="post",l.metadata.files=f,l.metadata.created_date=l.metadata.created_date||c.toISO8601(new Date),l.metadata.published=g===!0,i?h(i).then(function(a){return a&&(l.metadata.video_thumbnail=a),j.resolve(l)}):j.resolve(l),k},this.prepareListOfFiles=function(a,b){var c=[];if(b){var e=d.find(a.files,function(c){return c.small===a[b]});e||(e={thumbnail:a[b],small:a[b]},c.push(e))}return c.push(a.files),d.flatten(c)}}]),angular.module("cmsApp").factory("TagsUtil",["$q","_",function(a,b){var c=function(a){if(!a)return[];for(var c=[],d=arguments.length,e=arguments,f=0,g=!1;!g;){for(var h=f;d>h;h++)if(h!==f){var i=b.intersection(e[f],e[h]);c.push(i)}f++,g=f===d}var j=b.flatten(c);return b.countBy(j)},d={},e={},f=function(c){c=c?c.toLowerCase():"";var d=a.defer(),f=b.map(e,function(a){return a.toLowerCase().match(c)?{tag:a}:!1});return d.resolve(b.compact(f)),d.promise},g=function(a){var e=b.pick(d,function(c,d){return b.find(a,function(a){return getSlug(d)===getSlug(a)})}),f=b.values(e);return a.length>1?c.apply(this,f):b.countBy(b.last(b.flatten(f),10))},h=function(a,c){c=c||{postToRemove:!1};var d=b.map(a,function(a){return getSlug(a.tag||a)}),e=g(d),f=[];for(var h in e)c.postToRemove&&h.match(c.postToRemove)||f.push([h,e[h]||0]);return f=f.sort(function(a,b){return b[1]-a[1]}),b.map(f,function(a){return a[0]})},i=function(a){return d=a||{},e=b.keys(d),{search:f,getPostsByTags:g,getReleatedPosts:h}};return i}]),angular.module("cmsApp").factory("YoutubeLinkUtil",function(){function a(a){return a?d.exec(a)[1]:""}function b(b){var c="www.youtube.com/watch?v=",d=a(b);return c+d}function c(b){if(b){var c=a(b);return"http://img.youtube.com/vi/"+c+"/0.jpg"}}var d=/(?:youtube\.(?:com|com\.br)\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/,e={pattern:function(){return d},link:function(e){return{getId:function(){return a(e)},getValidUrl:function(){return d.test(e)?b(e):!1},getVideoThumbnailUrl:function(){return c(e)}}}};return e}),angular.module("cmsApp").factory("VimeoLinkUtil",["$http","$q",function(a,b){function c(a){return a?f.exec(a)[3]:""}function d(a){var b="vimeo.com/",d=c(a);return b+d}function e(c){if(c){var d=b.defer(),e=d.promise;return a.get("//vimeo.com/api/oembed.json?url="+c).success(function(a){return d.resolve(a.thumbnail_url)}),e}}var f=/(player\.)?vimeo\.com(\/video)?\/(\d+)/,g={pattern:function(){return f},link:function(a){return{getId:function(){return c(a)},getValidUrl:function(){return f.test(a)?d(a):!1},getVideoThumbnailUrl:function(){return e(a)}}}};return g}]),angular.module("cmsApp").factory("Repository",["Github",function(a){var b={list:function(b,c){return a.content.posts(b,c)},get:function(b,c){return b.url?a.content.post(b):a.content.load(b,c)},save:function(b,c,d,e,f){return a.content.save(b,c,d,e,f)},search:function(b,c){return a.content.search(b,c)}},c={get:function(b){return a.content.tagsFile(b)}},d={get:function(b){return a.content.skelleton(b)}};return{content:b,organization:a.organization,skelleton:d,tagsFile:c}}]),angular.module("cmsApp").factory("GithubOrganization",["$q","_","Resource",function(a,b,c){function d(b){var d=a.defer(),e=d.promise,f=c.github;return f.get("orgs/"+b.login).then(function(a){return d.resolve(a)}),e}function e(b,d){var e=a.defer(),f=e.promise,g=c.github;return g.get("repos/"+b.login+"/"+d).then(function(a){return e.resolve(a)}),f}function f(b){var d=a.defer(),e=d.promise,f=c.github;return f.get("orgs/"+b.login+"/repos").then(function(a){return d.resolve(a)}),e}function g(){var e=a.defer(),f=e.promise,g=c.github;return g.get("user/orgs").then(function(a){e.resolve(a)}),f.then(function(a){return b.each(a,function(b,c){b.ready=!1;var e=d(b);e.then(function(d){angular.extend(a[c],d),b.ready=!0})}),a}),f}function h(b){var d=["search/code?q=","_config","+in:path"].join(""),e=["+user:",b.login].join(""),f=["+extension","yml"].join(":"),g="&sort=updated&order=desc",h=[d,f,e,g].join(""),i=a.defer(),j=i.promise,k=c.github;return k.get(h).then(function(a){return i.resolve(a)}),j}return{list:function(){return g()},get:function(a){return{repositories:function(){return f(a)},org:function(){return d(a)},repository:function(b){return e(a,b)}}},searchJekyllFiles:h}}]),angular.module("cmsApp").factory("GithubUser",["Resource","$q",function(a,b){return{getAuth:function(){var c=b.defer(),d=a.github;return d.get("user").then(function(a){c.resolve(a)}),c.promise}}}]),angular.module("cmsApp").factory("GithubContent",["$q","Resource","PostUtil","DateUtil",function(a,b,c,d){function e(c,d,e){var f=a.defer(),g=f.promise,h=b.github;return d=d||function(a){return a},e=e||function(a){return a.responseJSON.message},h.get(c,{cache:!1}).error(function(a){return f.reject(e(a))}).then(function(a){return f.resolve(d(a))}),g}return{skelleton:function(a){var b=["repos",a.full_name,"contents/skelleton.json?ref=master"].join("/"),d=function(a){return c.decodeContent(a.content)},f=function(a){console.log(a);var b=a.responseJSON.message;return 404===a.status&&(b="Não achei um metadado no seu repositório, usarei o meu padrão!"),b};return e(b,d,f)},load:function(a,b){var d=["repos",b.full_name,"contents/_posts",a].join("/"),f=function(a){var b=c.load(a.content);return b.filename=a.name,b};return e(d,f)},post:function(a){var b=function(a){var b=c.load(a.content);return b.filename=a.name,b};return e(a.url,b)},tagsFile:function(a){var b=["repos",a.repository.full_name,"contents/tags.json?ref=gh-pages"].join("/"),d=function(a){return c.decodeContent(a.content)};return e(b,d)},posts:function(a,b){var c=["search/code?q=","title"].join(""),f=["+path:","_posts",b.year].join("/"),g=["+repo:",a.full_name].join(""),h=["+filename","md"].join(":"),i="&sort=updated&order=desc";if(b.title.length>0&&(h=["+filename",getSlug(b.title)].join(":")),d.isValidMonth(b.month)){var j=d.parseMonth(b.month);f=[f,j].join("/")}var k=[c,h,f,g,i].join(""),l=function(a){return a.items=a.items.sort(function(a,b){var c=new Date(a.name.substring(0,10)),d=new Date(b.name.substring(0,10));return d-c}),a.items};return e(k,l)},save:function(d,e,f){var g=c.serialize(e),h=JSON.stringify({sha:f,content:btoa(g),message:"commit from cms"}),i=c.getYearMonthCreated(e),j=["repos",d.full_name,"contents/_posts",i,e.filename].join("/"),k=a.defer(),l=k.promise,m=b.github;return b.isProduction?m.put(j,{data:h,cache:!1}).error(function(a){console.log(a);var b=a.responseJSON.message;return 422===a.status&&(b="Essa notícia já existe."),k.reject(b)}).then(function(a){return k.resolve(a)}):(c.downloadMarkdown(e),k.resolve()),l}}}]),angular.module("cmsApp").factory("Github",["GithubOrganization","GithubContent","GithubUser",function(a,b,c){return{organization:a,content:b,user:c}}]),angular.module("cmsApp").directive("expand",function(){return{restrict:"A",link:function(a,b){var c=function(){for(var a=b[0];a.rows>1&&a.scrollHeight<a.offsetHeight;)a.rows--;for(var c=0;a.scrollHeight>a.offsetHeight&&c!==a.offsetHeight;)c=a.offsetHeight,a.rows++};b.bind("keyup",function(){c()}),a.$watch(function(){return b[0].value},function(){c()}),a.$on("$destroy",function(){b.unbind("keyup")})}}});var $defer,loaded;angular.module("cmsApp").run(["$rootScope","$q","$timeout",function(a,b,c){function d(){"loaded"===CKEDITOR.status?(loaded=!0,$defer.resolve()):d()}if($defer=b.defer(),angular.isUndefined(window.CKEDITOR))throw new Error("CKEDITOR not found");CKEDITOR.config.allowedContent=!0,CKEDITOR.disableAutoInline=!0,CKEDITOR.on("loaded",d),c(d,100),a.insertImageCKEditor=function(a){var b=CKEDITOR.instances.editor,c="<strong>Algo deu errado :/</strong>",d=a.title;a.small?c='<img src="'+a.link+'" alt="'+a.title+'" />':a.link&&(d=prompt("Digite o texto do link",a.title)||a.title,c='<a href="'+a.link+'">'+d+"</a>",a.title.indexOf(".mp3")>-1&&(c+='<br/> <audio src="'+a.link+'" type="audio/mpeg" controls="controls">'+d+"</audio>")),b.insertHtml(c,"unfiltered_html"),b.focus()}}]).directive("ckEditor",["$q","$timeout","ENV",function(a,b,c){return{require:"?ngModel",link:function(d,e,f,g){var h=null,i="<p></p>",j=[],k=!1,l=function(){var f={toolbar:"full",toolbar_full:[{name:"basicstyles",items:["Bold","Italic","Strike","Underline"]},{name:"paragraph",items:["BulletedList","NumberedList","Blockquote"]},{name:"editing",items:["JustifyLeft","JustifyCenter","JustifyRight","JustifyBlock"]},{name:"links",items:["Link","Unlink","Anchor"]},{name:"tools",items:["SpellChecker","Maximize"]},"/",{name:"styles",items:["Format","FontSize","TextColor","PasteText","PasteFromWord","RemoveFormat"]},{name:"insert",items:["Image","Youtube","Table","SpecialChar"]},{name:"forms",items:["Outdent","Indent"]},{name:"clipboard",items:["Undo","Redo"]},{name:"document",items:["PageBreak","Source"]}],disableNativeSpellChecker:!1,uiColor:"#FAFAFA",height:"600px",width:"100%"},l=CKEDITOR.replace(e[0],f);CKEDITOR.plugins.addExternal("youtube",c.basepath+"/ckeditor-plugins/youtube/","plugin.js"),CKEDITOR.plugins.addExternal("audio",c.basepath+"/ckeditor-plugins/audio/","plugin.js"),l.config.extraPlugins="youtube,justify,image2,audio",l.config.language="pt-BR";var m=a.defer();e.bind("$destroy",function(){l.destroy(!1)});var n=function(a){var c=l.getData();""===c&&(c=null),b(function(){(a!==!0||c!==g.$viewValue)&&g.$setViewValue(c),a===!0&&h&&h.$setPristine()},0)},o=function(a){if(j.length){var b=j.pop()||i;k=!1,l.setData(b,function(){n(a),d.$broadcast("ckeditor.ready"),k=!0})}};l.on("pasteState",n),l.on("change",n),l.on("blur",n),l.on("drop",n),l.on("instanceReady",function(){d.$apply(function(){o(!0)}),l.document.on("keyup",n),l.document.on("drop",function(a){var b=a.data.$.dataTransfer,c=/<img.*src="(.*)"/g,d=c.exec(b.getData("text/html"));if(d){a.data.preventDefault();var e=d[1],f='<img src="'+e+'" />';return l.insertHtml(f),!1}})}),l.on("customConfigLoaded",function(){m.resolve()}),g.$render=function(){j.push(g.$viewValue),k&&o()}};"loaded"===CKEDITOR.status&&(loaded=!0),loaded?l():$defer.promise.then(l)}}}]),angular.module("cmsApp").directive("showErrors",function(){return{restrict:"EA",require:"^form",priority:100,link:function(a,b,c,d){var e=angular.element(b),f=e.attr("name"),g=function(a,b){window.$(a.parent().get(0)).toggleClass("has-error",b),a.toggleClass("has-error",b)},h=function(){if(d[f]){var a=d[f].$invalid;g(b,a)}};e.bind("blur",function(){h()}),a.$on("submited",function(){h()}),a.$on("$destroy",function(){b.unbind("submited blur")})}}}),angular.module("cmsApp").directive("dynamicField",["$compile","_",function(a,b){function c(a,b){a.attr("name",b.name)}function d(a,c){var d=c.need;if(d){var e=d.field,f=[],g=b.flatten([d.value]);g.forEach(function(a){var b=a,c=d.equal?"===":"!==";f.push(["entity.",e,c,"'",b,"'"].join(""))});var h=f.join(d.equal?"||":"&&");a.attr("ng-required",h),a.attr("ng-if",h)}else a.attr("ng-required","field.required")}return{restrict:"A",terminal:!0,priority:1e3,link:function(b,e,f){var g=b.$eval(f.dynamicField);g&&(c(e,g),d(e,g),e.removeAttr("dynamic-field"),a(e)(b))}}}]),angular.module("cmsApp").directive("upload",function(){return{restrict:"A",controller:"UploadCtrl",scope:{},link:function(a,b){b.bind("change",function(b){var c=b.target.files;a.uploadFiles(c),b.target.value=""}),a.$on("$destroy",function(){b.unbind("change")})}}}),angular.module("cmsApp").directive("yearDrop",function(){var a=(new Date).getFullYear();return{require:"?ngModel",scope:{filter:"=",change:"&",disabled:"="},link:function(b,c,d){b.years=[];for(var e=+d.offset;e<+d.range+1;e++)b.years.push(a+e);b.selected=a},template:'<select ng-model="filter.year" ng-disabled="disabled" class="form-control year" ng-change="change()" ng-options="y for y in years"></select>'}}),angular.module("cmsApp").directive("validateVideo",["YoutubeLinkUtil","VimeoLinkUtil",function(a,b){return{restrict:"A",require:"^?form",link:function(c,d,e,f){var g=function(a,b){f&&f[a].$setValidity("video-url-format",b)},h=function(b){return a.link(b).getValidUrl()},i=function(a){return b.link(a).getValidUrl()},j=function(b){var c=a.pattern(),d=!!c.exec(b);return d},k=function(a){var c=b.pattern(),d=!!c.exec(a);return d};d.bind("blur",function(){var a=d.val(),b=d.attr("name"),c=j(a),e=k(a),f=c||e;d.toggleClass("invalid-format",!f),d.toggleClass("valid-format",f),g(b,f),c?d.val(h(a)):e&&d.val(i(a))}),c.$on("$destroy",function(){d.unbind("submited blur")})}}}]),angular.module("cmsApp").directive("searchForm",["$q","DateUtil",function(a,b){var c={year:"",month:"",title:"",search:function(){return a.defer().promise}},d=function(a,b,c){return function(){a.toggleClass("disabled",!0),b.loading=!0,c.search().then(function(){b.loading=!1,a.toggleClass("disabled",!1)})}};return{restrict:"E",require:"?filter",replace:!0,scope:{filter:"="},templateUrl:"views/post/include/search-form.html",link:function(a,e){a.filter=angular.extend(c,a.filter),a.loading=!1,a.search=d(e,a,a.filter),a.clearSearch=function(){a.filter.title="",a.filter.month=b.now.getMonth(),a.filter.year=b.now.getYear(),a.search()},e.on("submit",function(){a.submited=!0})}}}]),angular.module("cmsApp").directive("post",["$rootScope","Repository","_",function(a,b,c){return{restrict:"E",require:"?post",replace:!0,scope:{postUrl:"=",tags:"=",coverField:"="},templateUrl:"views/post/include/post.html",link:function(d){d.coverField=d.coverField||{name:""},d.loading=!1,d.tags=d.tags||[],d.checkTag=function(a){return c.find(d.tags,function(b){return getSlug(b.tag)===getSlug(a.tag)})},b.content.get(d.postUrl,a.repository).then(function(a){d.post=a,d.loading=!0})}}}]);