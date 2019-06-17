from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
import urllib.request
import urllib.parse 
from bs4 import BeautifulSoup
import re
# Create your views here.

def index(request):
	return render( request, "settings.html" )

def handle(request):
	if request.method == 'POST':
		data = request.POST.copy()
		base_url = data.get('base_url')
		param_form = data.get('param_form')
		param_form1 = data.get('param_form1')	
		is_page = data.get('is_page');
		page_identy = data.get('page_id')
		scrap_identy = data.get('object_identy')	

		parent_products_links = []
		cat_values = data.get('cat_values').replace(" ", "");
		if cat_values != "":
			categories = cat_values.split(",");
			for category in categories:
				cat_req = param_form.replace("{category}", category)
				page_number = 1;
				last_page = 10;
				while page_number <= last_page:
					if  is_page != "on" and page_number == 1:
						req = param_form1.replace("{category}", category)
					else:
						page_str = str(page_number)
						req = cat_req.replace("{page_number}", page_str)
					try:
						with urllib.request.urlopen( req ) as response:
							response_text = response.read()
							soup = BeautifulSoup(response_text, 'html.parser')
							product_els = soup.select( scrap_identy )
							for product_el in product_els:
								parent_products_links.append(getLink(base_url, param_form, product_el["href"]) )
							page_elems = soup.select(page_identy)
							while len(page_elems)!=0:
								last_page_el = page_elems.pop()
								if bool(re.match('^[0-9]+$', last_page_el.text)):
									last_page_temp = int(last_page_el.text)
									break
								else:
									last_page_temp = 0
							last_page = last_page_temp
							print(category, last_page)
					except Exception:
						return render( request, 'settings.html', {"error" : "There are some errors in the scrapping. Please retry with new category and pagination"})
					page_number += 1
		else:
			page_number = 1;
			last_page = 10;
			while page_number <= last_page:
				if  is_page != "on" and page_number == 1:
					req = param_form1
				else:
					page_str = str(page_number)
					req = param_form.replace("{page_number}", page_str)
				try:
					with urllib.request.urlopen( req ) as response:
						response_text = response.read()
						soup = BeautifulSoup(response_text, 'html.parser')
						product_els = soup.select( scrap_identy )
						for product_el in product_els:
							parent_products_links.append(getLink(base_url, param_form, product_el["href"]) )
						page_elems = soup.select(page_identy)
						while len(page_elems)!=0:
							last_page_el = page_elems.pop()
							if bool(re.match('^[0-9]+$', last_page_el.text)):
								last_page_temp = int(last_page_el.text)
								break
							else:
								last_page_temp = 0
						last_page = last_page_temp
						print(last_page)
				except Exception:
					return render( request, 'settings.html', {"error" : "There are some errors in the scrapping. Please retry with new category and pagination"})
						# last_page = int( last_page_el.text )
				page_number += 1
		return render( request, "result.html", {"urls": parent_products_links, "base_url": base_url } )
	else:
		return render( request, "result.html" )

def linkScrap(request):
	if request.method == "POST":
		base_url = request.POST["base_url"]
		url = request.POST["url"]
		link_identy = request.POST["identy"]
		link_attr = request.POST['attr']
		links = []
		# try:
		with urllib.request.urlopen( url ) as response:
			response_text = response.read()
			soup = BeautifulSoup(response_text, 'html.parser')
			link_els = soup.select( link_identy )
			for link_el in link_els:
				if 'href' in link_el.attrs:
					link = getLink(base_url, url, link_el["href"])
					if link not in links:
						links.append(link)
		
			# return JsonResponse( { 'status' : 'False'} )
		res = {
			'links' : links,
			'status' : 'True'
		}
		return JsonResponse(res)
	else:
		response = {
			'method' : 'GET',
			'status' : 'False'
		}
		return JsonResponse(response)


def infoScrap(request):
	if request.method == "POST":
		identies = request.POST.getlist("identies[]")
		attrs = request.POST.getlist("attrs[]")
		labels = request.POST.getlist("labels[]")
		url = request.POST["url"]
		res = {}
		try:
			with urllib.request.urlopen( url ) as response:
				response_text = response.read()
				soup = BeautifulSoup(response_text, 'html.parser')
				for index in range(len(identies)):
					identy = identies[index]
					attr = attrs[index]
					label = labels[index]
					try:
						obj = soup.select_one(identy)
						if attr == 'text':
							res[label] = obj.text.strip()
						elif attr in obj.attrs:
							res[label] = obj[attr].strip()
					except Exception:
						res[label]=""
		except Exception:
			return JsonResponse({'status' : 'False'})
		return JsonResponse({'status': 'True', 'data': res})
	else:		
		return JsonResponse({'method': "Get"})

def getLink( base_url, current_url, link ):

	if "http:" in link:
		result = link
	elif "https:" in link:
		result = link
	elif "../" in link:
		result = link
	elif "./" in link:
		result = link
	else:
		result = base_url + link

	result = result.replace(" ", "")
	return result