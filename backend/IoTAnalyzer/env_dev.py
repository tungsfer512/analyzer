import redis
from dotenv import dotenv_values
import os
import json
from elasticsearch import Elasticsearch, helpers

r = redis.Redis(host='localhost', port=6379, db=0)

def set_env():
    print("=======================SET_ENV=======================")
    r.set("AUTO_CHANGE_PWD_SECONDS", "-1")
    r.set("AUTO_UPDTE_RULE_SECONDS", "-1")
    r.set("AUTO_UPDATE_BLACK_IP_LIST_SECONDS", "-1")
    r.set("AUTO_UPDATE_WHITE_IP_LIST_SECONDS", "-1")
    r.set("AUTO_UPDATE_AGENT_SECONDS", "-1")
    r.set("AUTO_UPDATE_SNORT_SECONDS", "-1")
    r.set("ALERT_SEND_MAIL_SECONDS", "-1")
    r.set("ALERT_SEND_SMS_SECONDS", "-1")
    r.set("ALERT_SEND_TELE_SECONDS", "-1")
    r.set("ALERT_SEND_MAIL_NUMBER", "0")
    r.set("ALERT_SEND_SMS_NUMBER", "0")
    r.set("ALERT_SEND_TELE_NUMBER", "0")
    r.set("ALERT_SEND_MAIL_PERIOD", "10")
    r.set("ALERT_SEND_SMS_PERIOD", "10")
    r.set("ALERT_SEND_TELE_PERIOD", "10")
    r.set("AUTO_SEND_CPU_RAM_ELASTIC_SECONDS", "10")
    r.set("CPU_THRESHOLD", "90")
    r.set("RAM_THRESHOLD", "90")
    r.set("LATENCY_THRESHOLD", "10")
    r.set("ACTIVE_DISTRIBUTED", "true")
    r.set("ACTIVE_DISTRIBUTED_RECEIVE", "true")
    r.set("TRACE_PCAP", "false")
    r.set("USER_SFTP", "foo")
    r.set("PASS_SFTP", "pass")
    r.set("PORT_SFTP", "2222")
    r.set("ANALYZER_ELASTIC", "http://127.0.0.1:9200")
    r.set("ANALYZER_REDIS_HOST", "127.0.0.1")
    r.set("ANALYZER_REDIS_PORT", "6379")
    r.set("ANALYZER_PCAP_NUMBER", "1000")
    r.set("ANALYZER_PCAP_THREAD_NUMBER", "10")
    r.set("ANALYZER_ELASTIC_INDEX", "cpu_ram")
    r.set("ANALYZER_INF", "ens160")
    r.set("ANALYZER_RAM_CPU_SECONDS", "10")
    r.set("ANALYZER_CPU_THRESHOLD", "90")
    r.set("ANALYZER_RAM_THRESHOLD", "90")
    r.set("ANALYZER_ACTIVE_DISTRIBUTED", "true")
    r.set("ANALYZER_ACTIVE_DISTRIBUTED_RECEIVE", "true")
    r.set("CENTER_HOST", "http://222.252.29.85:17774")
    r.set("CENTER_ELASTIC", "http://222.252.29.85:17772")
    r.set("CENTER_REDIS_HOST", "222.252.29.85")
    r.set("CENTER_REDIS_PORT", "16400")
    r.set("CENTER_ELASTIC_INDEX", "cpu_ram")
    r.set("CENTER_RAM_CPU_SECONDS", "10")

def get_env(key, default_value=None):
    value = r.get(key).decode("utf-8")
    if value:
        return value
    else:
        config = dotenv_values("/backend/.env.dev")
        return config.get(key, default_value)

def update_env(key, value):
    r.set(key, value)

def init_data_malware():
    try:
        host=os.environ.get("ELASTIC_HOST")
        es = Elasticsearch(hosts=host)
        query_body = {
            "match": {
                "type_log": "malware"
            }
        }
        res = es.search(index="demo-kc", query= query_body)
        # if (res["hits"]["total"]["value"]) == 0:
        if True:
            print("============================ init malware")
            f = open("/backend/malware_json.json")
            data = f.read()
            helpers.bulk(es, json.loads(data))
            print("============================ init malware")
        else:
            print("khong init malware")
    except Exception as e:
        print(e)