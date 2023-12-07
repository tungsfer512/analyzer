from django.db import models
from auth_user.models import AuthUser
from auth_group.models import AuthGroup

# Create your models here.
class AuthUserGroups(models.Model):
    user = models.ForeignKey(AuthUser, models.CASCADE)
    group = models.ForeignKey(AuthGroup, models.CASCADE)
    

    class Meta:
        managed = False
        db_table = 'auth_user_groups'