from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from auth_user.views import ResultsSetPagination
from rest_framework import status
from rest_framework import permissions
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from auth_group.models import AuthGroup
from auth_group.serializers import AuthGroupSerializer
from group_menus.models import GroupMenus

def KeySort(e):
    return e["id"]

def add_group_menu(*args, list_id_menus=[]): 
    for x in args:
        id_group = x

    arr = GroupMenus.objects.filter(group_id=id_group).values_list()
    arr = list(arr)
    for index in range(len(arr)): 
        group_menu = get_object_or_404(GroupMenus, id=arr[index][0])
        group_menu.delete()
    for index in range(len(list_id_menus)): 
        data = GroupMenus(group_id=id_group, menu_id=list_id_menus[index])
        data.save()

class ListCreateAuthGroupView(ListCreateAPIView):
    model = AuthGroup
    serializer_class = AuthGroupSerializer
    pagination_class = ResultsSetPagination
    queryset = AuthGroup.objects.all()
    # permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        # Note the use of `get_queryset()` instead of `self.queryset`
        queryset = self.get_queryset()
        if request.query_params.get('name', None) != None:
            queryset = queryset.filter(name=request.query_params['name'])
        serializer = AuthGroupSerializer(queryset, many=True)
        page = int(request.query_params.get('current', 1))
        limit = int(request.query_params.get('limit', 10000))
        total = len(serializer.data)
        start = (page - 1)*limit
        end = min(start + limit, total)
        data = serializer.data
        for index in range(len(serializer.data)):
            group_menu = GroupMenus.objects.filter(group_id=data[index]["id"]).values_list()
            group_menu = list(group_menu)
            menus = []
            for j in range(len(group_menu)):
                menus.append(group_menu[j][1])
            data[index]['menus'] = menus
        data.sort(reverse=True, key=KeySort)
        return JsonResponse({
                'data': data[start:end],
                'total': total
            }, status=status.HTTP_200_OK)


    def create(self, request, *args, **kwargs):
        data = request.data
        list_id_menus = request.data["menus"]
        del data["menus"]
        serializer = AuthGroupSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            arr = AuthGroup.objects.filter(name=data["name"]).values()
            add_group_menu(arr[0]["id"], list_id_menus=list_id_menus)
            return JsonResponse({
                'message': 'Create a new AuthGroup successful!'
            }, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return JsonResponse({
            'message': 'Create a new AuthGroup unsuccessful!'
        }, status=status.HTTP_400_BAD_REQUEST)

class UpdateDeleteAuthGroupView(RetrieveUpdateDestroyAPIView):
    model = AuthGroup
    serializer_class = AuthGroupSerializer
    pagination_class = ResultsSetPagination
    queryset = AuthGroup.objects.all()
    # permission_classes = [permissions.IsAuthenticated]

    def put(self, request, *args, **kwargs):
        group = get_object_or_404(AuthGroup, id=kwargs.get('pk'))
        data = request.data
        list_id_menus = request.data["menus"]
        del data["menus"]
        serializer = AuthGroupSerializer(group, data=data)

        if serializer.is_valid():
            serializer.save()
            add_group_menu(kwargs.get('pk'), list_id_menus=list_id_menus)
            return JsonResponse({
                'message': 'Update AuthGroup successful!'
            }, status=status.HTTP_200_OK)

        return JsonResponse({
            'message': 'Update AuthGroup unsuccessful!'
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        car = get_object_or_404(AuthGroup, id=kwargs.get('pk'))
        car.delete()

        return JsonResponse({
            'message': 'Delete AuthGroup successful!'
        }, status=status.HTTP_200_OK)