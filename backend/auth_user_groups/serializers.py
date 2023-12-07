from rest_framework import serializers 
from auth_user_groups.models import AuthUserGroups
 
 
class AuthUserGroupsSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = AuthUserGroups
        fields = ('id',
                  'user_id',
                  'group_id')