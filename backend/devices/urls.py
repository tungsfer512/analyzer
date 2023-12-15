from django.urls import path, include
from rest_framework.routers import DefaultRouter
# ,ModelsMachineLearningViewSet  #UpLoadImageView UpLoadCheckViewSet
from devices.views import  ModelMachineLearningView # UploadFileView,
from devices import views
from django.conf.urls import url
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'devices', views.DevicesViewSet)
router.register(r'alerts', views.AlertsViewSet)
router.register(r'processhash', views.ProcessHashViewSet)
router.register(r'processlist', views.ProcessListViewSet)
router.register(r'syscalllist', views.SyscallListViewSet)
router.register(r'integritycheck', views.IntegrityCheckViewSet)
router.register(r'ModelMachineLearning', views.ModelMachineLearningView)
router.register(r'IpsTracking', views.IpsView)
router.register(r'OneSignal', views.OneSignalView)
router.register(r'RuleBase', views.RuleBaseView)
router.register(r'DeviceIpConnectHWagent', views.DeviceIpConnectHWagentView)
router.register(r'WhiteListIP', views.WhiteListIPView)
router.register(r'BlackListIP', views.BlackListIPView)
router.register(r'DeviceNorm', views.DeviceNormViewSet)
router.register(r'Pcap', views.GetPcapJsonFromElasticsearch)

# router.register(r'upload', views.UpLoadCheckViewSet)
# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
    path('devices/create',views.CreateDevice.as_view()),
    path('devices/edit',views.EditDevice.as_view()),
    path('devices/export', views.ExportPDF.as_view()),
    path('devices/export/url', views.GetExportPDFURL.as_view()),
    path('devices/export-docx', views.ExportDOCX.as_view()),
    path('devices/export-docx/url', views.GetExportDOCXURL.as_view()),
    path('devices/export-xls', views.ExportXLS.as_view()),
    path('devices/export-xls/url', views.GetExportXLSURL.as_view()),
    # path('devices/scan', views.ScanDevicesView.as_view()),
    # path('me/network', views.GetNetworkInfoView.as_view()),
    # path('me/network2', views.GetNetworkInfoView.as_view()),
    path('devices/update-device-by-macaddr/<str:mac_addr>',
         views.update_devices_by_macaddr.as_view()),
    path('devices/changePwd/<int:pk>', views.ChangePwdView.as_view()),
    path('devices/update-device-by-ip/<str:ip>',
         views.update_devices_by_ip.as_view()),
    # path('devices/update-device-by-ip/<str:ip>',
    #     views.update_devices_by_ip.as_view()),
    # path('upload/', views.UploadFileView.as_view()),
   
    path('agents/kill-agent/<int:pk>', views.kill_agent_by_id.as_view()),
#     path('review/',views.ReviewFileView.as_view(
#          {'get': 'list'}
#          )),
    # path('snort/update-rule/', views.update_rule.as_view()),
    # path('agents/install-agent/<int:pk>', views.install_agent_by_id.as_view()),
    # path('agents/install-agent', views.install_agent.as_view()),
    # path('agents/auto-clear-sftp', views.AgentClearFileSFTPView.as_view()),
    # path('agents/auto-check-overload', views.AgentCheckOverloadView.as_view()),
    path('dashboard/stat/', views.DashboardView.as_view()),
    path('dashboard/startTracePcap/', views.DashboardStartTracePcapView.as_view()),
    path('dashboard/stopTracePcap/', views.DashboardStopTracePcapView.as_view()),
    # path('syscallBatch/', views.SyscallBatchView.as_view()),
    # path('NotiSnort/', views.NotiSnortView.as_view())
    path('auto/update-devices-by-scan-arp', views.AutoUpdateListDevice.as_view()),
    path("devices/threshold", views.ThresholdView.as_view()),
    path('file/get_file_from_pcap', views.GetFileFromPcap.as_view()),
    path('file/get_file_from_network', views.GetFileFromNetwork.as_view()),
    path('file/get_file_from_network_with_time', views.GetFileFromPcapWithTime.as_view())

]
