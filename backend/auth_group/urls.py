from django.urls import path
from auth_group import views 
 
urlpatterns = [ 
    path('groups', views.ListCreateAuthGroupView.as_view()),
    path('groups/<int:pk>', views.UpdateDeleteAuthGroupView.as_view()),
]