#!/bin/bash -xe

DB="`basename $PWD`"
MONGO_URL=mongodb://localhost:27017/$DB meteor $1 $2 $3 $4

# 00491751587118
