import subprocess


class CreateInfoFile:

    def __init__(self, password, tftp_directory_root_path=""):
        self.telnetPass = password
        self.salt = ""
        self.rounds = ""
        self.tftp_directory_root_path = tftp_directory_root_path

    def do_create_file(self):
        telnet_update_pass_command = (
            "openssl passwd -1 -salt .aisoft. " + self.telnetPass)
        hash_newpass = subprocess.check_output(
            [telnet_update_pass_command], shell=True)
        hash_newpass = str(hash_newpass)
        length_hash_newpass = len(hash_newpass)
        hash_newpass = hash_newpass[2:length_hash_newpass-3]
        subprocess.Popen("touch userssh", shell=True).wait
        f = open("userssh", "w")
        f.write("admin:"+hash_newpass+":0:0:root:/:/bin/sh"+"\n" +
                "operator:"+hash_newpass+":0:0:root:/:/bin/sh\n")
        f.close()
        # create usertty
        subprocess.Popen("touch usertty", shell=True).wait
        f = open("usertty", "w")
        f.write("admin:"+hash_newpass+":0:0:root:/:/bin/sh"+"\n" +
                "customer:"+hash_newpass+":200:200:vnpt:/:/bin/sh\n")
        f.close()
        # /var/lib/tftpboot la thu muc cua tftp server
        # subprocess.Popen("mv userssh /var/lib/tftpboot", shell=True).wait
        # subprocess.Popen("mv usertty /var/lib/tftpboot", shell=True).wait

        subprocess.Popen(
            "mv userssh " + self.tftp_directory_root_path, shell=True).wait
        subprocess.Popen(
            "mv usertty " + self.tftp_directory_root_path, shell=True).wait

        pass

    def create_salt(self):
        '''
            TODO: create salt
        '''
        pass

    def do_hash(self):
        '''
            TODO: securely hash the pass with self.rounds and self.salt
        '''
        pass
