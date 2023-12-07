from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from auth_user.views import ResultsSetPagination
from rest_framework import status
from rest_framework import permissions
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from menus.models import Menus
from menus.serializers import MenusSerializer

def KeySort(e):
    return e["id"]

class ListCreateMenusView(ListCreateAPIView):
    model = Menus
    serializer_class = MenusSerializer
    pagination_class = ResultsSetPagination
    queryset = Menus.objects.all()
    # permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        # Note the use of `get_queryset()` instead of `self.queryset`
        queryset = self.get_queryset()
        if request.query_params.get('name', None) != None:
            queryset = queryset.filter(name=request.query_params['name'])
        if request.query_params.get('code', None) != None:
            queryset = queryset.filter(code=request.query_params['code'])
        if request.query_params.get('code_parent', None) != None:
            queryset = queryset.filter(code_parent=request.query_params['code_parent'])
        serializer = MenusSerializer(queryset, many=True)
        page = int(request.query_params.get('current', 1))
        limit = int(request.query_params.get('limit', 10000))
        total = len(serializer.data)
        start = (page - 1)*limit
        end = min(start + limit, total)
        data = serializer.data
        data.sort(reverse=True, key=KeySort)
        return JsonResponse({
                'data': data[start:end],
                'total': total
            }, status=status.HTTP_200_OK)


    def create(self, request, *args, **kwargs):
        serializer = MenusSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return JsonResponse({
                'message': 'Create a new Menus successful!'
            }, status=status.HTTP_201_CREATED)

        return JsonResponse({
            'message': 'Create a new Menus unsuccessful!'
        }, status=status.HTTP_400_BAD_REQUEST)

class UpdateDeleteMenusView(RetrieveUpdateDestroyAPIView):
    model = Menus
    queryset = ''
    serializer_class = MenusSerializer
    pagination_class = ResultsSetPagination
    # permission_classes = [permissions.IsAuthenticated]

    def put(self, request, *args, **kwargs):
        car = get_object_or_404(Menus, id=kwargs.get('pk'))
        serializer = MenusSerializer(car, data=request.data)

        if serializer.is_valid():
            serializer.save()

            return JsonResponse({
                'message': 'Update Menus successful!'
            }, status=status.HTTP_200_OK)

        return JsonResponse({
            'message': 'Update Menus unsuccessful!'
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        car = get_object_or_404(Menus, id=kwargs.get('pk'))
        car.delete()

        return JsonResponse({
            'message': 'Delete Menus successful!'
        }, status=status.HTTP_200_OK)