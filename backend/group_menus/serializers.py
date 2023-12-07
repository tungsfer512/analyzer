from rest_framework import serializers 
from group_menus.models import GroupMenus
 
 
class GroupMenusSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = GroupMenus
        fields = ('id',
                  'menu_id',
                  'group_id')