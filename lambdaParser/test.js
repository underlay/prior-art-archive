var main = require('./index.js').parseMetaAndInsert;


const sampleEvent = {
    "Records": [
        {
            "eventVersion": "2.0",
            "eventSource": "aws:s3",
            "awsRegion": "us-west-2",
            "eventTime": "2017-05-30T22:48:02.531Z",
            "eventName": "ObjectCreated:Put",
            "userIdentity": {
                "principalId": "A2HRK4T7OWQKNJ"
            },
            "requestParameters": {
                "sourceIPAddress": "10.208.33.170"
            },
            "responseElements": {
                "x-amz-request-id": "B0223A70F05073E1",
                "x-amz-id-2": "819vMSS66aAuqj/YyXU7bgMpmq893dAQ6FkL7KxGiNRUazvDWCcA3n9Vg5zBKxlC"
            },
            "s3": {
                "s3SchemaVersion": "1.0",
                "configurationId": "aa7dfebc-1249-4d4a-bb80-5ca97609f885",
                "bucket": {
                    "name": "pubpub-sftp",
                    "ownerIdentity": {
                        "principalId": "A3ACJPL4SRFGNZ"
                    },
                    "arn": "arn:aws:s3:::pubpub-sftp"
                },
                "object": {
                    "key": "_priorArtArchive/test.PDF",
                    "size": 10300,
                    "eTag": "82b06bf8fe387267407e246567436901",
                    "versionId": "gRF7XuWSJQyAGraT2jfToX7z3k0XJqMy",
                    "sequencer": "00592DF6A2789DD86B"
                }
            }
        }
    ]
};

main(sampleEvent, null, function(err, val) {});
