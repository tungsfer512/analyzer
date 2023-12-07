from django.db import models

from django.dispatch import receiver
from django.contrib.auth.models import User
from django.db.models.signals import post_save, pre_save, post_delete
from importlib_metadata import version
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
# Create your models here.
from django.contrib.postgres.fields import ArrayField, JSONField
from rest_framework import serializers
from devices.tasks import publish_message
import os
from django.core.validators import FileExtensionValidator
# from .views import get_headers
import requests
import json
from datetime import datetime, timezone, timedelta
from IoTAnalyzer.env_dev import set_env, update_env, get_env
# class FileExample(models.Model):
#     file = models.ImageField(upload_to="")
# class ModelsMachineLearning(models.Model):
#     version_center_server = models.CharField(max_length =20),
#     category = models.CharField(max_length =20),


class ModelML(models.Model):
    file = models.FileField(

        upload_to="models/",
        validators=[FileExtensionValidator(allowed_extensions=['h5'])]
    )
    category = models.CharField(max_length=255)
    version = models.CharField(max_length=20)
    timestamp = models.DateTimeField(auto_now_add=True)
    use = models.BooleanField(default=False)
class WhiteListIP(models.Model):
    ip = models.CharField(max_length=20,unique=True,)
    url = models.CharField(max_length=50, default='', null=True)
    created = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = (('ip'),)
        ordering = ['created']
        
class BlackListIP(models.Model):
    ip = models.CharField(max_length=20,unique=True,)
    url = models.CharField(max_length=50, default='', null=True)
    created = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = (('ip'),)
        ordering = ['created']

class Devices(models.Model):
    os_sys = (
        ('windows', 'windows'),
        ('linux', 'linux'),
        ('qemu', 'qemu')
    )
    agent_name_selection=(
        ('',''),
        ('aarch64-g','aarch64-g'),
        ('agent-mips64el-g-ha','agent-mips64el-g-ha'),
        ('armv5tel-g','armv5tel-g'),
        ('armv7l-g','armv7l-g'),
        ('armv7l-u','armv7l-u'),
        ('mips-u','mips-u'),
        ('mips-u-old','mips-u-old'),
        ('mips-u.1','mips-u.1'),
        ('mips64-g','mips64-g'),
        ('mips64-u','mips64-u'),
        ('mips64el-u','mips64el-u'),
        ('mipsel-u','mipsel-u'),
        ('mipsel-u-cam','mipsel-u-cam'),        
        ('powerpc-u','powerpc-u'),
        ('sparc-u','sparc-u'),
        ('x86_64-g','x86_64-g'),
        ('agent_windows','agent_windows.exe')
    )
    device_type_selection=(
        ('router','router'),
        ('ip_cam','ip_cam'),
        ('smartbox','smartbox'),
        ('gateway','gateway'),
        ('hardware','hardware')
    )

    ip = models.CharField(max_length=20, blank=True, default='')
    name = models.CharField(max_length=50)
    protocol = models.CharField(max_length=10, default='telnet')
    username = models.CharField(max_length=20)
    password = models.CharField(max_length=20, blank=True)
    agentInstalled = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    mac_addr = models.CharField(max_length=50, unique=True, null=True)
    status = models.BooleanField(default=False)
    tracing_syscall = models.CharField(max_length=10, default='', null=True)
    resource_info = models.JSONField(default=dict)
    avatar = models.ImageField(
        upload_to='avatars/', default="avatars/default.jpg")
    arch = models.CharField(max_length=50, default="mips", blank=True)
    os = models.CharField(
        choices=os_sys, max_length=50, default='linux')
    port = models.IntegerField(default=22)
    from_internet = models.BooleanField(default=False)
    tracing_network = models.BooleanField(default=False)
    remote_port = models.IntegerField(default=3333)
    hwagent = models.BooleanField(default=False)
    hwagentOrOs = models.BooleanField(default=False)
    blacklistip = models.ManyToManyField(BlackListIP, blank=True)
    whitelistip = models.ManyToManyField(WhiteListIP, blank=True)
    agent_name = models.CharField(
        choices=agent_name_selection, max_length=50, default='')
    
    device_type = models.CharField(
        choices=device_type_selection, max_length=50, default='router')

    address = models.CharField(max_length=255, default='')
    autoUpdatePasswd = models.BooleanField(default=False)

    class Meta:
        unique_together = (('ip', 'port'),)
        ordering = ['created']


class DevicesSerializerCustom(serializers.ModelSerializer):
    class Meta:
        model = Devices
        fields = '__all__'


def save_devices(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'chat_alerts',
        {
            'type': 'devices_message',
            'message':  DevicesSerializerCustom(Devices.objects.all().order_by('created'), many=True).data
        }
    )


