# Prior Art Archive

This repo contains all of the code powering the Prior Art Archive.

The project is broken into several smaller functions which form the heirarchy of our folder structure:

- `/site`: Code for the user-facing frontend
- `/clientApi`: Node API using for logins, and other front-end actions
- `/searchApi`: Java API for interfacing with Elasticsearch
- `/lambdaListener`: AWS Lambda function for handling new files created by the SFTP server

Each subdirectory has it's own development and deployment instructions. 