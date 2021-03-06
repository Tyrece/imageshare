import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session'
import { Accounts } from 'meteor/accounts-base';

import './main.html';
import '../lib/Collections.js';

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});


Session.set('imgLimit', 3);
Session.set('userFilter', false);


lastScrollTop = 0;
$(window).scroll(function(event){
	//test if we are near the bottom of the window
	if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
	//where are we in the page?
	var scrollTop = $(this).scrollTop();
	//test if we are going down
	if (scrollTop > lastScrollTop){
		// yes we are heading down...
		Session.set('imgLimit', Session.get('imgLimit') + 3 );
		
	}
	lastScrollTop = scrollTop;
}
});

Template.myJumbo.events({

		'click .js-addImg'(event){
			console.log("hi image")
			$("#addImgModal").modal("show")
		}

	})


Template.addImg.events({
		'click .js-saveImg'(event){
			var Imgpath = $("#Imgpath").val();
			var Imgtitle = $("#Imgtitle").val();
			var Imgdescription = $("#Imgdescription").val();
			console.log("save",Imgpath,Imgtitle,Imgdescription);

			$("#Imgpath").val('');
			$("#Imgtitle").val('');
			$("#Imgdescription").val('');
			$("addImgPreview").attr('src','raceCar.jpg');
			$("#addImgModal").modal("hide");
			imagesDB.insert({"Imgpath": Imgpath, "Imgtitle": Imgtitle, 'Imgdescription': Imgdescription, "createdOn":new Date().getTime(), "postedBy":Meteor.user()._id }); 

		},

		'click .js-cancelAdd'(){
		$("#Imgtitle").val('');
		$("#ImgPath").val('');
		$("#Imgdescription").val('');
		$("#addImgPreview").attr('src','raceCar.jpg');
		$("#addImgModal").modal("hide");
	},

		'input #Imgpath'(event){
			var Imgpath = $("#Imgpath").val();
			$("#addImgPreview").attr('src', Imgpath)
		}



	});

Template.mainBody.helpers({
	imagesFound(){
		return imagesDB.find().count();
	},
	imageAge(){
		var imgCreatedOn = imagesDB.findOne({_id:this._id}).createdOn;
		imgCreatedOn = Math.round((new Date() - imgCreatedOn)/60000);
		var timeUnit = " mins";
		if (imgCreatedOn > 60){
			imgCreatedOn=Math.round(imgCreatedOn/60);
			timeUnit = " hours";
		}else if(imgCreatedOn > 1440){
			imgCreatedOn=Math.round(imgCreatedOn/1440);
			timeUnit = " days";
		}
		return imgCreatedOn + timeUnit;
	},
	allImages(){
		if(Session.get("userFilter") == false){

		var prevTime = new Date() - 15000;
		var newResults = imagesDB.find({createdOn: {$gte:prevTime}}).count();
		
		if (newResults > 0){
			//if new images are found then sort by date first then ratings
			return imagesDB.find({}, {sort: {createdOn: -1, imgRate: -1}, limit:Session.get('imgLimit')});
		}else{
			//else sort ratings by date
			return imagesDB.find({}, {sort: {imgRate: -1, createdOn: -1}, limit:Session.get('imgLimit')});
		}
	}else{
		return imagesDB.find({postedBy:Session.get("userFilter")}, {sort: {imgRate: -1, createdOn: -1}, limit:Session.get('imgLimit')});;
	}

		// console.log(newResults, "new images", prevTime)
		// return imagesDB.find({}, {sort: {imgRate: -1, createdOn:1}, limit:2});

	},

	username(){
		var uId = imagesDB.findOne({_id:this._id}).postedBy;
		return Meteor.users.findOne({_id:uId}).username;
	},




	userId(){
		return uId = imagesDB.findOne({_id:this._id}).postedBy;
	},
});


Template.mainBody.events({

	'click .js-deleteImg'(){  
		var imgID = this._id
		$("#"+imgID).fadeOut('slow',function(){
			imagesDB.remove({_id:imgID});
		console.log ("delete",imgID)
		});
	},	



	'click .js-editImage'(){
		var imgId = this._id;
		$('#ImgPreview').attr('src',imagesDB.findOne({_id:imgId}).path);
		$("#eimgtitle").val(imagesDB.findOne({_id:imgId}).title);
		$("#eimgPath").val(imagesDB.findOne({_id:imgId}).path);
		$("#eimgdescription").val(imagesDB.findOne({_id:imgId}).desc);
		$('#eId').val(imagesDB.findOne({_id:imgId})._id);
		$('#editImgModal').modal("show");
	},

	'click .js-viewImg'(){ 
		var imgId = this._id;
		$('#ImgPreview').attr('src',imagesDB.findOne({_id:imgId}).path);
		
		$("#eimgPath").val(imagesDB.findOne({_id:imgId}).path);
		
		
		$('#viewImgModal').modal("show");
	},

	'click .js-rate'(event){
		
		var imgId = this.data_id;
		var rating = $(event.currentTarget).data('userrating');
		//console.log ("you clicked a star", imgId, "with a rating of", rating);
		imagesDB.update({_id:imgId}, {$set:{"imgRate" : rating}}); 
	},
	'click .js-showUser'(event){
		event.preventDefault();
		Session.set("userFilter", event.currentTarget.id);
	}
});


Template.editImg.events({
	'click .js-updateImg'(){
		var eId = $('#eId').val();
		var Imgtitle = $("#eimgTitle").val();
		var Imgpath = $("#eimgPath").val();
		var Imgdescription = $("#eimgDesc").val(); 

		$("#eimgTitle").val('');
		$("#eimgPath").val('');
		$("#eimgDesc").val('');


		imagesDB.update({_id:eId}, {$set:{"Imgtitle":Imgtitle, "Imgpath":Imgpath, "Imgdescription":Imgdescription}});
		$('#editImgModal').modal("hide");
	}
});


Template.viewImg.helpers({

	username(){
		var uId = imagesDB.findOne({_id:this._id}).postedBy;
		return Meteor.users.findOne({_id:uId}).username;
	},




	userId(){
		return uId = imagesDB.findOne({_id:this._id}).postedBy;
	},
})






