from rest_framework.permissions import BasePermission
from dotenv import dotenv_values

class HasAPIKey(BasePermission):
    def has_permission(self, request, view):
        print("HasAPIKey")
        print(request.headers)
        print(request.headers.get('apikey'))
        api_key = request.headers.get('apikey')
        config = dotenv_values("/backend/.env.dev")
        local_api_key = config.get("API_KEY_DJANGO", "")
        if api_key == local_api_key:
            permission = True
            print(permission)
            return True
        return False