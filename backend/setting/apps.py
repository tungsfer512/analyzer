from django.apps import AppConfig

class Setting(AppConfig):
    name = 'setting'

    #start device scheduler app
    def ready(self):
        print("Scheduler running ...")
        from .scheduler import device_scheduler
        device_scheduler.start()