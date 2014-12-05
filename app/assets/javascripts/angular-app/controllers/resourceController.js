var app = angular.module('ideaBin.resourceControllers', []);

app.controller("ResourceIndexCtrl", ['$scope', '$localStorage', '$rootScope', '$routeParams', 'Resource', '$location', '$upload',
	function($scope, $localStorage, $rootScope, $routeParams, Resource, $location, $upload) {
		$scope.$storage = $localStorage;
		$scope.resources = Resource.query({id: $scope.$storage.current_idea.id});

		$scope.showResource = function(ideaId){
			$scope.resources = Resource.query();
			$location.path('/resources');
		}
		
  	$scope.deleteResource =  function(resourceId){
			Resource.delete({id: resourceId});
			$scope.resources = Resource.query();
		}
		
		$scope.createNewResource = function(){
			Resource.create();
			$location.path('/resources');
		};
		
		$scope.editResource = function (resourceId) {
			$location.path('/resources/'+resourceId);
		}
		
		$scope.newResource = function(){
			$location.path('/resources/new');
		}
		
		$scope.onFileSelect = function($files) {
			console.log("UPLOADING FILES" + $files);
			//$files: an array of files selected, each file has name, size, and type.
			/*for (var i = 0; i < $files.length; i++) {
				var file = $files[i];
				$scope.upload = $upload.upload({
					url: '/resources', 
					method: 'POST', // or 'PUT',
					headers: {'XSRF-TOKEN': ''},
					//withCredentials: true,
					data: {resource: $scope.resource, idea_id: $scope.$storage.current_idea.id},
					file: file, // or list of files ($files) for html5 only
					//fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
					// customize file formData name ('Content-Disposition'), server side file variable name. 
					//fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file' 
					// customize how data is added to formData. See #40#issuecomment-28612000 for sample code
					//formDataAppender: function(formData, key, val){}
				}).progress(function(evt) {
					console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
				}).success(function(data, status, headers, config) {
					// file is uploaded successfully
					console.log(data);
				});
				//.error(...)
				//.then(success, error, progress); 
				// access or attach event listeners to the underlying XMLHttpRequest.
				//.xhr(function(xhr){xhr.upload.addEventListener(...)})
			}
			*/
    /* alternative way of uploading, send the file binary with the file's content-type.
       Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
       It could also be used to monitor the progress of a normal http post/put request with large data*/
    
		// $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
		};
}]);

app.controller('ResourceDetailCtrl', ['$scope', '$routeParams', 'Resource', '$location',
	function($scope, $routeParams, Resource, $location){
		$scope.resource = Resource.show({id: $routeParams.id});
		
		$scope.updateResource = function (){
			Resource.update($scope.resource);
			$location.path('/resources');
		}
		
		$scope.cancel = function(){
			$location.path('/resources');
		}
	}
]);

app.controller('ResourceCreationCtrl', ['$scope', 'Resource', '$location',
	function($scope, Resource, $location ){
		//callback for ng-click 'createNewResourceFactory'
		$scope.resourceForm = {};
		$scope.resourceForm.name = "NAME";
		$scope.resourceForm.description = "DESCRIPTION";
		$scope.createNewResource = function(){
			console.log($scope.resourceForm)
			Resource.create($scope.resourceForm);
			$location.path('/resources');
		}
	}
]);