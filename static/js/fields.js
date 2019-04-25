var info_fields = {
	"https://www.canadawheels.ca/" : [
		{ identy: ".product_heading h2", attr: "text", label: "title"},
		{ identy: ".product_details p:nth-of-type(1) span", attr: "text", label: "sku"},
		{ identy: ".product_details p:nth-of-type(2) span", attr: "text", label: "size"},
		{ identy: ".product_details p:nth-of-type(3) span", attr: "text", label: "sidewall_style"},
		{ identy: ".product_details p:nth-of-type(4) span", attr: "text", label: "load_index"},
		{ identy: ".product_details p:nth-of-type(5) span", attr: "text", label: "speed_rating"},
		{ identy: ".product_details p:nth-of-type(6) span", attr: "text", label: "utqg"},
		{ identy: ".product_details p:nth-of-type(7) span", attr: "text", label: "availability"},
		{ identy: "#specs h5:nth-of-type(1) span", attr: "text", label: "manufacturer"},
		{ identy: "#specs h5:nth-of-type(2) span", attr: "text", label: "category"},
		{ identy: ".ZoomerImg", attr: "src", label: "image"},
	],
	"https://pmctire.com/en/" : [
		{ identy: ".product-image-main img", attr: "src", label: "image"},
		{ identy: ".product-name", attr: "text", label: "title"},
		{ identy: ".special-price .price", attr: "text", label: "price"},
		{ identy: ".old-price .price", attr: "text", label: "old_price"},
		{ identy: "#product-attribute-specs-table tbody tr:nth-of-type(2) td", attr: "text", label: "sku"},
		{ identy: "#product-attribute-specs-table tbody tr:nth-of-type(4) td", attr: "text", label: "manufacturer"}
	]
}