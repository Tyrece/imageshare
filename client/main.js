import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

import '../lib/Collections.js';

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
			imagesDB.insert({"Imgpath": Imgpath, "Imgtitle": Imgtitle, 'Imgdescription': Imgdescription, "created":Date() }) 

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
	allImages(){
		return imagesDB.find();
	},
});


Template.mainBody.events({

	'click .js-deleteImg'(){  
		var imgID = this._id
		$("#"+imgID).fadeOut('slow',function(){
			imagesDB.remove({_id:imgID});
		//console.log ("delete",imgID)
		});
	},	



	'click .js-editImage'(){
		var imgId = this._id;
		$('#ImgPreview').attr('src',imagesDB.findOne({_id:imgId}).path);
		$("#eimgTitle").val(imagesDB.findOne({_id:imgId}).title);
		$("#eimgPath").val(imagesDB.findOne({_id:imgId}).path);
		$("#eimgDesc").val(imagesDB.findOne({_id:imgId}).desc);
		$('#eId').val(imagesDB.findOne({_id:imgId})._id);
		$('#editImgModal').modal("show");
	}
});


Template.editImg.events({
	'click .js-updateImg'(){
		var eId = $('#eId').val();
		var Imgtitle = $("#eimgTitle").val();
		var Imgpath = $("#eimgPath").val();
		var Imgdescription= $("#eimgDesc").val();
		imagesDB.update({_id:eId}, {$set:{"title":imgTitle, "path":imgPath, "desc":imgDesc}});
		$('#editImgModal').modal("hide");
	}
}); 


