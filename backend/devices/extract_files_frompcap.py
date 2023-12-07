import typing
from json.tool import main
import sys
from warnings import catch_warnings
import textract
from  time import time
import re
import distro 
from shutil import which
import os
import logging
import datetime
from datetime import timezone
from elasticsearch import Elasticsearch

    
class ExtracPDF:
    
    def __init__(self) -> None:
        pass
    
    def is_tool():
    # """Check whether `name` is on PATH and marked as executable."""
        check_distro = True if distro.id() == "ubuntu" else False
        if which("tshark") and check_distro:
            # logging.info('[Checked]Tshark already installed in Ubuntu distro!') 
            print('[Checked]Tshark already installed in Ubuntu distro!') 
        else:
            # logging.info('Please install tshark before using this tool!')
            # logging.info('run : sudo apt install tshark -y')
            print('Please install tshark before using this tool!')
            print('run : sudo apt install tshark -y')
            sys.exit()
            
    def extract(pcap_path:str, dir:str, protocol: str):
        extracted_dir = f'{dir}/file_save_from_pcap'
        try:
            os.system(f'mkdir {extracted_dir}')
        except:
            print("")
        dir_name = str(int(time()))
        command = f'tshark -Q -r {pcap_path} --export-objects "{protocol},{extracted_dir}"'
        os.system(command)
        Non_PDF = f'{dir}/{dir_name}/files'
        PDF = f'{dir}/{dir_name}/files.pdf'
        if os.path.exists(Non_PDF):
            os.rename(Non_PDF, PDF)
            return PDF
        return None

import os
import shutil   
def extract_allFolder(pathfile):
    PDF = ExtracPDF.extract(pathfile, "/backend/media", "http")
    os.remove(pathfile)
    # shutil.move(pathfile,"Pcap_readed/")
    return None

# if __name__ == "__main__":
#     extract_allFolder("Pcap_examples/DOC_download.pcap")

    

