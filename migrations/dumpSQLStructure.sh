#!/usr/bin/env bash
DB_NAME=testDB

LOCAL_USERNAME=root
LOCAL_PASSWORD=$1

AWS_SERVER=aws-db.cidisb0qgnbu.us-east-1.rds.amazonaws.com
AWS_USERNAME=username
AWS_PASSWORD=$1

# Dump schema from locally created testDB
echo "Dumping SQL structure from ${DB_NAME} with user: ${LOCAL_USERNAME}"
mysqldump -u ${LOCAL_USERNAME} -p${LOCAL_PASSWORD} --no-data ${DB_NAME} > schema.sql

# Connect to AWS DB Instance and run SQL dump
echo "Rebuilding remote database ${DB_NAME} with user: ${AWS_USERNAME}"
mysql -h ${AWS_SERVER} -u ${AWS_USERNAME} -p${AWS_PASSWORD} ${DB_NAME} < schema.sql
