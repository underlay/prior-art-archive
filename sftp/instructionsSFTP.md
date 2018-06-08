# SFTP Setup Instructions

Launch instance with Ubuntu Server 16.04 LTS (HVM), SSD Volume Type - ami-0def3275

```
sudo apt-get update
sudo apt-get install automake autotools-dev g++ git libcurl4-gnutls-dev libfuse-dev libssl-dev libxml2-dev make pkg-config proftpd

git clone https://github.com/s3fs-fuse/s3fs-fuse.git
cd s3fs-fuse
./autogen.sh
./configure
make
sudo make install

cd ..

// Replace the following with the real key_id and access_key.
echo <AWS_ACCESS_KEY_ID>:<AWS_SECRET_ACCESS_KEY> > s3Credentials

chmod 600 s3Credentials 

mkdir bucket

sudo vim /etc/fuse.conf
        user_allow_other

s3fs prior-art-archive-sftp ./bucket -o passwd_file=s3Credentials -o enable_noobj_cache -o stat_cache_expire=30 -o enable_content_md5 -o allow_other -o nonempty
```

```
sudo vim /etc/proftpd/proftpd.conf
```

Change `/etc/proftpd/proftpd.conf` to have the following proprties

```
ServerName  "52.90.222.110"	
DefaultRoot  ~
Port 2222
# MasqueradeAddress               ec2-35-165-203-247.us-west-2.compute.amazonaws.com
User                            ubuntu
Group                           admin
AuthOrder                       mod_auth_file.c mod_auth_unix.c
AuthUserFile                    /etc/proftpd/ftpd.passwd
```

```
sudo vim /etc/proftpd/conf.d/sftp.conf
```

Change `/etc/proftpd/conf.d/sftp.conf` to have the following
```
<IfModule mod_sftp.c>

        SFTPEngine on
        Port 2222
        SFTPLog /var/log/proftpd/sftp.log

        # Configure both the RSA and DSA host keys, using the same host key
        # files that OpenSSH uses.
        SFTPHostKey /etc/ssh/ssh_host_rsa_key
        SFTPHostKey /etc/ssh/ssh_host_dsa_key

        SFTPAuthMethods password

        # Enable compression
        SFTPCompression delayed

</IfModule>
```

```
mkdir /home/ubuntu/bucket/cisco

// the uid must match the uid of a unix account that has write permissions. In this case, the ubuntu account.
sudo ftpasswd --passwd --file=/etc/proftpd/ftpd.passwd --home=/home/ubuntu/bucket/cisco --name=cisco --shell=/bin/sh --uid=1000

sudo chown -R ubuntu /etc/proftpd/
sudo chown -R ubuntu /var/log/proftpd/
sudo chown -R ubuntu /etc/ssh/

sudo service proftpd restart

sudo vim /etc/ssh/sshd_config
```

Change `/etc/ssh/sshd_config` to have the following line commented
```
# Subsystem sftp /usr/lib/openssh/sftp-server
```

```
sudo service ssh restart
```

Assign to launch-wizard-2 security group. See securityGroupRules.png for the setting on this group.


In the AWS EC2 Dashboard, go Network Security>Elastic IPs and make sure the elastic IP is allocated to the specified instance.


To Debug and view logs: 
`proftpd -nd10`

To syntax check proftpd conf:
`proftpd -td10`

Sometimes the s3fs connection disconnects (on system restart and certain errors). So you need to rerun the line above 's3fs prior-art-archive-sftp...' to make sure the bucket folder is connected. Check the /bucket folder to see if this is the case or not.

`sudo umount bucket`

`netstat -tulpn`

## Helpful Links

[http://petitnote.unices.org/how-to-create-a-s3-backed-ftp/](http://petitnote.unices.org/how-to-create-a-s3-backed-ftp/)

[http://www.codechewing.com/library/setup-sftp-proftp-on-ubuntu-web-server/](http://www.codechewing.com/library/setup-sftp-proftp-on-ubuntu-web-server/)

[https://serverfault.com/questions/677083/how-can-i-set-up-an-sftp-server-backed-by-s3-or-similar](https://serverfault.com/questions/677083/how-can-i-set-up-an-sftp-server-backed-by-s3-or-similar)
