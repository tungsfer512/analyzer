from pcapkit import extract
import os
import time
from IoTAnalyzer.env_dev import get_env, update_env

def start_extract():
    print("++++++++++++++++++++++++++++++++++++EXTRACT")
    phan_tai = get_env("PHAN_TAI", "false") == "true"
    while(phan_tai):
        entries = os.listdir("./tmp")
        print(entries)
        files = [entry for entry in entries if (os.path.isfile(f"./tmp/{entry}") and entry != ".gitkeep")]
        print("=======================[ Start tim file ]=>", files, "=======================")
        if len(files) > 0:
            file = files[0]
            print("=======================[ XU LY ]=>", file, "=======================")
            time.sleep(30)
            print("=======================[ PCAP TO JSON ]=>", file, "=======================")
            os.remove(f"./tmp/{file}")
        phan_tai = get_env("PHAN_TAI", "false") == "true"
        time.sleep(2)


