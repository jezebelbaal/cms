'use strict';

describe('Directive: validate-video', function () {

  // load the directive's module
  beforeEach(module('cmsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make input invalid when its not a video url', inject(function ($compile) {
    element = angular.element('<input type="text" class="form-control" validate-video/>');
    element.val('http://www.google.com.br');
    element = $compile(element)(scope);

    element.triggerHandler('blur');
    expect(element.hasClass('invalid-format')).toBeTruthy();
    expect(element.hasClass('valid-format')).toBeFalsy();
  }));

  it('should make input valid when its a video url', inject(function ($compile) {
    element = angular.element('<input type="text" class="form-control" validate-video/>');
    element.val('www.youtube.com/watch?v=KQQrHH4RrNc');
    element = $compile(element)(scope);

    element.triggerHandler('blur');
    expect(element.hasClass('valid-format')).toBeTruthy();
    expect(element.hasClass('invalid-format')).toBeFalsy();
  }));
});
