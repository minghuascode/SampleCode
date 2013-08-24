#!/bin/bash
#rcv.sh -- listen on the server

cnt=0
port=1234

while true
do

  let 'cnt = cnt + 1'
  rm alog1 alog2 adlog3 2> /dev/null
  echo $cnt   > alog1
  nc -l $port > adlog3
  echo $cnt   > alog2
  sleep 10

done

