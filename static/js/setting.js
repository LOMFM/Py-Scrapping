(function($){
	$(document).ready( function(){ 
		let is_page_D = document.getElementById("is_page");

		$("#site-list").change(function(){
			let site = $(this).val();
			switch( site ){
				case "http://canadawheels.ca/":
					// set based URL
					$("#site").val("https://www.canadawheels.ca/");
					$("#param_form").val("https://www.canadawheels.ca/tirebrandrefine.php?brand={category}&page={page_number}")
					// Set Pagination Setting
					is_page_D.checked = true;
					$("#page_identy").val(".pagenate ul li a");
					// Set scrap object setting
					$("#object_identy").val(".td-brand .tire-new-brand > a");
					$("#object_attr").val("href");
					break;
				case "https://pmctire.com/":
					$("#site").val("https://pmctire.com/en/");
					$("#param_form").val("https://pmctire.com/en/tires/page/{page_number}/show/100.tire");
					// Set Pagination Setting
					is_page_D.checked = false;
					$(".param_form1_wrapper").css("display", "block");
					$("#param_form1").val("https://pmctire.com/en/tires/show/100.tire")
					$("#page_identy").val(".pages ol li");
					// Set scrap object setting
					$("#object_identy").val(".product-name a");
					$("#object_attr").val("href");
					break;
				case "https://www.justtires.com/":
					
					break;
				default:
					console.log( site );
					break;
			}
		})


		$("#is_page").change( function(){
			if( is_page_D.checked ){
				$(this).val("on");
				$(".param_form1_wrapper").css("display", "none");
			}
			else{
				$(this).val("off");
				$(".param_form1_wrapper").css("display", "block");
			}
		} );



	});
})(jQuery);