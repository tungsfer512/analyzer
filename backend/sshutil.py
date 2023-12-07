import paramiko
import socket
import logging
import re
import logging
import time
import os
logger = logging.getLogger(__name__)


class SshClient():
    def __init__(self,):
        self.ssh = paramiko.SSHClient()
        self.login = False
        self.transport = None
        self.channel = None

    def login_host_by_ssh(self, host_ip, username, password, port=22):
        logger.info(f'Loging in. {host_ip} {username} {password} {port}')
        try:
            self.ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            self.ssh.connect(host_ip.encode('ascii'), username=username.encode('ascii'),
                             password=password.encode('ascii'), port=port, timeout=60, banner_timeout=60)

            self.transport = self.ssh.get_transport()
            self.channel = self.transport.open_session()

        except(socket.timeout):
            logger.error(f'SSH to {host_ip} TIMEOUT!')
            return False
        return True
    
    def logout_host(self):
        self.channel.close()

    def scan_mac_device(self, subnet, interface, password):
        try:
            command = (f"sudo arp-scan --interface {interface} {subnet} --retry=8 -x -g -q -r 8 > /tmp/data_kc_scan_device.txt").encode()
            print(command)
            a = self.channel.exec_command(command)
            exit_status = self.channel.recv_exit_status()
            print("CHECK command!!!", exit_status, a)
            return True
        except Exception as e:
            logger.error(e)
            return False


    