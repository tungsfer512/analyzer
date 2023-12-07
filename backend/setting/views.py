from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from auth_user.views import ResultsSetPagination
from rest_framework import status
from rest_framework import permissions
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from pathlib import Path
from django.http import HttpResponse
from rest_framework.views import APIView
import os
import requests
import json
from .tools import hash
from .scheduler import device_scheduler
from django.http import HttpResponse
import os
import logging
import subprocess
import json
import string
import random
from os.path import isfile
from rest_framework.response import Response
from devices.models import *
from devices.serializers import * 
from .tools import validateip
from .tools.create_info_file import CreateInfoFile
from devices import tasks



logger = logging.getLogger(__name__)

pathEnv = '/backend/.env.dev'
def get_headers():
    url =f'{os.getenv("CENTER_SERVER_IP", "http://192.168.10.162:9000")}/auth/token/login/'
    username = os.environ.get("CENTER_USERNAME", "tomcat")
    password = os.environ.get("CENTER_PASSWORD", "tomcat")
    headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    }
    x = requests.post(
        url, data=json.dumps({'username': username, 'password': password}), headers=headers)
    content = json.loads(x.content)

    auth_token = content['auth_token']
    headers = {
        "Authorization": f"Token {auth_token}",
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    return headers

class UpdateHostUsername(APIView):
    def put(self, request, data):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        for i in range(len(arr)):
            if (arr[i].find('HOST_USERNAME') != -1):
                arr[i] = 'HOST_USERNAME=' + str(data)
        res = ""
        for i in range(len(arr)):
            res += arr[i]
            if i < len(arr) - 1:
                res += chr(10)
        print(res)
        open(pathEnv, 'w').close()
        f = open(pathEnv, 'w')
        f.write(res)
        f.close()
        return HttpResponse("Update host username")
    
class GetHostUsername(APIView):   
    def get(self, request):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        autoChangePw = ""
        for item in arr:
            if (item.find('HOST_USERNAME') != -1):
                autoChangePw = item
        value = autoChangePw.split("=")
        return HttpResponse(value[1])
    
class UpdateHostPassword(APIView):
    def put(self, request, data):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        for i in range(len(arr)):
            if (arr[i].find('HOST_PASSWORD') != -1):
                arr[i] = 'HOST_PASSWORD=' + str(data)
        res = ""
        for i in range(len(arr)):
            res += arr[i]
            if i < len(arr) - 1:
                res += chr(10)
        print(res)
        open(pathEnv, 'w').close()
        f = open(pathEnv, 'w')
        f.write(res)
        f.close()
        return HttpResponse("Update HOST_PASSWORD")
    
class GetHostPassword(APIView):   
    def get(self, request):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        autoChangePw = ""
        for item in arr:
            if (item.find('HOST_PASSWORD') != -1):
                autoChangePw = item
        value = autoChangePw.split("=")
        return HttpResponse(value[1])
    
class UpdateHostInterface(APIView):
    def put(self, request, data):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        for i in range(len(arr)):
            if (arr[i].find('HOST_INTERFACE') != -1):
                arr[i] = 'HOST_INTERFACE=' + str(data)
        res = ""
        for i in range(len(arr)):
            res += arr[i]
            if i < len(arr) - 1:
                res += chr(10)
        print(res)
        open(pathEnv, 'w').close()
        f = open(pathEnv, 'w')
        f.write(res)
        f.close()
        return HttpResponse("Update HOST_INTERFACE")
    
class GetHostInterface(APIView):   
    def get(self, request):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        autoChangePw = ""
        for item in arr:
            if (item.find('HOST_INTERFACE') != -1):
                autoChangePw = item
        value = autoChangePw.split("=")
        return HttpResponse(value[1])

class AutoUpdateBlackIpList(APIView):
    def get(self, request):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        autoChangePw = ""
        for item in arr:
            if (item.find('AUTO_UPDATE_BLACK_IP_LIST_SECONDS') != -1):
                autoChangePw = item
        value = autoChangePw.split("=")
        return HttpResponse(value[1])

class PutAutoUpdateBlackIpList(APIView):
    def put(self, request, seconds=(60 * 60)):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        for i in range(len(arr)):
            if (arr[i].find('AUTO_UPDATE_BLACK_IP_LIST_SECONDS') != -1):
                arr[i] = 'AUTO_UPDATE_BLACK_IP_LIST_SECONDS=' + str(seconds)
        res = ""
        for i in range(len(arr)):
            res += arr[i]
            if i < len(arr) - 1:
                res += chr(10)
        print(res)
        open(pathEnv, 'w').close()
        f = open(pathEnv, 'w')
        f.write(res)
        f.close()
        device_scheduler.restart()
        return HttpResponse("Changed seconds auto update black ip list.")

class AutoUpdateWhiteIpList(APIView):
    def get(self, request):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        autoChangePw = ""
        for item in arr:
            if (item.find('AUTO_UPDATE_WHITE_IP_LIST_SECONDS') != -1):
                autoChangePw = item
        value = autoChangePw.split("=")
        return HttpResponse(value[1])

class PutAutoUpdateWhiteIpList(APIView):
    def put(self, request, seconds=(60 * 60)):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        for i in range(len(arr)):
            if (arr[i].find('AUTO_UPDATE_WHITE_IP_LIST_SECONDS') != -1):
                arr[i] = 'AUTO_UPDATE_WHITE_IP_LIST_SECONDS=' + str(seconds)
        res = ""
        for i in range(len(arr)):
            res += arr[i]
            if i < len(arr) - 1:
                res += chr(10)
        print(res)
        open(pathEnv, 'w').close()
        f = open(pathEnv, 'w')
        f.write(res)
        f.close()
        device_scheduler.restart()
        return HttpResponse("Changed seconds auto update white ip list.")
    
class PauseAutoUpdateWhiteIpList(APIView):
    def get(self, request):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        for i in range(len(arr)):
            if (arr[i].find('AUTO_UPDATE_WHITE_IP_LIST_SECONDS') != -1):
                arr[i] = 'AUTO_UPDATE_WHITE_IP_LIST_SECONDS=' + str(-1)
        res = ""
        for i in range(len(arr)):
            res += arr[i]
            if i < len(arr) - 1:
                res += chr(10)
        print(res)
        open(pathEnv, 'w').close()
        f = open(pathEnv, 'w')
        f.write(res)
        f.close()
        device_scheduler.restart()
        return HttpResponse("Pause auto update white ip list.")

class PauseAutoUpdateBlackIpList(APIView):
    def get(self, request):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        for i in range(len(arr)):
            if (arr[i].find('AUTO_UPDATE_BLACK_IP_LIST_SECONDS') != -1):
                arr[i] = 'AUTO_UPDATE_BLACK_IP_LIST_SECONDS=' + str(-1)
        res = ""
        for i in range(len(arr)):
            res += arr[i]
            if i < len(arr) - 1:
                res += chr(10)
        print(res)
        open(pathEnv, 'w').close()
        f = open(pathEnv, 'w')
        f.write(res)
        f.close()
        device_scheduler.restart()
        return HttpResponse("Pause auto update black ip list.")

class AutoUpdateAgent(APIView):
    def get(self, request):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        autoChangePw = ""
        for item in arr:
            if (item.find('AUTO_UPDATE_AGENT_SECONDS') != -1):
                autoChangePw = item
        value = autoChangePw.split("=")
        return HttpResponse(value[1])

class PutAutoUpdateAgent(APIView):
    def put(self, request, seconds=(60 * 60)):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        for i in range(len(arr)):
            if (arr[i].find('AUTO_UPDATE_AGENT_SECONDS') != -1):
                arr[i] = 'AUTO_UPDATE_AGENT_SECONDS=' + str(seconds)
        res = ""
        for i in range(len(arr)):
            res += arr[i]
            if i < len(arr) - 1:
                res += chr(10)
        print(res)
        open(pathEnv, 'w').close()
        f = open(pathEnv, 'w')
        f.write(res)
        f.close()
        device_scheduler.restart()
        return HttpResponse("Changed seconds auto update agent.")

class PauseAutoUpdateAgent(APIView):
    def get(self, request):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        for i in range(len(arr)):
            if (arr[i].find('AUTO_UPDATE_AGENT_SECONDS') != -1):
                arr[i] = 'AUTO_UPDATE_AGENT_SECONDS=' + str(-1)
        res = ""
        for i in range(len(arr)):
            res += arr[i]
            if i < len(arr) - 1:
                res += chr(10)
        print(res)
        open(pathEnv, 'w').close()
        f = open(pathEnv, 'w')
        f.write(res)
        f.close()
        device_scheduler.restart()
        return HttpResponse("Pause auto update agent.")

class AutoupdateAgentView(APIView):
    
    def get(self, request):
        try:
            
            AGENT_BASE_DIR = "./kc-static-files/build/"
            filenames = os.listdir(AGENT_BASE_DIR)
            filenames = [filename for filename in filenames if (isfile(AGENT_BASE_DIR + filename) and "." not in filename)]
            localAgents = []
            for filename in filenames: 
                hash_code = hash.hash_file(AGENT_BASE_DIR + filename)
                te = {
                    "file": filename,
                    "hash": hash_code
                }
                localAgents.append(te)
            res = requests.get(url=f'{os.getenv("CENTER_SERVER_IP")}/settings/agent_hash', headers=get_headers())
            centerAgent = res.json()['data']
            additionAgents = [agent for agent in centerAgent if agent['file'] not in filenames]
            updateAgents = [agent for agent in centerAgent if agent['file'] in filenames]
            data = []
            for additionAgent in additionAgents:
                response = requests.get(url=f'{os.getenv("CENTER_SERVER_IP")}/settings/agent_hash/{additionAgent["file"]}', headers=get_headers())
                open(AGENT_BASE_DIR + additionAgent["file"], "wb").write(response.content)
                data.append(additionAgent["file"])
            for i in range(len(updateAgents)):
                if updateAgents[i]['hash'] != localAgents[i]['hash']:
                    response = requests.get(url=f'{os.getenv("CENTER_SERVER_IP")}/settings/agent_hash/{updateAgents[i]["file"]}', headers=get_headers())
                    open(AGENT_BASE_DIR + localAgents[i]["file"], "wb").write(response.content)
                    data.append(localAgents[i]["file"])
            return Response({
                'data': data,
                "count": len(data)
            })
        except Exception as e:
            logging.error(e)
            return Response(data={'status': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    
    def auto_update_agent():
        try:
            
            AGENT_BASE_DIR = "./kc-static-files/build/"
            filenames = os.listdir(AGENT_BASE_DIR)
            filenames = [filename for filename in filenames if (isfile(AGENT_BASE_DIR + filename) and "." not in filename)]
            localAgents = []
            for filename in filenames: 
                hash_code = hash.hash_file(AGENT_BASE_DIR + filename)
                te = {
                    "file": filename,
                    "hash": hash_code
                }
                localAgents.append(te)
            res = requests.get(url=f'{os.getenv("CENTER_SERVER_IP")}/settings/agent_hash', headers=get_headers())
            centerAgent = res.json()['data']
            additionAgents = [agent for agent in centerAgent if agent['file'] not in filenames]
            updateAgents = [agent for agent in centerAgent if agent['file'] in filenames]
            data = []
            for additionAgent in additionAgents:
                response = requests.get(url=f'{os.getenv("CENTER_SERVER_IP")}/settings/agent_hash/{additionAgent["file"]}', headers=get_headers())
                open(AGENT_BASE_DIR + additionAgent["file"], "wb").write(response.content)
                data.append(additionAgent["file"])
            for i in range(len(updateAgents)):
                if updateAgents[i]['hash'] != localAgents[i]['hash']:
                    response = requests.get(url=f'{os.getenv("CENTER_SERVER_IP")}/settings/agent_hash/{updateAgents[i]["file"]}', headers=get_headers())
                    open(AGENT_BASE_DIR + localAgents[i]["file"], "wb").write(response.content)
                    data.append(localAgents[i]["file"])
            return Response({
                'data': data,
                "count": len(data)
            })
        except Exception as e:
            logging.error(e)
            return Response(data={'status': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
class AutoUpdateSnortView(APIView):
    def get(self, request):
        SNORT_PATH = "./kc-static-files/snort/snort.rules"
        response = requests.get(url=f'{os.getenv("CENTER_SERVER_IP")}/snorts', headers=get_headers())
        open(SNORT_PATH, "wb").write(response.content)
        return Response("Update successfully", status=status.HTTP_200_OK)

    def auto_update_snort():
        SNORT_PATH = "./kc-static-files/snort/snort.rules"
        response = requests.get(url=f'{os.getenv("CENTER_SERVER_IP")}/snorts', headers=get_headers())
        open(SNORT_PATH, "wb").write(response.content)
        return Response("Update successfully", status=status.HTTP_200_OK)
    
class AutoUpdateSnort(APIView):
    def get(self, request):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        autoChangePw = ""
        for item in arr:
            if (item.find('AUTO_UPDATE_SNORT_SECONDS') != -1):
                autoChangePw = item
        value = autoChangePw.split("=")
        return HttpResponse(value[1])

class PutAutoUpdateSnort(APIView):
    def put(self, request, seconds=(60 * 60)):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        for i in range(len(arr)):
            if (arr[i].find('AUTO_UPDATE_SNORT_SECONDS') != -1):
                arr[i] = 'AUTO_UPDATE_SNORT_SECONDS=' + str(seconds)
        res = ""
        for i in range(len(arr)):
            res += arr[i]
            if i < len(arr) - 1:
                res += chr(10)
        print(res)
        open(pathEnv, 'w').close()
        f = open(pathEnv, 'w')
        f.write(res)
        f.close()
        device_scheduler.restart()
        return HttpResponse("Changed seconds auto update snort.")

class PauseAutoUpdateSnort(APIView):
    def get(self, request):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        for i in range(len(arr)):
            if (arr[i].find('AUTO_UPDATE_SNORT_SECONDS') != -1):
                arr[i] = 'AUTO_UPDATE_SNORT_SECONDS=' + str(-1)
        res = ""
        for i in range(len(arr)):
            res += arr[i]
            if i < len(arr) - 1:
                res += chr(10)
        print(res)
        open(pathEnv, 'w').close()
        f = open(pathEnv, 'w')
        f.write(res)
        f.close()
        device_scheduler.restart()
        return HttpResponse("Pause auto update snort.")
    
class AutoUpdateBlackListView(APIView):
    def get(self, request):
        try:
            print(os.getenv("CENTER_SERVER_IP"))
            req = requests.get(url=f'{os.getenv("CENTER_SERVER_IP")}/BlackListIP/all', headers=get_headers())
            data = req.json()['results']
            print(data)
            recent_id = (len(BlackListIP.objects.all()) + 1)
            for item in data:
                if BlackListIP.objects.all().filter(ip=item["ip"]).first() == None and WhiteListIP.objects.all().filter(ip=item["ip"]).first() == None and validateip.is_ipv4(item["ip"]):
                    ip = BlackListIP(id=(
                        recent_id), ip=f'{item["ip"]}', url=f'{item["url"]}', created=f'{item["created"]}')
                    ip.save()
                    recent_id += 1
            return Response({
                'msg': 'success black'
            })
        except Exception as e:
            logging.error(e)
            return Response(data={'status': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class AutoUpdateWhiteListView(APIView):
    def get(self, request):
        try:
            req = requests.get(url=f'{os.getenv("CENTER_SERVER_IP")}/WhiteListIP/all', headers=get_headers())
            data = req.json()['results']
            print(data)
            recent_id = (len(WhiteListIP.objects.all()) + 1)
            for item in data:
                if BlackListIP.objects.all().filter(ip=item["ip"]).first() == None and WhiteListIP.objects.all().filter(ip=item["ip"]).first() == None and validateip.is_ipv4(item["ip"]):
                    ip = WhiteListIP(id=(
                        recent_id), ip=f'{item["ip"]}', url=f'{item["url"]}', created=f'{item["created"]}')
                    ip.save()
                    recent_id += 1
            return Response({
                'msg': 'success'
            })
        except Exception as e:
            logging.error(e)
            return Response(data={'status': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class DistributedView(APIView):
    def get(self, request):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        res = []
        for item in arr:
            if (item.find('CENTER_SERVER_IP') != -1):
                value = item.split("=")
                res.append(value[1])
            if (item.find('CENTER_USERNAME') != -1):
                value = item.split("=")
                res.append(value[1])
            if (item.find('CENTER_PASSWORD') != -1):
                value = item.split("=")
                res.append(value[1])
            if (item.find('CPU_THRESHOLD') != -1):
                value = item.split("=")
                res.append(value[1])
            if (item.find('RAM_THRESHOLD') != -1):
                value = item.split("=")
                res.append(value[1])
            if (item.find('ACTIVE_DISTRIBUTED') != -1):
                value = item.split("=")
                res.append(value[1])
            if (item.find('ACTIVE_DISTRIBUTED_RECEIVE') != -1):
                value = item.split("=")
                res.append(value[1])
        data = {
            'center_domain': res[0], 
            'center_username': res[1], 
            'center_password': res[2], 
            'cpu_threshold': res[3], 
            'ram_threshold': res[4], 
            'active': res[5], 
            'active_receive': res[6], 
        }
        return Response(data, status=status.HTTP_200_OK)
    
    
    def put(self, request):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        res = []
        data = request.data
        for i in range(len(arr)):
            if (arr[i].find('CENTER_SERVER_IP') != -1):
                arr[i] = 'CENTER_SERVER_IP=' + str(data.get('center_domain'))
            if (arr[i].find('CENTER_USERNAME') != -1):
                arr[i] = 'CENTER_USERNAME=' + str(data.get('center_username'))
            if (arr[i].find('CENTER_PASSWORD') != -1):
                arr[i] = 'CENTER_PASSWORD=' + str(data.get('center_password'))
            if (arr[i].find('CPU_THRESHOLD') != -1):
                arr[i] = 'CPU_THRESHOLD=' + str(data.get('cpu_threshold'))
            if (arr[i].find('RAM_THRESHOLD') != -1):
                arr[i] = 'RAM_THRESHOLD=' + str(data.get('ram_threshold'))
            if (arr[i].find('ACTIVE_DISTRIBUTED') != -1):
                arr[i] = 'ACTIVE_DISTRIBUTED=' + str(data.get('active'))
            if (arr[i].find('ACTIVE_DISTRIBUTED_RECEIVE') != -1):
                arr[i] = 'ACTIVE_DISTRIBUTED_RECEIVE=' + str(data.get('active_receive'))
        res = ""
        for i in range(len(arr)):
            res += arr[i]
            if i < len(arr) - 1:
                res += chr(10)
        print(res)
        open(pathEnv, 'w').close()
        f = open(pathEnv, 'w')
        f.write(res)
        f.close()
        return Response("success", status=status.HTTP_200_OK)
    
class AutoUpdatePassword(APIView):
    def get(self, request):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        autoChangePw = ""
        for item in arr:
            if (item.find('AUTO_CHANGE_PWD_SECONDS') != -1):
                autoChangePw = item
        value = autoChangePw.split("=")
        return HttpResponse(value[1])

class PutAutoUpdatePassword(APIView):
    def put(self, request, seconds=(60 * 60)):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        for i in range(len(arr)):
            if (arr[i].find('AUTO_CHANGE_PWD_SECONDS') != -1):
                arr[i] = 'AUTO_CHANGE_PWD_SECONDS=' + str(seconds)
        res = ""
        for i in range(len(arr)):
            res += arr[i]
            if i < len(arr) - 1:
                res += chr(10)
        print(res)
        open(pathEnv, 'w').close()
        f = open(pathEnv, 'w')
        f.write(res)
        f.close()
        device_scheduler.restart()
        return HttpResponse("Changed seconds auto update password.")

class PauseAutoUpdatePassword(APIView):
    def get(self, request):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        for i in range(len(arr)):
            if (arr[i].find('AUTO_CHANGE_PWD_SECONDS') != -1):
                arr[i] = 'AUTO_CHANGE_PWD_SECONDS=' + str(-1)
        res = ""
        for i in range(len(arr)):
            res += arr[i]
            if i < len(arr) - 1:
                res += chr(10)
        print(res)
        open(pathEnv, 'w').close()
        f = open(pathEnv, 'w')
        f.write(res)
        f.close()
        device_scheduler.restart()
        return HttpResponse("Pause auto update password.")
    
class AutoUpdatePasswordView(APIView):
    def get(self, request):
        try:
            # print("lewl lewlwelwwlew")
            queryset = Devices.objects.all().filter(autoUpdatePasswd=True)
            # print(queryset)
            characters = string.ascii_letters + string.digits
            auto_gen = "clgt123456"
            for device in queryset.iterator():
                autogen_password = ''.join(random.choice(characters) for i in range(15))
                print("Random password is:", autogen_password)
                print("==============================1212")
                serializer = DevicesSerializer(device)
                print("Thiet bi ",serializer.data['id']," dang duoc cap nhat mat khau", )
                telnet_root_dir = "./kc-static-files/build"
                if not os.path.isdir(telnet_root_dir):
                    os.makedirs(telnet_root_dir)
                createFileObject = CreateInfoFile(
                autogen_password, telnet_root_dir)
                createFileObject.do_create_file()

                tasks.publish_message(
                {'type': 'chpasswd',
                'id': serializer.data['id'],
                'ip_agent': serializer.data['ip'],
                'ip_django': os.getenv("LAN_IP"),
                'ip_sock_serv': os.getenv("LAN_SOCKET_SERVER_IP"),
                "username": serializer.data['username'],
                "password": serializer.data['password'],
                "protocol": serializer.data['protocol'],
                "new_password": autogen_password})
            return Response({
                'msg': 'success'
            })
        except Exception as e:
            logging.error(e)
            return Response(data={'status': str(e)}, status=status.HTTP_400_BAD_REQUEST)
