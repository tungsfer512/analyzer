from django.urls import path
from auth_user import views 
 
urlpatterns = [ 
    path('users', views.ListCreateAuthUserView.as_view()),
    path('users/<int:pk>', views.UpdateDeleteAuthUserView.as_view()),
    path('users/get-current-info/<username>', views.GetCurrentUserInfo.as_view())
]