from datetime import datetime
import os
import time
from pcapkit import extract
from scapy.sendrecv import sniff
from scapy.utils import wrpcap
from IoTAnalyzer.env_dev import get_env, update_env
import threading
import math
from devices import extract_pcap
import json
import redis


def filename_gen(inf):
    return f"{inf}_{datetime.now().timestamp()}"


def LiveCap(
    infs, packet_count=100, time_out=None, protocol_filters=None, filename=None
):
    cmd = f"tshark"
    for inf in infs.split(" "):
        cmd += f" -i {inf}"
    if protocol_filters != None and protocol_filters != "":
        for protocol_filter in protocol_filters.split(" "):
            cmd += f" -f {protocol_filter}"
    if time_out != None:
        cmd += f" -a duration:{time_out}"
    cmd += f" -c {packet_count} -F pcap -w ./tmp/{filename}.pcap"
    os.system(cmd)


def ham_phan_tai(filename, ip):
    # phan_tai = get_env("PHAN_TAI", "false") == "true"
    # while(phan_tai):
    #     entries = os.listdir("./tmp")
    #     print(entries)
    #     files = [entry for entry in entries if (os.path.isfile(f"./tmp/{entry}") and entry != ".gitkeep")]
    #     print("=======================[ Start tim file ]=>", files, "=======================")
    #     if len(files) > 0:
    #         file = files[0]
    #         print("=======================[ XU LY ]=>", file, "=======================")
    #         os.system(f"sshpass -p CSrcGNXnnv6U scp -o StrictHostKeyChecking=no ./tmp/{file} ubuntu@192.168.10.73:/home/ubuntu/Desktop/datn-tung/analyzer/backend/tmp")
    #         print("=======================[ PCAP TO JSON ]=>", file, "=======================")
    #         os.remove(f"./tmp/{file}")
    #     phan_tai = get_env("PHAN_TAI", "false") == "true"
    #     time.sleep(10)
    # # sftp = SftpRequest.SftpRequest("192.168.10.73", "foo", "pass", "2222")
    # # sftp.download_file("/home/ubuntu/Desktop/datn-tung/analyzer/abc.xxx", "./tmp/abc.axxx")
    # time.sleep(30)
    print("________________DA PHAN TAI DEN", ip)
    # update_env("PHAN_TAI_NGUONG", "false")


def cap(inf, pkt_count):
    r = redis.Redis(host="localhost", port=6379, db=0)
    trace_pcap = get_env("TRACE_PCAP", "false") == "true"

    while trace_pcap:
        filename = f'{filename_gen("_".join(inf.split(" ")))}'
        print("=======================[ PCAP ]=>", filename, "=======================")
        LiveCap(infs=inf, packet_count=pkt_count, filename=filename)
        trace_pcap = get_env("TRACE_PCAP", "false") == "true"
        print(
            "=======================[ PCAP DONE]=>", filename, "======================="
        )
        # time.sleep(3)
        # extract_pcap.start_extract(filename)
        phan_tai = get_env("PHAN_TAI", "false") == "true"
        if phan_tai == True:
            list_ana = json.loads(r.get("list_analyzer").decode())
            ip = list_ana[0].get("ip")
            print(
                "=======================[ PHAN TAI ]=>",
                filename,
                "=======================",
            )
            threading.Thread(target=ham_phan_tai, args=(filename, ip)).start()
        else:
            print(
                "=======================[ TU XU LY]=>",
                filename,
                "=======================",
            )
            threading.Thread(
                target=extract_pcap.start_extract, args=(filename,)
            ).start()
        # time.sleep(5)


import multiprocessing


def cpu_bound_task(number):
    result = 0
    trace_pcap = get_env("TRACE_PCAP", "false") == "true"
    while trace_pcap:
        for i in range(number):
            for j in range(number):
                trace_pcap = get_env("TRACE_PCAP", "false") == "true"
                if trace_pcap == False:
                    break
                result += i * j
            if trace_pcap == False:
                break
        result = 0

def cpu_bound_task_2(number):
    result = 0
    trace_pcap = get_env("TRACE_PCAP", "false") == "true"
    phan_tai_nguong = get_env("PHAN_TAI_NGUONG", "false") == "false"
    while trace_pcap == True and phan_tai_nguong == True:
        for i in range(number):
            for j in range(number):
                trace_pcap = get_env("TRACE_PCAP", "false") == "true"
                phan_tai_nguong = get_env("PHAN_TAI_NGUONG", "false") == "false"
                if trace_pcap == False or phan_tai_nguong == False:
                    break
                result += i * j
            if trace_pcap == False or phan_tai_nguong == False:
                break
        result = 0

def cap_2():
    processes = []
    for _ in range(3):
        p = multiprocessing.Process(target=cpu_bound_task, args=(10000000,))
        p.start()
        processes.append(p)

    for _ in range(9):
        p = multiprocessing.Process(target=cpu_bound_task_2, args=(10000000,))
        p.start()
        processes.append(p)

    for p in processes:
        p.join()
