'use strict';

require('jQuery');
require('angular');
require('ngRoute');
require('uiDate');
require('tinymce');
require('jQueryUi');
require('ngCookies');
require('bootstrap');
require('NProgress');
require('fileUpload');
require('ngInfiniteScroll');
require('angularTranslate');
require('angularTranslateLocalStorage');
require('angularTranslateCookieStorage');
require('angularTranslateLoaderPartial');

var app = require('./config');

require('./controllers');
require('./directives');
require('./filters');
require('./services');

window.FileAPI = {
	jsPath: './FileAPI.min.js',
	staticPath: './FileAPI.flash.swf'
};

// Declare app level module which depends on filters, and services
app.config([
	'$routeProvider',
	'$httpProvider',
	'$translateProvider',
	function ($routeProvider, $httpProvider, translateProvider) {

		translateProvider
			.useLoader('$translatePartialLoader', {
				urlTemplate: 'i18n/{part}/{lang}.json'
			})
			.registerAvailableLanguageKeys(['pt', 'en'], {
				'pt_BR': 'pt',
				'pt_PT': 'pt',
				'en_US': 'en',
				'en_UK': 'en',
				'en_EN': 'en'
			})
			.determinePreferredLanguage()
			.useLocalStorage()
			.usePostCompiling(true)
			.useSanitizeValueStrategy('escaped');

		var loadedApplicationData = false;

		function resolveLocalePart(part) {
			return [
				'$translatePartialLoader',
				'$translate',
				'$cookieStore',
				'API',
				function (translatePartialLoader, translate, cookieStore, API) {
					translatePartialLoader.addPart(part);

					// updates a language based on /application service.					
					if (!loadedApplicationData)
					{
						API('GET', '/application', true).success(function (data) {
							loadedApplicationData = true;

							var lang = data.response.language.substr(0, 2).toLowerCase();
							
							translate.use(lang);
						});
					}

					return translate.refresh();
				}
			];
		}

		// Routing
		$routeProvider
			.when('/', {
				templateUrl: 'partials/login.html',
				controller: 'LoginCtrl',
				mustBeLogged: false,
				resolve: {
					locale: resolveLocalePart('login')
				}
			}).when('/dashboard', {
				templateUrl: 'partials/statistics.html',
				controller: 'StatisticsCtrl',
				mustBeLogged: true,
				resolve: {
					locale: resolveLocalePart('statistics')
				}
			}).when('/user/logout', {
				templateUrl: 'partials/user/logout.html',
				controller: 'UserLogoutCtrl',
				mustBeLogged: true,
				resolve: {
					locale: resolveLocalePart('logout')
				}
			}).when('/exports', {
				templateUrl: 'partials/exports/list.html',
				controller: 'ExportsCtrl',
				mustBeLogged: true,
				resolve: {
					locale: resolveLocalePart('exports')
				}
			}).when('/users', {
				templateUrl: 'partials/users/list.html',
				controller: 'UsersCtrl',
				mustBeLogged: true,
				resolve: {
					locale: resolveLocalePart('users')
				}
			}).when('/users/edit/:userId', {
				templateUrl: 'partials/users/edit.html',
				controller: 'UsersEditCtrl',
				mustBeLogged: true,
				resolve: {
					locale: resolveLocalePart('users')
				}
			}).when('/users/edit/:userId/statistics', {
				templateUrl: 'partials/statistics.html',
				controller: 'StatisticsCtrl',
				mustBeLogged: true,
				resolve: {
					locale: resolveLocalePart('statistics')
				}
			}).when('/users/create', {
				templateUrl: 'partials/users/edit.html',
				controller: 'UsersEditCtrl',
				mustBeLogged: true,
				resolve: {
					locale: resolveLocalePart('users')
				}
			}).when('/users/delete/:userId', {
				templateUrl: 'partials/users/delete.html',
				controller: 'UsersDeleteCtrl',
				mustBeLogged: true,
				resolve: {
					locale: resolveLocalePart('users')
				}
			}).when('/configs', {
				templateUrl: 'partials/configs/list.html',
				controller: 'ConfigsCtrl',
				mustBeLogged: true,
				resolve: {
					locale: resolveLocalePart('configs')
				}
			}).when('/logs', {
				templateUrl: 'partials/logs/list.html',
				controller: 'LogsCtrl',
				mustBeLogged: true,
				resolve: {
					locale: resolveLocalePart('logs')
				}
			}).when('/texts/edit/:textId', {
				templateUrl: 'partials/texts/edit.html',
				controller: 'TextsEditCtrl',
				mustBeLogged: true,
				resolve: {
					locale: resolveLocalePart('texts')
				}
			}).when('/texts/create', {
				templateUrl: 'partials/texts/edit.html',
				controller: 'TextsEditCtrl',
				mustBeLogged: true,
				resolve: {
					locale: resolveLocalePart('texts')
				}
			}).when('/texts/delete/:textId', {
				templateUrl: 'partials/texts/delete.html',
				controller: 'TextsDeleteCtrl',
				mustBeLogged: true,
				resolve: {
					locale: resolveLocalePart('texts')
				}
			}).when('/forms', {
				templateUrl: 'partials/forms/main.html',
				controller: 'FormsCtrl',
				mustBeLogged: true,
				resolve: {
					locale: resolveLocalePart('forms')
				}
			}).when('/forms/list', {
				templateUrl: 'partials/forms/list.html',
				controller: 'FormsListCtrl',
				mustBeLogged: true,
				resolve: {
					locale: resolveLocalePart('forms')
				}
			}).when('/forms/create', {
				templateUrl: 'partials/forms/edit.html',
				controller: 'FormsEditCtrl',
				mustBeLogged: true,
				resolve: {
					locale: resolveLocalePart('forms')
				}
			}).when('/forms/edit/:formId', {
				templateUrl: 'partials/forms/edit.html',
				controller: 'FormsEditCtrl',
				mustBeLogged: true,
				resolve: {
					locale: resolveLocalePart('forms')
				}
			}).when('/forms/edit/:formId/assignments', {
				templateUrl: 'partials/forms/assignments.html',
				controller: 'FormsListAssignmentsCtrl',
				mustBeLogged: true,
				resolve: {
					locale: resolveLocalePart('forms')
				}
			}).when('/forms/edit/:formId/statistics', {
				templateUrl: 'partials/statistics.html',
				controller: 'StatisticsCtrl',
				mustBeLogged: true,
				resolve: {
					locale: resolveLocalePart('statistics')
				}
			}).when('/forms/edit/:formId/users/:userId/statistics', {
				templateUrl: 'partials/statistics.html',
				controller: 'StatisticsCtrl',
				mustBeLogged: true,
				resolve: {
					locale: resolveLocalePart('statistics')
				}
			}).when('/forms/edit/:formId/submissions', {
				templateUrl: 'partials/forms/submissions/list.html',
				controller: 'FormsSubmissionsListCtrl',
				mustBeLogged: true,
				resolve: {
					locale: resolveLocalePart('forms')
				}
			}).when('/forms/edit/:formId/submissions/:submissionId', {
				templateUrl: 'partials/forms/submissions/view.html',
				controller: 'FormsSubmissionsViewCtrl',
				mustBeLogged: true,
				resolve: {
					locale: resolveLocalePart('forms')
				}
			}).when('/forms/edit/:formId/submissions/user/:userId', {
				templateUrl: 'partials/forms/submissions/list.html',
				controller: 'FormsSubmissionsListCtrl',
				mustBeLogged: true,
				resolve: {
					locale: resolveLocalePart('forms')
				}
			}).when('/forms/delete/:formId', {
				templateUrl: 'partials/forms/delete.html',
				controller: 'FormsDeleteCtrl',
				mustBeLogged: true,
				resolve: {
					locale: resolveLocalePart('forms')
				}
			}).when('/404', {
				templateUrl: 'partials/404.html',
				controller: '404Ctrl',
				mustBeLogged: false,
				resolve: {
					locale: resolveLocalePart('404')
				}
			}).otherwise({
				redirectTo: '/404'
			});

		// SHITTY CORS
		$httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
		///$httpProvider.defaults.withCredentials = true;

		//Check if server returns 401 (unvalid token)
		//var interceptor = [
		//	'$location',
		//	'$q',
		//	'$cookieStore',
		//	function($location, $q, $cookieStore) {
		//		function success(response)
		//		{
		//			return response;
		//		}
		//
		//		function error(response) {
		//			if(response.status === 403)
		//			{
		//				$cookieStore.remove('session_id');
		//				$cookieStore.remove('user_id');
		//
		//				window.location.reload();
		//			}
		//			else
		//			{
		//				return $q.reject(response);
		//			}
		//		}
		//
		//		return function(promise)
		//		{
		//			return promise.then(success, error);
		//		};
		//	}];

		//$httpProvider.responseInterceptors.push(interceptor);
	}]).run([
	'$rootScope',
	'$location',
	'Auth',
	'$translatePartialLoader',
	function ($rootScope, $location, Auth, translatePartialLoader) {

		translatePartialLoader.addPart('layout');

		$rootScope.showLogin = false;
		$rootScope.showLoading = false;
		$rootScope.renderingPage = true;

		$rootScope.$on('$routeChangeStart', function (event, next, current) {
			Auth.checkCookies(function() {
				if (next.mustBeLogged && !Auth.isLogged())
				{
					$location.path('/');
				}

				if (Auth.isLogged() && next.controller === 'LoginCtrl')
				{
					// We have to set showLogin to false after
					// LoginCtrl sets it to true
					$rootScope.showLogin = false;
					$location.path('/dashboard');
				}

				// Check if user role is API
				if (Auth.isLogged() && Auth.getUser().role !== 'api')
				{
					Auth.logout();
					$location.path('/404');
				}

				// When leave 404 page, hide login page layout
				if (typeof current !== 'undefined' &&
					current.controller === '404Ctrl')
				{
					$rootScope.showLogin = false;
				}

				$rootScope.renderingPage = false;
			});

			$rootScope.$on('$routeChangeSuccess', function () {
				$rootScope.sidebar = null;
			});

			// Empty menus
			$rootScope.submenu = [];
			$rootScope.sidemenu = [];
		});
	}
]);