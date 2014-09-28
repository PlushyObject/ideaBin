

$.ajaxSetup({
  headers: {
    'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
  }
});

Dropzone.options.myDropzone = {
  init: function() {
    this.on("addedfile", function(file){
      var comment =  prompt("Please enter comment");
      $("#resourceComment").val(comment);
    });
    this.on("sending",function(file, xhr, formData){

    });
    this.on("complete", function(file) { 
      $('form.edit_idea > input#alteredStatus').val('1');
    });
  }
};

$(window).ready(function(){

  var $container = $("#masonry");
  $container.imagesLoaded(function(){
    $container.masonry({
      columnWidth: 200,
      itemSelector: '.item'
    });
  });
});

//var app = angular.module("ideaBin", ['ngResource', 'ngRoute']);
