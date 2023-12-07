from django.urls import path
from menus import views 
 
urlpatterns = [ 
    path('menus', views.ListCreateMenusView.as_view()),
    path('menus/<int:pk>', views.UpdateDeleteMenusView.as_view()),
]