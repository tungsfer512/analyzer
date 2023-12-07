from django.urls import path
from django.urls import path, include
from . import views 
from rest_framework.routers import DefaultRouter


urlpatterns = [
    path('setting/host-username/<str:data>', views.UpdateHostUsername.as_view()),
    path('setting/host-username', views.GetHostUsername.as_view()),
    path('setting/host-password/<str:data>', views.UpdateHostPassword.as_view()),
    path('setting/host-password', views.GetHostPassword.as_view()),
    path('setting/host-interface/<str:data>', views.UpdateHostInterface.as_view()),
    path('setting/host-interface', views.GetHostInterface.as_view()),
    path('setting/autoupdateblackiplist', views.AutoUpdateBlackIpList.as_view()),
    path('setting/put-autoupdateblackiplist/<int:seconds>', views.PutAutoUpdateBlackIpList.as_view()),
    path('setting/pause-autoupdateblackiplist', views.PauseAutoUpdateBlackIpList.as_view()),
    path('setting/autoupdatewhiteiplist', views.AutoUpdateWhiteIpList.as_view()),
    path('setting/put-autoupdatewhiteiplist/<int:seconds>', views.PutAutoUpdateWhiteIpList.as_view()),
    path('setting/pause-autoupdatewhiteiplist', views.PauseAutoUpdateWhiteIpList.as_view()),
    path('setting/autoupdateagent', views.AutoUpdateAgent.as_view()),
    path('setting/put-autoupdateagent/<int:seconds>', views.PutAutoUpdateAgent.as_view()),
    path('setting/pause-autoupdateagent', views.PauseAutoUpdateAgent.as_view()),
    path('setting/autochangepw', views.AutoUpdatePassword.as_view()),
    path('setting/put-autochangepw/<int:seconds>', views.PutAutoUpdatePassword.as_view()),
    path('setting/pause-autochangepw', views.PauseAutoUpdatePassword.as_view()),
    path('setting/manual-update-agent', views.AutoupdateAgentView.as_view()),
    path('setting/manual-update-blacklist', views.AutoUpdateBlackListView.as_view()),
    path('setting/manual-update-whitelist', views.AutoUpdateWhiteListView.as_view()),
    path('setting/manual-update-password', views.AutoUpdatePasswordView.as_view()),
    path('setting/distributed', views.DistributedView.as_view()),
    path('snorts/autoupdatesnort', views.AutoUpdateSnort.as_view()),
    path('snorts/put-autoupdatesnort/<int:seconds>', views.PutAutoUpdateSnort.as_view()),
    path('snorts/pause-autoupdatesnort', views.PauseAutoUpdateSnort.as_view()),
    path('snorts', views.AutoUpdateSnortView.as_view()),
]