(function($){
	$(document).ready( function(){ 
		let request_D = document.getElementById("scrap_request");
		let request_url = "link";

		let info_property = `<td>
                                       <input type="text" class="form-control object_identy" name="object_identy[]" placeholder="div.product a" >
                                    </td>
                                    <td>
                                       <input type="text" class="form-control object_attr" name="object_attr[]" placeholder="href" >
                                    </td>
                                    <td>
                                       <input type="text" class="form-control object_label" name="object_label[]" placeholder="name" >
                                    </td>
                                    <td>
                                    	<a class="btn btn-primary remove-item">Remove</a>
                                    </td>`;

        let link_text = `<td class="url_addr">{link}</td>
                              <td class="url_action"><a class="btn btn-primary scrap">Scrap</a><a class="btn btn-primary scrap_from">From</a></td>`

		$("#scrap_request").change( function(){
			if( request_D.checked ){
				request_url = "info";
				$(".link-scrap").css("display", "none");
				$(".info-scrap").css("display", "block");
			}
			else{
				request_url = "link";
				$(".info-scrap").css("display", "none");
				$(".link-scrap").css("display", "block");
			}
		} )

		$(".add-info").click( function() {
			let proxy = $("<tr></tr>");
			proxy.html(info_property);
			$(".info-properties").append(proxy);
		})

		$(".info-properties").on("click", ".remove-item", function() {
			$(this).closest("tr").remove();
		});

		$(".url-table").on("click", ".scrap_all", function(){
			let dom = $(".url-table tbody tr:first-child");
			allScrap( dom );
		})

		$(".url-table").on("click", ".scrap", function(){
			let dom = $(this).closest("tr")
			scrap(dom)
		})

		function scrap(dom){
			let token = $("[name=csrfmiddlewaretoken]").val();
			let data = {};
			if( request_url == "info" ){
				let identies = [];
				let attrs = [];
				let labels = [];
				document.querySelectorAll(".object_identy").forEach( e => {
					identies.push( e.value );
				});
				document.querySelectorAll(".object_attr").forEach( e => {
					attrs.push( e.value );
				})
				document.querySelectorAll(".object_label").forEach( e => {
					labels.push( e.value );
				})
				data = {
					identies : identies,
					attrs : attrs,
					labels : labels,
					url : dom.find(".url_addr").text(),
					base_url : $("#base_url").val()
				}
				$.ajax({
					"type" : "POST",
				    "beforeSend" : function(xhr, settings) {
				        xhr.setRequestHeader("X-CSRFToken", token);
				    },
				    "data" : data,
				    "Content-Type" : 'application/json',
				    url: "/" + request_url,
				    success: function(response) {
				    	if ( response.status == "True" ){
				    		let res = response.data;
						   	if( $(".info-table tr.schema").length == 0 ){
						   		let schemas = [];
						   		for( schema_key in res ){
						   			schemas.push( schema_key );
						   		}
						   		schemas.push("url");
						   		generateRow(schemas, "schema");
						   	}
						   	let vals = [];
						   	for( schema_key in res ){
						   		vals.push( res[schema_key] );
						   	}
						   	vals.push(data.url);
						   	generateRow(vals);
						   	if( dom.hasClass("completed") ){
						   		dom.removeClass("completed");
						   	}
						   	else{
						   		dom.addClass("completed");
						   	}	
						   	dom.removeClass("warning");
				    	}
				    	else{
				    		if( dom.hasClass("completed") ){
						   		dom.removeClass("completed");
						   	}
						   	else{
						   		dom.addClass("completed");
						   	}
						   	dom.addClass("warning");
				    	}
					}
				})
			}
			else{
				data = {
					identy : $("#link_identy").val(),
					attr : $("#link_attr").val(),
					url : dom.find(".url_addr").text(),
					base_url : $("#base_url").val()
				}
				$.ajax({
					"type" : "POST",
				    "beforeSend" : function(xhr, settings) {
				        xhr.setRequestHeader("X-CSRFToken", token);
				    },
				    "data" : data,
				    "Content-Type" : 'application/json',
				    url: "/" + request_url,
				    success: function(response) {
					   replaceLinks(response.links, dom);
					}
				});
			}	
		}

		function allScrap( dom ){
			if( dom.length == 0 ){
				return true;
			}
			nextdom = dom.next();
			let token = $("[name=csrfmiddlewaretoken]").val();
			let data = {};
			if( request_url == "info" ){
				let identies = [];
				let attrs = [];
				let labels = [];
				document.querySelectorAll(".object_identy").forEach( e => {
					identies.push( e.value );
				});
				document.querySelectorAll(".object_attr").forEach( e => {
					attrs.push( e.value );
				})
				document.querySelectorAll(".object_label").forEach( e => {
					labels.push( e.value );
				})
				data = {
					identies : identies,
					attrs : attrs,
					labels : labels,
					url : dom.find(".url_addr").text(),
					base_url : $("#base_url").val()
				}
				$.ajax({
					"type" : "POST",
				    "beforeSend" : function(xhr, settings) {
				        xhr.setRequestHeader("X-CSRFToken", token);
				    },
				    "data" : data,
				    "Content-Type" : 'application/json',
				    url: "/" + request_url,
				    success: function(response) {
				    	if ( response.status == "True" ){
				    		let res = response.data;
						   	if( $(".info-table tr.schema").length == 0 ){
						   		let schemas = [];
						   		for( schema_key in res ){
						   			schemas.push( schema_key );
						   		}
						   		schemas.push("url");
						   		generateRow(schemas, "schema");
						   	}
						   	let vals = [];
						   	for( schema_key in res ){
						   		vals.push( res[schema_key] );
						   	}
						   	vals.push(data.url)
						   	generateRow(vals);
						   	if( dom.hasClass("completed") ){
						   		dom.removeClass("completed");
						   	}
						   	else{
						   		dom.addClass("completed");
						   	}
						   	dom.removeClass("warning")
				    	}
				    	else{
				    		if( dom.hasClass("completed") ){
						   		dom.removeClass("completed");
						   	}
						   	else{
						   		dom.addClass("completed");
						   	}
						   	dom.addClass("warning");
				    	}
				    	
					   	allScrap(nextdom);
					}
				})
			}
			else{
				data = {
					identy : $("#link_identy").val(),
					attr : $("#link_attr").val(),
					url : dom.find(".url_addr").text(),
					base_url : $("#base_url").val()
				}
				$.ajax({
					"type" : "POST",
				    "beforeSend" : function(xhr, settings) {
				        xhr.setRequestHeader("X-CSRFToken", token);
				    },
				    "data" : data,
				    "Content-Type" : 'application/json',
				    url: "/" + request_url,
				    success: function(response) {
					   replaceLinks(response.links, dom);
					   allScrap(nextdom);
					}
				});
			}			
		}

		$('.info-export').click( function(){
			export_table_to_csv(".info-table", "table.csv");
		})

		function replaceLinks( links, dom ){
			for( let i = 0 ; i < links.length ; i++ ){
				html = link_text.replace("{link}", links[i]);
				let row = $("<tr></tr>");
				row.html(html);
				if( !dom.hasClass("completed") ){
					row.addClass("completed");
				}
				row.insertAfter(dom);
			}
			dom.remove();
		}

		let site = $("#base_url").val();
		if( info_fields[site] != undefined ){
			fields = info_fields[site];
			for( let i = 1 ; i <= fields.length ; i++ ){
				if( $(".info-properties tr:nth-of-type(" + i + ")" ).length == 0 ){
					$(".add-info").click();
				}
				let row = $(".info-properties tr:nth-of-type(" + i + ")" );
				row.find(".object_identy").val(fields[i-1]["identy"]);
				row.find(".object_attr").val(fields[i-1]["attr"]);
				row.find(".object_label").val(fields[i-1]["label"]);
			}
		}

		switch(site){
			case "https://pmctire.com/en/":
				$("#link_identy").val(".product-name a");
				break;
			case "https://www.canadawheels.ca/":
				$("#link_identy").val(".availability_table a");
				break;

		}


		function generateRow( data, className = false ){
			let rowHtml = "";
			for( let i = 0 ; i < data.length ; i++ ){
				rowHtml = rowHtml + "<td>" + data[i] + "</td>";
			}
			let rowDom = $("<tr></tr>");
			rowDom.html(rowHtml);
			if( className ){
				rowDom.addClass(className);
			}
			$(".info-table tbody").append(rowDom);
		}

		$(".setting-load-btn").click( function(){
			$("#setting-load").click()
		} )

		$(".link-load-btn").click( function(){
			$("#link-load").click()
		} )

		$("#setting-load").change(function(){
			var file = $(this)[0].files[0];
			var reader = new FileReader();
			reader.onload = function(e) {
  				var text = reader.result;

  				var allTextLines = text.split(/\r\n|\n/);
  				var headers = allTextLines[0].split(',');
  				var lines = [];
  				for (var i=1; i<allTextLines.length; i++) {
			        var data = allTextLines[i].split(',');
			        if (data.length == headers.length) {
			            var tarr = {};
			            for (var j=0; j<headers.length; j++) {
			                tarr[headers[j]] = data[j];
			            }
			            lines.push(tarr);
			        }
			    }
			    $(".info-properties").html("");
			    for( var i = 1 ; i <= lines.length ; i++ ){
			    	if( $(".info-properties tr:nth-of-type(" + i + ")" ).length == 0 ){
						$(".add-info").click();
					}
					let row = $(".info-properties tr:nth-of-type(" + i + ")" );
					row.find(".object_identy").val(lines[i-1]["identy"]);
					row.find(".object_attr").val(lines[i-1]["attr"]);
					row.find(".object_label").val(lines[i-1]["label"]);
			    }
			}

			reader.readAsText(file);
		})



		$("#import-link-file").change( function(){
			var file = $(this)[0].files[0];
			reader = new FileReader()
			reader.onload = function(e) {
  				var text = reader.result;
  				var allTextLines = text.split(/\r\n|\n/);
  				var headers = allTextLines[0].split(',');
  				var links = [];
  				$(".url-table tbody").html("");
  				if( headers[0] = "link"){
  					for (var i=1; i<allTextLines.length; i++) {
				        var data = allTextLines[i].split(',');
				        links.push( data[0] );
				    }	
  				}
  				for( let i = 0 ; i < links.length ; i++ ){
  					let row = $("<tr></tr>");
  					let html = '<td class="url_addr">' + links[i] + '</td><td class="url_action"><a class="btn btn-primary scrap">Scrap</a><a class="btn btn-primary scrap_from">From</a></td>'
  					row.html(html);
  					$(".url-table tbody").append(row);
  				}
			}
			reader.readAsText(file);
		} )

		$(".import_links").click( function(){
			$("#import-link-file").click();
		} )

		$(".export_links").click( function(){
			var csv = ["link"];
			var rows = document.querySelectorAll(".url-table tbody tr");
			for ( var i = 0 ; i < rows.length ; i++ ){
				var link = rows[i].querySelector(".url_addr");
				csv.push(link.innerText)
			}
			download_csv(csv.join('\n'), "links.csv")
		} )

		$(".clear-infos").click( function(){
			document.querySelector(".info-table tbody").innerHTML = "";
		} )

		$(".remove-completed").click(function(){
			document.querySelectorAll(".url-table tbody tr:not(.warning)").forEach( e => e.remove() )
		})

		// $(".scrap_from").click(function(){
		// 	let dom = $(this).closest("tr");
		// 	allScrap( dom );
		// })
		$(".url-table").on("click", ".scrap_from", function(){
			let dom = $(this).closest("tr");
			allScrap( dom );
		})
	});
})(jQuery);



function download_csv(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV FILE
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Make sure that the link is not displayed
    downloadLink.style.display = "none";

    // Add the link to your DOM
    document.body.appendChild(downloadLink);

    // Lanzamos
    downloadLink.click();
}

function export_table_to_csv(table, filename) {
	var csv = [];
	var rows = document.querySelectorAll(table + " tbody tr");
	
    for (var i = 0; i < rows.length; i++) {
		var row = [], cols = rows[i].querySelectorAll("td, th");
		
        for (var j = 0; j < cols.length; j++) 
            row.push(cols[j].innerText);
        
		csv.push(row.join(","));		
	}

    // Download CSV
    download_csv(csv.join("\n"), filename);
}