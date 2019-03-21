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
			$("#addImgModal").modal("hide");
			
		},
		'change #Imgpath'(event){
			var Imgpath = $("#Imgpath").val();
			$("#addImgPreview").attr('src', Imgpath)
		}
});