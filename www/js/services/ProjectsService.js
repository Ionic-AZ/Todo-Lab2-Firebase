	angular
		.module('todoApp')
		.factory('Projects', Projects);

	Projects.$inject = ['$firebaseArray'];
	function Projects($firebaseArray) {

		var service = {
			all: all,
			newProject: newProject,
			getLastActiveIndex: getLastActiveIndex,
			setLastActiveIndex: setLastActiveIndex,
			deleteProject: deleteProject
		};
		
		var globalProjects = [];

		//set reference to firebase DB
		var ref = new Firebase("https://ionic-todo-az.firebaseio.com");

		//set projects equal to Firebase DB transformed to array (this will stay in sync with DB)
		var globalProjects = $firebaseArray(ref);
		
		return service;

		function all() {
			return globalProjects;
		}
		
		function deleteProject(index) {

			//single out project in project list
			var item = globalProjects[index];
			globalProjects.$remove(item).then(function(ref) {
			  console.log('project successfully deleted: ', ref);
			});

		}

		function newProject(projectTitle) {
			//use angularfire $add method to create new record
		    return globalProjects.$add({
				title: projectTitle,
				tasks: [{
					title : 'My First Task'
				}]
			});
		
		}
		
		function getLastActiveIndex() {
			console.log("Projects.getLastActiveIndex");
			return parseInt(window.localStorage['lastActiveProject']) || 0;
		}
		
		function setLastActiveIndex(index) {
			console.log("Projects.setLastActiveIndex");
			window.localStorage['lastActiveProject'] = index;
		}
		
	}