def delete_devices(sender, instance, **kwargs):
    print("you deleted something")
    # if instance.agentInstalled:
    publish_message(
        {'type': 'kill', 'id': instance.id, 'ip_agent': instance.ip,
            'protocol': instance.protocol,
            'ip_django': os.getenv("LAN_IP"),
            "username": instance.username, "password": instance.password, "OS": instance.os, "port": instance.port})


post_save.connect(save_devices, sender=Devices)
post_delete.connect(delete_devices, sender=Devices)


class Alerts(models.Model):
    ATTACK_TYPE = (
        ('NETWORK', 'Tấn công mạng'), ('MALWARE', 'Mã độc'),
        ('SYSCALL', 'Lời gọi hệ thống'), ('LOG', 'LOGS'), ("IPS", "Snort")
    )
    STATUS_TYPE = (
        ('DA_XU_LY', 'Đã xử lý'),
        ('CHUA_XU_LY', 'Chưa xử lý')
    )
    device = models.ForeignKey(Devices, on_delete=models.CASCADE, default=1)
    ip = models.CharField(max_length=20, blank=True, default='')
    timestamp = models.DateTimeField()
    hash = models.CharField(max_length=50, blank=True, default='')
    pid = models.CharField(max_length=8, blank=True, default='')
    message = models.TextField(blank=True, default='')
    type = models.CharField(choices=ATTACK_TYPE, max_length=50)
    rule_base = models.CharField(max_length=200, blank=True, default='')
    log = models.CharField(max_length=200, blank=True, default='')
    status = models.CharField(
        choices=STATUS_TYPE, max_length=50, default='CHUA_XU_LY')
    type_alert = models.CharField(max_length=200, blank=True, default="chat_message")
    address = models.TextField(blank=True, default='')

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        # Sent to center server
        # headers = get_headers()
        print("========================",self.type_alert)
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            }
        data = {
            "analyzer_ip": os.environ.get("LAN_SOCKET_SERVER_IP"),
            "device": {
                
                # "ip": Devices.objects.all().filter(id=self.device).first().ip
                "id": self.device.id,
                "ip": self.device.ip
            },
            "ip": self.ip,
            "timestamp": str(self.timestamp),
            "hash": self.hash,
            "pid": self.pid,
            "message": self.message,
            "type": self.type,
            "rule_base": self.rule_base,
            "log": self.log,
            "status": self.status
        }
        self.address = self.device.address

        url_center_alert =f'{os.getenv("CENTER_SERVER_IP", "http://192.168.10.242:9000")}/alerts/'
        alert_data = {
            "ip": self.ip,
            "timestamp": str(self.timestamp.strftime("%Y-%m-%dT%H:%M:%S.%fZ")),
            "hash": self.hash,
            "pid": self.pid,
            "message": self.message,
            "type": self.type,
            "rule_base": self.rule_base,
            "log": self.log,
            "status": self.status,
            "address": self.address,
            "device_ip": os.getenv("LOCAL_HOST"),
            "loai": 'add_log_alert',
            "local": os.getenv("LOCAL_SITE"),
            "type_log": "alert_attack_kc"
        }
        res2 = requests.post(url_center_alert, data=json.dumps(alert_data), headers=headers)
        super(Alerts, self).save(force_insert,
                                 force_update, using, update_fields)
        if False:
            time_auto = int(get_env("ALERT_SEND_MAIL_SECONDS", 60))
            if time_auto == -1:
                time_auto = 60
            # print("time111111111111111111111111111111111, ", time_auto)
            days = time_auto // (60 * 60 * 24)
            time_auto -= (60 * 60 * 24 * days)
            hours = time_auto // (60 * 60)
            time_auto -= (60 * 60 * hours)
            mins = time_auto // (60)
            time_auto -= (60 * mins)
            secs = time_auto
            time_start = datetime.strftime(datetime.now() - timedelta(days=days, hours=hours, minutes=mins, seconds=secs), '%Y-%m-%d %H:%M:%S.%fZ')
            time_end = datetime.strftime(datetime.now(), '%Y-%m-%d %H:%M:%S.%fZ')
            print("===============================================")
            print(time_start, time_end)
            print("===============================================")
            
            subject = f'''Phát hiện tấn công đến các thiết bị IoT của bạn'''
            body = f'''Đã phát hiện ra các cuộc tấn công vào mạng lưới thiết bị IoT của bạn. Vui lòng kiểm tra hệ thống để biết thêm chi tiết.'''
            
            result = Alerts.objects.all().filter(timestamp__range=(time_start, time_end))
            
            len_res = len(result)
            len_period = int(get_env("ALERT_SEND_MAIL_PERIOD", "10"))
            if len_res < len_period:
                update_env("ALERT_SEND_MAIL_NUMBER", "0")
            len_number = int(get_env("ALERT_SEND_MAIL_NUMBER", "10"))
            len_old = len_period * len_number

            if (len_res - len_old) % len_period == 0:
                update_env("ALERT_SEND_MAIL_NUMBER", str(len_number + 1))
                # send mail with body
                mail_data = {
                    "subject": subject,
                    "body": body,
                    "device_ip": os.getenv("LOCAL_HOST"),
                }
                url_center_mail =f'{os.getenv("CENTER_SERVER_IP", "http://192.168.10.242:9000")}/IoTAnalyzerDevices/mail/send'
                requests.post(url_center_mail, data=json.dumps(mail_data), headers=headers)
            
            time_auto = int(get_env("ALERT_SEND_SMS_SECONDS", 60))
            if time_auto == -1:
                time_auto = 60
            # print("time111111111111111111111111111111111, ", time_auto)
            days = time_auto // (60 * 60 * 24)
            time_auto -= (60 * 60 * 24 * days)
            hours = time_auto // (60 * 60)
            time_auto -= (60 * 60 * hours)
            mins = time_auto // (60)
            time_auto -= (60 * mins)
            secs = time_auto
            time_start = datetime.strftime(datetime.now() - timedelta(days=days, hours=hours, minutes=mins, seconds=secs), '%Y-%m-%d %H:%M:%S.%fZ')
            time_end = datetime.strftime(datetime.now(), '%Y-%m-%d %H:%M:%S.%fZ')
            print("===============================================")
            print(time_start, time_end)
            print("===============================================")
            
            body = f'''Phát hiện ra có các cuộc tấn công vào mạng lưới thiết bị IoT của bạn. Vui lòng kiểm tra hệ thống để biết thêm chi tiết.'''
            
            result = Alerts.objects.all().filter(timestamp__range=(time_start, time_end))
            
            len_res = len(result)
            len_period = int(get_env("ALERT_SEND_SMS_PERIOD", "10"))
            if len_res < len_period:
                update_env("ALERT_SEND_SMS_NUMBER", "0")
            len_number = int(get_env("ALERT_SEND_SMS_NUMBER", "10"))
            len_old = len_period * len_number

            if (len_res - len_old) % len_period == 0:
                update_env("ALERT_SEND_SMS_NUMBER", str(len_number + 1))
                # send sms with body
                sms_data = {
                    "body": body,
                    "device_ip": os.getenv("LOCAL_HOST"),
                }
                url_center_sms =f'{os.getenv("CENTER_SERVER_IP", "http://192.168.10.242:9000")}/IoTAnalyzerDevices/sms/send'
                requests.post(url_center_sms, data=json.dumps(sms_data), headers=headers)
            
            time_auto = int(get_env("ALERT_SEND_TELE_SECONDS", 60))
            if time_auto == -1:
                time_auto = 60
            # print("time111111111111111111111111111111111, ", time_auto)
            days = time_auto // (60 * 60 * 24)
            time_auto -= (60 * 60 * 24 * days)
            hours = time_auto // (60 * 60)
            time_auto -= (60 * 60 * hours)
            mins = time_auto // (60)
            time_auto -= (60 * mins)
            secs = time_auto
            time_start = datetime.strftime(datetime.now() - timedelta(days=days, hours=hours, minutes=mins, seconds=secs), '%Y-%m-%d %H:%M:%S.%fZ')
            time_end = datetime.strftime(datetime.now(), '%Y-%m-%d %H:%M:%S.%fZ')
            print("===============================================")
            print(time_start, time_end)
            print("===============================================")
            
            body = f'''Phát hiện ra có các cuộc tấn công vào mạng lưới thiết bị IoT của bạn. Vui lòng kiểm tra hệ thống để biết thêm chi tiết.'''
            
            result = Alerts.objects.all().filter(timestamp__range=(time_start, time_end))
            
            len_res = len(result)
            len_period = int(get_env("ALERT_SEND_TELE_PERIOD", "10"))
            if len_res < len_period:
                update_env("ALERT_SEND_TELE_NUMBER", "0")
            len_number = int(get_env("ALERT_SEND_TELE_NUMBER", "10"))
            len_old = len_period * len_number

            if (len_res - len_old) % len_period == 0:
                update_env("ALERT_SEND_TELE_NUMBER", str(len_number + 1))
                # send tele with body
                tele_data = {
                    "body": body,
                    "device_ip": os.getenv("LOCAL_HOST"),
                }
                url_center_tele =f'{os.getenv("CENTER_SERVER_IP", "http://192.168.10.242:9000")}/IoTAnalyzerDevices/telegram/send'
                requests.post(url_center_tele, data=json.dumps(tele_data), headers=headers)

        # send info to channel
        channel_layer = get_channel_layer()
        print('post save alert ******************************* ', data.get('device').get('id'))

        if self.type_alert != "un_log_alert":
            async_to_sync(channel_layer.group_send)(
                'chat_alerts',
                {
                    'type': f'{self.type_alert}',
                    'message': self.message,
                    'id': str(data.get('device').get('id')),
                    'alert_id':self.pk,
                    'pid':self.pid,
                    'address':self.address,
                }
            )


