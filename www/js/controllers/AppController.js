angular
	.module('todoApp')
	.controller('AppController', AppController);

AppController.$inject = ['$scope', '$state', '$ionicModal', '$ionicSideMenuDelegate', 'Projects', '$firebaseArray', 'FireBaseUrl', '$ionicLoading'];
function AppController($scope, $state, $ionicModal, $ionicSideMenuDelegate, Projects, $firebaseArray, FireBaseUrl, $ionicLoading) {

	//set reference to Firebase DB
	var firebaseKeyRegEx = /^-[\w-]{19}$/;

	//set projects equal to Firebase DB transformed to array (this will stay in sync with DB)
	$scope.projects = Projects.all();

	$scope.projects.$loaded()
		.then(function () {
			var lastActiveKey = Projects.getLastActiveIndex();
			console.log('lastActiveKey', lastActiveKey);
			console.log('Check FB Key', firebaseKeyRegEx.test(lastActiveKey));
			
			if (firebaseKeyRegEx.test(lastActiveKey)) {
				$scope.selectProject(lastActiveKey);
			} else {
				$scope.selectProject($scope.projects[0].$id);
			}
		})
		.catch(function (error) {
			console.error("Error:", error);
		}).finally(function () {
			$scope.hideLoading();
		});

	// Selects the given project by it's firebase key
	$scope.selectProject = function (key) {
		console.log($scope.projects);
		console.log('key', key);
		$scope.activeProject = $scope.projects.$getRecord(key);
		Projects.setLastActiveIndex(key);
		$ionicSideMenuDelegate.toggleLeft(false);
	};


	$ionicModal.fromTemplateUrl('templates/new-project.html', function (modal) {
		$scope.projectModal = modal;
	}, {
		scope: $scope
	});

	$scope.showLoading = function () {
		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 500
		});
	};
	$scope.hideLoading = function () {
		$ionicLoading.hide();
	};
	$scope.showLoading();

	$scope.showProjectModal = function () {
		$scope.projectModal.show();
	};

	$scope.closeNewProject = function () {
		$scope.projectModal.hide();
	};

	$scope.newProject = function (project) {
		if (!project) {
			return;
		}

		$scope.showLoading();

		Projects.newProject(project)
			.then(function (ref) {
				$scope.selectProject(ref.key());

			}).finally(function () {
				$scope.hideLoading();
			});

		$scope.projectModal.hide();
		project.title = '';
	};

	$scope.deleteProject = function (index) {
		Projects.deleteProject(index);
	};
}