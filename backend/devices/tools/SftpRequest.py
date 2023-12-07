import paramiko

class SftpRequest:
    def __init__(self, host, username, password, port):
        self.ssh = paramiko.SSHClient()
        self.ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        self.ssh.connect(host, username=username, password=password, port=port)
        self.sftp_request = self.ssh.open_sftp()

    def upload_file(self, local_path, remote_path):
        self.sftp_request.put(local_path, remote_path)

    def download_file(self, remote_path, local_path):
        self.sftp_request.get(remote_path, local_path)
