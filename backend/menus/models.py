from django.db import models

# Create your models here.
class Menus(models.Model):
    name = models.CharField(max_length=150)
    code = models.CharField(unique=True, max_length=150)
    code_parent = models.CharField(max_length=150)

    class Meta:
        db_table = 'menus'