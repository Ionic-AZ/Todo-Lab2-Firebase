	angular
		.module('todoApp')
		.controller('AppController', AppController);
			
	AppController.$inject = ['$scope', '$state', '$ionicModal', '$ionicSideMenuDelegate', 'Projects', '$firebaseArray', 'FireBaseUrl'];
	function AppController($scope, $state, $ionicModal, $ionicSideMenuDelegate, Projects, $firebaseArray, FireBaseUrl) {

		//set reference to Firebase DB
		var ref = new Firebase(FireBaseUrl);
		
		//set projects equal to Firebase DB transformed to array (this will stay in sync with DB)
		var list = $firebaseArray(ref);

		

		list.$loaded()
			.then(function(x) {
				$scope.projects = x;
				$scope.activeProject = $scope.projects[0];
			})
			.catch(function(error) {
				console.error("Error:", error);
			});

		$ionicModal.fromTemplateUrl('templates/new-project.html', function(modal) {
			$scope.projectModal = modal;
			}, {
				scope: $scope
			});
			
		$scope.showProjectModal = function () {
			$scope.projectModal.show();
		};
		
		$scope.closeNewProject = function () {
			$scope.projectModal.hide();
		};
		
		$scope.newProject = function (project) {
			var projectTitle = project.title;
			if (projectTitle) {
				//calling newProject method in service that utilizes angularfire $add method
				var newProject = Projects.newProject(projectTitle);
				$scope.closeNewProject();
				$ionicSideMenuDelegate.toggleLeft();
				project.title = '';
				newProject.then(function(data){
					var id = data.key();
					//setting the active project to the project we just created
					$scope.activeProject = list[$scope.projects.$indexFor(id)];
				});
				Projects.setLastActiveIndex(list.length);
				//changing state if on about page so you're not stuck there forever
				if($state.current.name !== 'app.tasks') {
					$state.go('app.tasks')
				}
			}
		};

		$scope.deleteProject = function (index) {
			Projects.deleteProject(index);
		};
		
		$scope.selectProject = function (project, index) {

			//changing state if on about page so you're not stuck there forever
			if($state.current.name !== 'app.tasks') {
				$state.go('app.tasks')
			}

			$scope.activeProject = project;
			Projects.setLastActiveIndex(index);
			$ionicSideMenuDelegate.toggleLeft();
		};
	}