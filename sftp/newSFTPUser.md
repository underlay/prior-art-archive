# Creating a new user for PriorArtArchive

We need to 
- create their Company account on prior-art-archive api
	- Add it to the postgres db connected to the API. The slug must be the same as the username and bucket name on the sftp server

- create their sftp account on the ec2 server

```
cd /home/ubuntu/bucket
mkdir cisco
sudo ftpasswd --passwd --file=/etc/proftpd/ftpd.passwd --home=/home/ubuntu/bucket/cisco --name=cisco --shell=/bin/sh --uid=1000
```

- Add a trigger to AWS Lambda for their prefix
