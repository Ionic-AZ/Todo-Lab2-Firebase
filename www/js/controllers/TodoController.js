angular
	.module('todoApp')
	.controller('ToDoController', ToDoController);

ToDoController.$inject = ['$scope', 'Projects', '$ionicModal', '$firebaseArray', 'FireBaseUrl'];
function ToDoController($scope, Projects, $ionicModal, $firebaseArray, FireBaseUrl) {

	// Create our modal
	$ionicModal.fromTemplateUrl('templates/new-task.html', function (modal) {
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
		$scope.showLoading();
		Projects.newTask(task, $scope.activeProject.$id);

		task.title = '';

		$scope.hideLoading();
		$scope.taskModal.hide();
	}

	$scope.completeTask = function (task, taskKey) {
		console.log('task', task);
		var projectId = $scope.activeProject.$id;
		Projects.completeTask(task, projectId, taskKey);
	};

	$scope.deleteTask = function (taskKey) {
		Projects.deleteTask($scope.activeProject.$id, taskKey);
	}
}