from pcapkit import extract
import os
import time
from datetime import datetime
from IoTAnalyzer.env_dev import get_env, update_env

def start_extract(filename):
    print("=======================[ XU LY ]=>", filename, "=======================")
    extract(f"./tmp/{filename}.pcap", f"./tmp/extract/{filename}.json", format="json")
    print("=======================[ PCAP TO JSON ]=>", filename, "=======================")
    os.remove(f"./tmp/{filename}.pcap")
