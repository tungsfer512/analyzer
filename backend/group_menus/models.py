from django.db import models
from menus.models import Menus
from auth_group.models import AuthGroup

# Create your models here.
class GroupMenus(models.Model):
    menu = models.ForeignKey(Menus, models.CASCADE)
    group = models.ForeignKey(AuthGroup, models.CASCADE)
    

    class Meta:
        db_table = 'group_menus'