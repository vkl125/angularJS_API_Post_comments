// AngularJS Application Module
var app = angular.module('postsApp', []);

// Posts Controller
app.controller('PostsController', ['$scope', '$http', function($scope, $http) {
    // Configuration
    $scope.postsPerPage = 20;
    $scope.currentPage = 1;
    $scope.totalPosts = 0;
    $scope.totalPages = 0;
    $scope.loading = true;
    
    // Data storage
    $scope.allPosts = [];
    $scope.allComments = [];
    $scope.posts = [];
    
    // API base URL
    const API_BASE = 'http://localhost:3000';
    
    // Initialize the application
    $scope.init = function() {
        $scope.loadPosts();
        $scope.loadComments();
    };
    
    // Load all posts from JSON server
    $scope.loadPosts = function() {
        $http.get(API_BASE + '/posts')
            .then(function(response) {
                $scope.allPosts = response.data;
                $scope.totalPosts = $scope.allPosts.length;
                $scope.totalPages = Math.ceil($scope.totalPosts / $scope.postsPerPage);
                $scope.updateDisplayedPosts();
                $scope.loading = false;
            })
            .catch(function(error) {
                console.error('Error loading posts:', error);
                $scope.loading = false;
                alert('Error loading posts. Make sure JSON server is running on port 3000.');
            });
    };
    
    // Load all comments from JSON server
    $scope.loadComments = function() {
        $http.get(API_BASE + '/comments')
            .then(function(response) {
                $scope.allComments = response.data;
            })
            .catch(function(error) {
                console.error('Error loading comments:', error);
            });
    };
    
    // Get comments for a specific post
    $scope.getComments = function(postId) {
        return $scope.allComments.filter(function(comment) {
            return comment.postId === postId;
        });
    };
    
    // Update displayed posts based on current page
    $scope.updateDisplayedPosts = function() {
        var startIndex = ($scope.currentPage - 1) * $scope.postsPerPage;
        var endIndex = startIndex + $scope.postsPerPage;
        $scope.posts = $scope.allPosts.slice(startIndex, endIndex);
    };
    
    // Change current page
    $scope.changePage = function(page) {
        if (page >= 1 && page <= $scope.totalPages) {
            $scope.currentPage = page;
            $scope.updateDisplayedPosts();
            // Scroll to top when changing pages
            window.scrollTo(0, 0);
        }
    };
    
    // Generate page numbers for pagination
    $scope.getPageNumbers = function() {
        var pages = [];
        var maxVisiblePages = 5;
        var startPage, endPage;
        
        if ($scope.totalPages <= maxVisiblePages) {
            // Show all pages if total pages is less than max visible
            startPage = 1;
            endPage = $scope.totalPages;
        } else {
            // Calculate start and end pages
            if ($scope.currentPage <= Math.ceil(maxVisiblePages / 2)) {
                startPage = 1;
                endPage = maxVisiblePages;
            } else if ($scope.currentPage + Math.floor(maxVisiblePages / 2) >= $scope.totalPages) {
                startPage = $scope.totalPages - maxVisiblePages + 1;
                endPage = $scope.totalPages;
            } else {
                startPage = $scope.currentPage - Math.floor(maxVisiblePages / 2);
                endPage = $scope.currentPage + Math.floor(maxVisiblePages / 2);
            }
        }
        
        for (var i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        
        return pages;
    };
    
    // Initialize the application
    $scope.init();
}]);