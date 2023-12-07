from django.db.models.query import QuerySet
from rest_framework.parsers import JSONParser
from rest_framework.decorators import parser_classes
from rest_framework.decorators import api_view
from rest_framework.decorators import api_view, parser_classes
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.db.models.query_utils import Q
from django.db.models.signals import post_save
from django.http import Http404, response
from requests.api import request
from rest_framework import serializers, views
from django.core import serializers
from devices import tasks
from django.http import HttpResponse
from rest_framework import status
# from devices.scanner import arp_scan
from rest_framework.response import Response
from rest_framework.views import APIView
from logging import log, raiseExceptions
from rest_framework import permissions, generics
# from devices.serializers import AddProcessListWithIPSerializer, DevicesSerializer, IntegrityCheckSerializer, ProcessHashSerializer, ProcessListSerializer, SyscallListSerializer, UpdateDeviceSerializer, AlertsSerializer, UpdateIPFrequencySerializer, UpdateDeviceTelnetPasswordSerializer, UpLoadImageSerializer, FileExampleSerializer   , ModelMachineLearningSerializer,IpsTrackingSerializer, AddCountIpsTrackingSerializer
# from devices.models import Devices, Alerts, IntegrityCheck, ProcessHash, ProcessList, SyscallList, SyscallListSerializerCustom, save_syscall , ModelML, IpsTracking
from django.shortcuts import render
from rest_framework import viewsets
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.core.paginator import Paginator
from django.db.models.signals import post_save
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.parsers import FormParser, MultiPartParser, JSONParser, FileUploadParser
import os
import logging
import subprocess
import json
import string
import random
logger = logging.getLogger(__name__)
import re
import subprocess
import requests
from packaging import version
import io
from django.http import FileResponse
from reportlab.pdfgen import canvas
import xlsxwriter
from io import BytesIO
from django.http import HttpResponse
from pathlib import Path
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.authtoken.models import Token
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        ## This data variable will contain refresh and access tokens
        data = super().validate(attrs)
        token = Token.objects.get( user_id = self.user.id)
        ## You can add more User model's attributes like username,email etc. in the data dictionary like this.
        data['user_name'] = self.user.username
        data['email'] = self.user.email
        data['id'] = self.user.id
        data['auth_token'] = str(token)
        return data
        

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
