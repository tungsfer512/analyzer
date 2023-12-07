# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()
    
    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    user = models.ForeignKey(AuthUser, models.CASCADE)
    group = models.ForeignKey(AuthGroup, models.CASCADE)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    user = models.ForeignKey(AuthUser, models.CASCADE)
    permission = models.ForeignKey(AuthPermission, models.CASCADE)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class AuthtokenToken(models.Model):
    key = models.CharField(primary_key=True, max_length=40)
    created = models.DateTimeField()
    user = models.OneToOneField(AuthUser, models.CASCADE)

    class Meta:
        managed = False
        db_table = 'authtoken_token'


class DevicesAlerts(models.Model):
    ip = models.CharField(max_length=20)
    timestamp = models.DateTimeField()
    hash = models.CharField(max_length=50)
    pid = models.CharField(max_length=8)
    message = models.CharField(max_length=200)
    type = models.CharField(max_length=50)
    status = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'devices_alerts'


class DevicesDevices(models.Model):
    ip = models.CharField(unique=True, max_length=20)
    name = models.CharField(max_length=50)
    protocol = models.CharField(max_length=10)
    username = models.CharField(max_length=20)
    password = models.CharField(max_length=20)
    agentinstalled = models.BooleanField(db_column='agentInstalled')  # Field name made lowercase.
    created = models.DateTimeField()
    mac_addr = models.CharField(unique=True, max_length=50, blank=True, null=True)
    status = models.BooleanField()
    tracing_syscall = models.CharField(max_length=10)
    ips = models.JSONField()
    resource_info = models.JSONField()
    avatar = models.CharField(max_length=100)
    arch = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'devices_devices'


class DevicesIntegritycheck(models.Model):
    created = models.DateTimeField()
    message = models.CharField(max_length=1000)
    device_id = models.ForeignKey(DevicesDevices, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'devices_integritycheck'


class DevicesIpstracking(models.Model):
    ip_tracking = models.CharField(max_length=20)
    count = models.IntegerField()
    device = models.ForeignKey(DevicesDevices, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'devices_ipstracking'


class DevicesModelml(models.Model):
    file = models.CharField(max_length=100)
    category = models.CharField(max_length=255)
    version = models.CharField(max_length=20)
    timestamp = models.DateTimeField()
    use = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'devices_modelml'


class DevicesProcesshash(models.Model):
    sha1 = models.CharField(unique=True, max_length=50)
    acc = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'devices_processhash'


class DevicesProcesslist(models.Model):
    process_list = models.JSONField(blank=True, null=True)
    created = models.DateTimeField()
    device_id = models.ForeignKey(DevicesDevices, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'devices_processlist'


class DevicesSyscalllist(models.Model):
    pid = models.CharField(max_length=8)
    syscall = models.CharField(max_length=50)
    params = models.CharField(max_length=200)
    created = models.DateTimeField()
    device_id = models.ForeignKey(DevicesDevices, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'devices_syscalllist'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoCeleryResultsTaskresult(models.Model):
    task_id = models.CharField(unique=True, max_length=255)
    status = models.CharField(max_length=50)
    content_type = models.CharField(max_length=128)
    content_encoding = models.CharField(max_length=64)
    result = models.TextField(blank=True, null=True)
    date_done = models.DateTimeField()
    traceback = models.TextField(blank=True, null=True)
    meta = models.TextField(blank=True, null=True)
    task_args = models.TextField(blank=True, null=True)
    task_kwargs = models.TextField(blank=True, null=True)
    task_name = models.CharField(max_length=255, blank=True, null=True)
    worker = models.CharField(max_length=100, blank=True, null=True)
    date_created = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_celery_results_taskresult'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class GroupsGroup(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200)

    class Meta:
        managed = False
        db_table = 'groups_group'


class SnippetsSnippet(models.Model):
    created = models.DateTimeField()
    title = models.CharField(max_length=100)
    code = models.TextField()
    linenos = models.BooleanField()
    language = models.CharField(max_length=100)
    style = models.CharField(max_length=100)
    highlighted = models.TextField()
    owner = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'snippets_snippet'
