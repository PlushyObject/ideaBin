var app = angular.module('ideaBin.pullRequestControllers', []);

app.controller("pullRequestIndexController", ['$scope', '$localStorage', 'PullRequest', '$location', '$http', '$rootScope',
	function($scope, $localStorage, PullRequest, $location, $http, $rootScope) {
		$scope.$storage = $localStorage;
		$scope.pullRequests = PullRequest.query();
		
  	$scope.deletePullRequest =  function(pullRequest){
			PullRequest.delete({id: pullRequest.id});
			var index = $scope.pullRequests.indexOf(pullRequest);
			$scope.pullRequests.splice(index, 1);
		}
		
		$scope.createNewPullRequest = function(){
			PullRequest.create();
			$location.path('/pullRequests');
		};
		
		$scope.editPullRequest = function (pullRequestId) {
			$localStorage.current_pullRequest  = PullRequest.show({id: pullRequestId}).$promise;
			$localStorage.current_pullRequest.then(function onSuccess(	response){
				$localStorage.current_pullRequest = response;
				$rootScope.$broadcast("loadTopDirectory", $localStorage.current_pullRequest.id )
			},
			function onFail(response) {
					// handle failure
			});

			$location.path('/pullRequests/'+pullRequestId);
		}
		
		$scope.showNewPullRequest = function(){
			$scope.isCreatePullRequestPanelVisible = true;
		}
	
		$scope.$on('showMyPullRequests', function(event, userId){
			$scope.showUserPullRequests(userId);
		});
		
		$scope.$on('showAddPullRequest', function(event, data){
			$scope.showNewPullRequest();
		});
		
		$scope.$on('showAllPullRequests', function(event, data){
			$scope.pullRequests = PullRequest.query();
		});
		
		$scope.$on('addPullRequestToList', function(event, data){
			$scope.pullRequests.push(data);
		});
		
		$scope.showUserPullRequests = function(userId){
			$http.get("/userPullRequests/" + userId+".json")
				.success(function(data){ 
					$scope.pullRequests = data;
				})
				.error(function(data){
					alert(data.errors);
				});
		}
		
		$scope.$on('hideCreatePullRequestPanel', function(event, data) {
			$scope.isCreatePullRequestPanelVisible = false;
		});
}]);

app.controller('PullRequestDetailCtrl', ['$scope', '$localStorage', '$routeParams', 'PullRequest', '$location', '$upload', '$rootScope',
	function($scope, $localStorage, $routeParams, PullRequest, $location, $upload, $rootScope){
		$scope.$storage = $localStorage;
		$scope.pullRequest = PullRequest.show({id: $routeParams.id});
		$rootScope.pullRequestEditPanelVisible = false;

		$scope.updatePullRequest = function (pullRequestId){
			PullRequest.update($scope.pullRequest,{id: pullRequestId}, function(){
					
			});
		}
		
		$scope.showPullRequestEditPanel = function() {
			$rootScope.pullRequestEditPanelVisible = true;
		}
		
		$scope.hidePullRequestEditPanel = function() {
			$rootScope.pullRequestEditPanelVisible = false;
		}
		
		$scope.cancel = function(){
			$location.path('/pullRequests');
		}
		
		$scope.showNewPullRequest = function(){
			$rootScope.isCreatePullRequestPanelVisible = true;
		}
		
		$scope.showNewDirectoryPanel = function(){
			$('#directoryForm').slideToggle().delay(100);
		}
	}
]);

app.controller('PullRequestCreationCtrl', ['$scope', '$rootScope', 'PullRequest', '$location', '$upload',
	function($scope, $rootScope, PullRequest, $location, $upload ){
		//callback for ng-click 'createNewPullRequest'
		$scope.pullRequestForm = {};
		$scope.pullRequestForm.name = "";
		$scope.pullRequestForm.description = "";
		$scope.pullRequestForm.cover_img_file_name = "no-image-found.png";

		$scope.createNewPullRequest = function(){
			PullRequest.create($scope.pullRequestForm, function(){
				alert("Successfully posted pullRequest");
			});
		}
		
		$scope.previewImage = function(files){
			var reader = new FileReader();
			reader.readAsDataURL(files[0]);
			reader.onload = function(event){
				$('#pullRequestCreationImage').attr('src', reader.result);
				$scope.pullRequestForm.cover_img = files[0];
			}
		}
		
		$scope.hideCreatePullRequestPanel = function(){
			$rootScope.$broadcast('hideCreatePullRequestPanel');
		}
	}
]);