	angular
		.module('todoApp')
		.factory('Projects', Projects);

	Projects.$inject = ['$firebaseArray','FireBaseUrl'];
	function Projects($firebaseArray, FireBaseUrl) {

		//set reference to firebase DB
		var projectRef = new Firebase(FireBaseUrl);


		//set projects equal to Firebase DB transformed to array (this will stay in sync with DB)
		var globalProjects = $firebaseArray(projectRef);

		var service = {
			all: all,
			newProject: newProject,
			getLastActiveIndex: getLastActiveIndex,
			setLastActiveIndex: setLastActiveIndex,
			deleteProject: deleteProject,
			newTask: newTask
		};
		
		return service;

		function all() {
			return globalProjects;
		}
		
		function deleteProject(index) {
			var item = globalProjects[index];
			globalProjects.$remove(item).then(function(ref) {
			  console.log('project successfully deleted: ', ref);
			});

		}

		function newProject(project) {
		    return globalProjects.$add({
				title: project.title,
				tasks: [{
					title: 'My First Task',
					completed: false
				}]
			});
		
		}
		
		function getLastActiveIndex() {
			console.log("Projects.getLastActiveIndex");
			return window.localStorage['lastActiveProject'] || '';
		}
		
		function setLastActiveIndex(key) {
			console.log("Projects.setLastActiveIndex");
			window.localStorage['lastActiveProject'] = key;
		}

		function newTask(task, projectId) {
			console.log('active project: ', globalProjects);

			var ref = globalProjects.$ref();
			console.log('ref', ref);

			var project = ref.child(projectId);
			console.log('child', project);

			var tasks = project.child('tasks');
			console.log('tasks', tasks);

			tasks.push({ title: task.title, completed: false });
		}
		
	}