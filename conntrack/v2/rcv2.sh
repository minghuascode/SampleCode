#!/bin/sh
#rcv2.sh -- listen on the server

cnt=0
port=1234

if [ ! -d /tmp/ncdata ] ; then mkdir /tmp/ncdata ; fi

while true
do

  let 'cnt = cnt + 1'
  rm /tmp/ncdata/alog1 /tmp/ncdata/alog2 /tmp/ncdata/adlog3 2> /dev/null
  echo $cnt   > /tmp/ncdata/alog1
  netcat -l -w 20 -p $port > /tmp/ncdata/adlog3
  echo $cnt   > /tmp/ncdata/alog2
  sleep 10
            
done

