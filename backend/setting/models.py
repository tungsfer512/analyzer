from django.db import models

# Create your models here.
class Setting(models.Model):
    host_username = models.CharField(max_length=150)
    host_password = models.CharField(max_length=150)
    host_sudo_password = models.CharField(max_length=150)