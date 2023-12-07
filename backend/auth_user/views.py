from django.http import JsonResponse
from auth_group.serializers import AuthGroupSerializer
from group_menus.models import GroupMenus
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework import permissions
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth.models import User
from auth_user.models import AuthUser, AuthtokenToken
from auth_group.models import AuthGroup
from auth_user.serializers import AuthUserSerializer
from menus.models import Menus

from auth_user_groups.models import AuthUserGroups
from auth_user_groups.serializers import AuthUserGroupsSerializer

class ResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'limit'
    max_page_size = 1000

def KeySort(e):
    return e["id"]

def add_user_group(*args, list_id_groups=[]): 
    for x in args:
        id_user = x

    arr = AuthUserGroups.objects.filter(user_id=id_user).values_list()
    arr = list(arr)
    for index in range(len(arr)): 
        user_group = get_object_or_404(AuthUserGroups, id=arr[index][0])
        user_group.delete()
    for index in range(len(list_id_groups)): 
        data = AuthUserGroups(user_id=id_user, group_id=list_id_groups[index])
        data.save()
        
class GetCurrentUserInfo(APIView):
    def get(self, request, username):
        print(username)
        # return JsonResponse({
        #         'data': []
        #     }, status=status.HTTP_200_OK)
        current_user = get_object_or_404(AuthUser, username= username)
        list_groups = AuthUserGroups.objects.filter(user_id=current_user.id).values_list()
        list_groups = list(list_groups)
        data = []
        
        print(list_groups)
        for i in range(len(list_groups)):
            item = {}
            queryset = AuthGroup.objects.all()
            item['group'] = {}
            arr = AuthGroupSerializer(queryset, many=True)
            for j in range(len(arr.data)):
                if (arr.data[j]['id'] == list_groups[i][2]):
                    item['group']['id'] = arr.data[j]['id']
                    item['group']['name'] = arr.data[j]['name']
            group_menu = GroupMenus.objects.filter(group_id=list_groups[i][2]).values_list()
            group_menu = list(group_menu)
            menus = []
            for j in range(len(group_menu)):
                menu = get_object_or_404(Menus, id=group_menu[j][1])
                print(menu.code)
                menus.append(menu.code)
            item['menus'] = menus
            data.append(item)
            print(item)
        print(data)
        return JsonResponse({
                'data': data
            }, status=status.HTTP_200_OK)

class ListCreateAuthUserView(ListCreateAPIView):
    model = AuthUser
    serializer_class = AuthUserSerializer
    # permission_classes = [permissions.IsAuthenticated]
    queryset = AuthUser.objects.all()
    pagination_class = ResultsSetPagination

    def list(self, request):
        print(request.query_params)
        # Note the use of `get_queryset()` instead of `self.queryset`
        queryset = self.get_queryset()
        if request.query_params.get('username', None) != None:
            queryset = queryset.filter(username=request.query_params['username'])
        if request.query_params.get('first_name', None) != None:
            queryset = queryset.filter(first_name=request.query_params['first_name'])
        if request.query_params.get('last_name', None) != None:
            queryset = queryset.filter(last_name=request.query_params['last_name'])
        if request.query_params.get('email', None) != None:
            queryset = queryset.filter(email=request.query_params['email'])
        serializer = AuthUserSerializer(queryset, many=True)
        page = int(request.query_params.get('current', 1))
        limit = int(request.query_params.get('limit', 10000))
        total = len(serializer.data)
        start = (page - 1)*limit
        end = min(start + limit, total)
        data = serializer.data
        # print(data[41])
        # user_groups = AuthUserGroups.objects.filter(user_id=data[41]["id"]).values_list()
        # user_groups = list(user_groups)
        # print(user_groups)
        for index in range(len(serializer.data)):
            user_groups = AuthUserGroups.objects.filter(user_id=data[index]["id"]).values_list()
            user_groups = list(user_groups)
            groups = []
            for j in range(len(user_groups)):
                groups.append(user_groups[j][2])
            data[index]['groups'] = groups
            # print(user_groups)
        print(data)
        data.sort(reverse=True, key=KeySort)
        return JsonResponse({
                'data': data[start:end],
                'total': total
            }, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        data = request.data
        list_id_groups = request.data["groups"]
        del data["groups"]
        # data["password"] =pbkdf2_sha256.hash(data["password"])
        # data["password"] = data["password"][1:]
        try:
            serializer = AuthUserSerializer(data=data)
        except Exception as error:
            print(error)
        if serializer.is_valid():
            serializer.save()
            user = User.objects.get(username = data["username"])
            user.set_password(data["password"])
            user.save()
            arr = AuthUser.objects.filter(username=data["username"]).values()
            add_user_group(arr[0]["id"], list_id_groups=list_id_groups)

            return JsonResponse({
                'message': 'Create a new AuthUser successful!'
            }, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return JsonResponse({
            'message': 'Create a new AuthUser unsuccessful!'
        }, status=status.HTTP_400_BAD_REQUEST)

class UpdateDeleteAuthUserView(RetrieveUpdateDestroyAPIView):
    model = AuthUser
    serializer_class = AuthUserSerializer
    queryset = AuthUser.objects.all()
    # permission_classes = [permissions.IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user = get_object_or_404(AuthUser, id=kwargs.get('pk'))
        data = request.data
        list_id_groups = request.data["groups"]
        del data["groups"]
        print(data)
        serializer = AuthUserSerializer(user, data=data)
        if serializer.is_valid():
            serializer.save()
            add_user_group(kwargs.get('pk'), list_id_groups=list_id_groups)
            return JsonResponse({
                'message': 'Update AuthUser successful!'
            }, status=status.HTTP_200_OK)
        print(serializer.errors)
        return JsonResponse({
            'message': 'Update AuthUser unsuccessful!'
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        print(request)
        user = get_object_or_404(AuthUser, id=kwargs.get('pk'))
        print(user)
        # auth_token_user = get_object_or_404(AuthtokenToken, user_id=kwargs.get('pk'))
        # print(auth_token_user)
        # auth_token_user.delete()
        user.delete()

        return JsonResponse({
            'message': 'Delete AuthUser successful!'
        }, status=status.HTTP_200_OK)