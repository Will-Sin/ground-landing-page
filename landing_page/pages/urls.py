from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('landing-page/', views.landingPage, name='landing-page'),
    path('carnival/', views.indexCarnival, name='carnival-page'),
]
