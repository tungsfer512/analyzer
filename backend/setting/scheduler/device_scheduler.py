from apscheduler.schedulers.background import BackgroundScheduler
from devices.views import send_cpu_ram_to_local_elastic, send_cpu_ram_to_local_redis, send_cpu_ram_to_center_elastic, send_cpu_ram_to_center_redis, get_best_analyzer
from IoTAnalyzer.env_dev import get_env

#create scheduler that auto change password
scheduler = BackgroundScheduler()

def start():
    sec = int(get_env("ANALYZER_RAM_CPU_SECONDS", "10"))
    print('start scheduler interval time:', sec, type(sec))
    scheduler.add_job(send_cpu_ram_to_local_elastic, "interval", seconds = sec, id = "send_cpu_ram_to_local_elastic", replace_existing = True, timezone="Asia/Ho_Chi_Minh")
    scheduler.add_job(send_cpu_ram_to_local_redis, "interval", seconds = sec, id = "send_cpu_ram_to_local_redis", replace_existing = True, timezone="Asia/Ho_Chi_Minh")
    scheduler.add_job(send_cpu_ram_to_center_elastic, "interval", seconds = sec, id = "send_cpu_ram_to_center_elastic", replace_existing = True, timezone="Asia/Ho_Chi_Minh")
    scheduler.add_job(send_cpu_ram_to_center_redis, "interval", seconds = sec, id = "send_cpu_ram_to_center_redis", replace_existing = True, timezone="Asia/Ho_Chi_Minh")
    scheduler.add_job(get_best_analyzer, "interval", seconds = sec, id = "get_best_analyzer", replace_existing = True, timezone="Asia/Ho_Chi_Minh")
    print(scheduler.get_jobs())
    scheduler.start()

# def restart():
#     print(scheduler.running)
#     if scheduler.running == True:
#         print("pause scheduler")
#         scheduler.pause()
#     devices = DevicesViewSet()
#     contents = Path('./.env.dev').read_text()
#     arr = contents.split(chr(10))
#     autoChangePw = "-1"
#     autoUpdateRule = "-1"
#     autoUpdateWhiteList = "-1"
#     autoUpdateBlackList = "-1"
#     autoUpdateAgent = "-1"
#     autoUpdateSnort = "-1"
#     for item in arr:
#         if (item.find('AUTO_CHANGE_PWD_SECONDS') != -1):
#             autoChangePw = item.split("=")[1]
#         if (item.find('AUTO_UPDTE_RULE_SECONDS') != -1):
#             autoUpdateRule = item.split("=")[1]
#         if (item.find('AUTO_UPDATE_WHITE_IP_LIST_SECONDS') != -1):
#             autoUpdateWhiteList = item.split("=")[1]
#         if (item.find('AUTO_UPDATE_BLACK_IP_LIST_SECONDS') != -1):
#             autoUpdateBlackList = item.split("=")[1]
#         if (item.find('AUTO_UPDATE_AGENT_SECONDS') != -1):
#             autoUpdateAgent = item.split("=")[1]
#         if (item.find('AUTO_UPDATE_SNORT_SECONDS') != -1):
#             autoUpdateSnort = item.split("=")[1]

#     scheduler.remove_all_jobs()
#     if autoChangePw != "-1":
#         scheduler.add_job(devices.auto_update_password, "interval", seconds = int(autoChangePw), id = "device_sched_01", replace_existing = True)
#     if autoUpdateRule != "-1":
#         scheduler.add_job(devices.auto_update_rule_snort, "interval", seconds = int(autoUpdateRule), id = "device_sched_02", replace_existing = True)
#     if autoUpdateWhiteList != "-1":
#         scheduler.add_job(WhiteListIPView.auto_update_white_list, "interval", seconds=int(autoUpdateWhiteList), id = "device_sched_03", replace_existing = True)
#     if autoUpdateBlackList != "-1":
#         scheduler.add_job(BlackListIPView.auto_update_black_list, "interval", seconds=int(autoUpdateBlackList), id = "device_sched_04", replace_existing = True)
#     if autoUpdateAgent != "-1":
#         scheduler.add_job(AutoupdateAgentView.auto_update_agent, "interval", seconds=int(autoUpdateAgent), id = "device_sched_05", replace_existing = True)
#     if autoUpdateSnort != "-1":
#         scheduler.add_job(AutoUpdateSnortView.auto_update_snort, "interval", seconds=int(autoUpdateSnort), id = "device_sched_06", replace_existing = True)
#     print(scheduler.get_jobs())
#     if autoChangePw == "-1" and autoUpdateRule == "-1" and autoUpdateWhiteList == "-1" and autoUpdateBlackList == "-1" and autoUpdateAgent == "-1" and autoUpdateSnort == "-1":
#         print("Don't have any job to start or resume")
#         return
#     if scheduler.running == False:
#         print("start scheduler")
#         scheduler.start()
#         return
#     print("resume scheduler")
#     scheduler.resume()
