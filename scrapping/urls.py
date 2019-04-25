from django.urls import path
# from dajaxice.core import dajaxice_autodiscover, dajaxice_config
# from django.contrib.staticfiles.urls import staticfiles_urlpatterns
# from django.conf import settings
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('link', views.linkScrap, name='linkScrap'),
    path('info', views.infoScrap, name='infoScrap'),
    path('result', views.handle, name='handle')
]
