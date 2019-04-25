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
                              <td class="url_action"><a class="btn btn-primary scrap">Scrap</a></td>`

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

		$(".url-table").on("click", ".scrap", function(){
			let token = $("[name=csrfmiddlewaretoken]").val();
			let data = {};
			if( request_url == "info" ){

			}
			else{
				data = {
					identy : $("#link_identy").val(),
					attr : $("#link_attr").val(),
					url : $(this).closest("tr").find(".url_addr").text(),
					base_url : $("#base_url").val()
				}
			}
			$.ajax({
				"type" : "POST",
			    "beforeSend" : function(xhr, settings) {
			        xhr.setRequestHeader("X-CSRFToken", token);
			    },
			    "data" : data,
			    "Content-Type" : 'application/json',
			    url: "/" + request_url,
			    success: function(msg) {
				   console.log( msg )
				  }

			});
		})

		$(".url-table").on("click", ".scrap_all", function(){
			let dom = $(".url-table tbody tr:first-child");
			allScrap( dom );
		})

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
				    	let res = response.data;
					   	if( $(".info-table tr.schema").length == 0 ){
					   		let schemas = [];
					   		for( schema_key in res ){
					   			schemas.push( schema_key );
					   		}
					   		generateRow(schemas, "schema");
					   	}
					   	let vals = [];
					   	for( schema_key in res ){
					   		vals.push( res[schema_key] );
					   	}
					   	generateRow(vals);
					   	if( dom.hasClass="completed" ){
					   		dom.removeClass("completed");
					   	}
					   	else{
					   		dom.addClass("completed");
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