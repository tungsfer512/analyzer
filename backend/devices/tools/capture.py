from datetime import datetime
import os
import time
from scapy.sendrecv import sniff
from scapy.utils import wrpcap
from IoTAnalyzer.env_dev import get_env

def filename_gen(inf):
    return f"{inf}_{datetime.now().timestamp()}"

def LiveCap(infs, packet_count = 100, time_out = None, protocol_filters = None):
    filename = f'{filename_gen("_".join(infs.split(" ")))}'
    cmd = f'tshark'
    for inf in infs.split(" "):
        cmd += f' -i {inf}'
    if protocol_filters != None and protocol_filters != '':
        for protocol_filter in protocol_filters.split(" "):
            cmd += f' -f {protocol_filter}'
    if time_out != None:
        cmd += f' -a duration:{time_out}'
    cmd += f' -c {packet_count} -F pcap -w ./tmp/{filename}.pcap'
    os.system(cmd)

def cap(inf, pkt_count):
    filename = f'{filename_gen(inf)}'
    trace_pcap = get_env("TRACE_PCAP", "false") == "true"
    while(trace_pcap):
        LiveCap(inf, pkt_count)
        print("=======================[ PCAP ]=>", filename, "=======================")
        trace_pcap = get_env("TRACE_PCAP", "false") == "true"
        time.sleep(2)