from datetime import datetime
import os
import time
from pcapkit import extract
from scapy.sendrecv import sniff
from scapy.utils import wrpcap
from IoTAnalyzer.env_dev import get_env
import threading
import math
from devices import extract_pcap


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


def cap(inf, pkt_count):
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
            print(
                "=======================[ PHAN TAI ]=>",
                filename,
                "=======================",
            )
            extract_pcap.start_extract(filename)
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


def cpu_bound_task(number, check):
    result = 0
    trace_pcap = get_env("TRACE_PCAP", "false") == "true"
    while trace_pcap and check == True:
        for i in range(number):
            for j in range(number):
                trace_pcap = get_env("TRACE_PCAP", "false") == "true"
                if trace_pcap == False:
                    break
                result += i * j
            if trace_pcap == False:
                break
        result = 0
    return result


def cap_2():
    processes = []
    for i in range(3):
        p = multiprocessing.Process(target=cpu_bound_task, args=(10000000, True))
        p.start()
        processes.append(p)

    phan_tai = get_env("PHAN_TAI", "false") == "false"
    for i in range(9):
        p = multiprocessing.Process(target=cpu_bound_task, args=(10000000, phan_tai))
        p.start()
        processes.append(p)

    for p in processes:
        p.join()
