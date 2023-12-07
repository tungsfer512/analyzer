from django.contrib.auth.models import User
from rest_framework import serializers 
from auth_user.models import AuthUser
 
 
class AuthUserSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = AuthUser
        fields = ('id',
                  'password',
                  'last_login',
                  'is_superuser',
                  'username',
                  'first_name',
                  'last_name',
                  'email',
                  'is_staff',
                  'is_active',
                  'date_joined')
    def create(self, data):
        user = User(
            username=data['username'],
            password=data['password'],
            last_login=data['last_login'],
            is_superuser=data['is_superuser'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            is_staff=data['is_staff'],
            is_active=data['is_active'],
            date_joined=data['date_joined'],
        )
        user.set_password(data["password"])
        user.save()
        print(user)
        return user