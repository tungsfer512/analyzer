from statistics import mode
from django.db import models
from django.db.models import fields
# from pkg_resources import _PkgReqType
from devices.models import *
from rest_framework import serializers


class DevicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Devices
        fields = '__all__'
class BlackListIPDevicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Devices
        fields = ['black_list_ip']
        
class WhiteListIPDevicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Devices
        fields = ['white_list_ip']

# neu update cac truong khac thi sao ? :v vidu password ? 
class UpdateDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Devices
        fields = ['agentInstalled'
                  ]

class UpdateDeviceTelnetPasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Devices
        fields =  ['password']
        
class AlertsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alerts
        fields = '__all__'


class ProcessHashSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessHash
        fields = '__all__'


class ProcessListSerializer(serializers.ModelSerializer):
    process_list = serializers.JSONField()

    class Meta:
        model = ProcessList
        fields = ['device_id', 'process_list', 'created']


class SyscallListSerializer(serializers.ModelSerializer):
    class Meta:
        model = SyscallList
        fields = '__all__'


class AddProcessListWithIPSerializer(serializers.Serializer):
    ip = serializers.CharField(max_length=30)
    process_list = serializers.JSONField(default=dict)


class UpdateIPFrequencySerializer(serializers.ModelSerializer):
    ip_tracking = serializers.JSONField(default=list)
    
    class Meta:
        model = IpsTracking 
        fields = ['device','ip_tracking']

class IpsTrackingSerializer(serializers.ModelSerializer):
    class Meta:
        model = IpsTracking
        fields = '__all__'
        
class AddCountIpsTrackingSerializer(serializers.Serializer):
    device = serializers.IntegerField()
    ip_tracking = serializers.CharField(default='')
    count = serializers.IntegerField(default=0)
    
class IntegrityCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = IntegrityCheck
        fields = '__all__'

# class UpLoadSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Devices
#         fields = ['file']

class UpLoadImageSerializer(serializers.ModelSerializer):
    # avatar = serializers.ImageField(upload ='avatars/')
    class Meta:
        model = Devices 
        fields = ['avatar',]
        # fields = '__all__'

class FileExampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelML
        fields = '__all__'

class ModelMachineLearningSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelML
        fields = ['version','category','file']
class OneSignalSerializer(serializers.ModelSerializer):
    class Meta:
        model = OneSignal
        fields = '__all__'
class RuleBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = RuleBase
        fields = '__all__' 
class InstallAgentSerializer(serializers.ModelSerializer):

    id = serializers.JSONField(default=list)
    class Meta:
        model = Devices 
        fields = ['id']
        
class DeviceIpConnectHWagentSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceIpConnectHWagent
        fields = '__all__'

class ListDeviceIpConnectHWagentSerializer(serializers.ModelSerializer):
    
    mac_addr = serializers.JSONField(default=list)
    ip = serializers.JSONField(default=list)
    hostname = serializers.JSONField(default=list)
    class Meta:
        model = DeviceIpConnectHWagent 
        fields = ['device','mac_addr','ip','hostname']
        
class LisstDeviceIdConnectHWagentSerializer(serializers.ModelSerializer):
    
    id = serializers.JSONField(default=list)
    class Meta:
        model = DeviceIpConnectHWagent 
        fields = ['id']


class BlackListIPSerializer(serializers.ModelSerializer):
    id = serializers.JSONField(default=list)
    class Meta:
        model = Devices
        fields =  ['id',"blacklistip"]

class WhiteListIPSerializer(serializers.ModelSerializer):
    id = serializers.JSONField(default=list)
    class Meta:
        model = Devices
        fields =  ['id','whitelistip']

class BlackListIPallSerializer(serializers.ModelSerializer):

    class Meta:
        model = BlackListIP
        fields =  '__all__'

class WhiteListIPallSerializer(serializers.ModelSerializer):

    class Meta:
        model = WhiteListIP
        fields =  '__all__'

class ListDevice(serializers.ModelSerializer):
    
    id = serializers.JSONField(default=list)
    class Meta:
        model = Devices 
        fields = ['id']
        
class AlertsExportSerializer(serializers.ModelSerializer):
    status = serializers.JSONField(default=list)
    type = serializers.JSONField(default=list)
    timestamp = serializers.JSONField(default=list)
    device = serializers.JSONField(default=list)
    class Meta:
        model = Alerts
        fields =['status','type','timestamp','device']

class DeviceNormSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceNorm
        fields =  '__all__'