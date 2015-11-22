	angular
		.module('todoApp')
		.controller('ToDoController', ToDoController);

	ToDoController.$inject = ['$scope', 'Projects', '$ionicModal', '$firebaseArray', 'FireBaseUrl'];
	function ToDoController($scope, Projects, $ionicModal, $firebaseArray, FireBaseUrl) {
		
		// Create our modal
		$ionicModal.fromTemplateUrl('templates/new-task.html', function(modal) {
			$scope.taskModal = modal;
		}, {
			scope: $scope
		});

		$scope.newTask = function () {
			console.log('ToDoController.newTask');
			$scope.taskModal.show();
		};
	
		$scope.closeNewTask = function () {
			console.log('ToDoController.closeNewTask');
			$scope.taskModal.hide();
		}
		
		$scope.createTask = function (task) {

			console.log('active project: ', $scope.activeProject);

			//setting firebase reference to match that of current project's tasks
			var ref = new Firebase(FireBaseUrl + $scope.activeProject.$id + '/tasks');
     		var obj = $firebaseArray(ref);

			//adding a new task
			obj.$add(task).then(function(ref) {
			  console.log('task added!')
			}, function(error) {
			  console.log("Error:", error);
			});

			$scope.taskModal.hide();
		}
	}