class ProcessHash(models.Model):
    sha1 = models.CharField(max_length=50, unique=True)
    loaiMaDoc = models.CharField(max_length=500, blank=True)
    acc = models.IntegerField()


class SyscallList(models.Model):
    device_id = models.ForeignKey(Devices, on_delete=models.CASCADE)
    pid = models.CharField(max_length=8, blank=False)
    syscall = models.CharField(max_length=50, blank=False)
    params = models.CharField(max_length=200, blank=True, default='')
    # process_list = models.CharField(max_length=50, default='')
    created = models.DateTimeField(auto_now_add=True)

    def bulk_create(self, objs, **kwargs):
        for item in objs:
            # post_save.connect(save_syscall,sender=SyscallList)
            print("say hellou")
        return super().bulk_create(objs, **kwargs)


class SyscallListSerializerCustom(serializers.ModelSerializer):
    class Meta:
        model = SyscallList
        fields = '__all__'


def save_syscall(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'chat_alerts',
        {
            'type': 'syscalllist_message',
            'message':  SyscallListSerializerCustom(instance).data
        }
    )


post_save.connect(save_syscall, sender=SyscallList)


class ProcessList(models.Model):
    device_id = models.ForeignKey(Devices, on_delete=models.CASCADE)
    process_list = models.JSONField(blank=True, null=True, default=dict)
    # process_list = models.CharField(max_length=50, default='')
    created = models.DateTimeField(auto_now_add=True)


class IntegrityCheck(models.Model):
    device_id = models.ForeignKey(Devices, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    message = models.CharField(max_length=1000, blank=True, default='')

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        super(IntegrityCheck, self).save(force_insert,
                                         force_update, using, update_fields)
        # send info to channel
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'chat_alerts',
            {
                'type': 'integrity_message',
                'message': self.message,
            }
        )


class IpsTracking(models.Model):
    device = models.ForeignKey(Devices, on_delete=models.CASCADE)
    ip_tracking = models.CharField(
        max_length=20, blank=False, default='', unique=False)
    count = models.IntegerField(default=1, unique=False)


class OneSignal(models.Model):
    onesignal_id = models.CharField(max_length=1000, blank=True, default='')
    username = models.CharField(max_length=1000, blank=True, default='')


class RuleBase(models.Model):
    rules_choices = (
        ('firewall', 'firewall'), ('snort', 'snort'),
    )
    version = models.CharField(max_length=20)
    file = models.CharField(max_length=1000, blank=True, default='')
    rules = models.CharField(
        choices=rules_choices, max_length=50, default='snort')
    timestamp = models.DateTimeField(auto_now_add=True)


class DeviceIpConnectHWagent(models.Model):
    connect = (
        ('N', 'Ngắt kết nối'),
        # ('Chặn', 'Chặn kết nối'),
        ('D', 'Đang kết nối'),
    )
    device = models.ForeignKey(Devices, on_delete=models.CASCADE)
    ip = models.CharField(max_length=20, blank=True, default='')
    created = models.DateTimeField(auto_now_add=True)
    mac_addr = models.CharField(max_length=50, unique=True, null=True)
    hostname = models.CharField(max_length=50, default='', null=True)
    network = models.BooleanField(default=True)
    connect = models.CharField(
        choices=connect, max_length=50, default='D')

    class Meta:
        unique_together = (('ip', 'device'),)
        ordering = ['created']


class DeviceNorm(models.Model):
    net_rxkBs_min = models.FloatField(default=0.0)
    net_rxkBs_max = models.FloatField(default=120440.91796875)
    net_txkBs_min = models.FloatField(default=0.0)
    net_txkBs_max = models.FloatField(default=30663.96484375)
    net_tpcks_min = models.FloatField(default=0.0)
    net_tpcks_max = models.FloatField(default=123.4072265625)
    net_rpcks_min = models.FloatField(default=0.0)
    net_rpcks_max = models.FloatField(default=516.767578125)
    io_rkbs_min = models.FloatField(default=0.0)
    io_rkbs_max = models.FloatField(default=362.5)
    io_wkbs_min = models.FloatField(default=0.0)
    io_wkbs_max = models.FloatField(default=0.0)
    device = models.ForeignKey(Devices, on_delete=models.CASCADE, unique=True)