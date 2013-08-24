#!/bin/sh
#snd.sh -- send conntrack data to server via nc

cnt=0
port=1234
svr=10.10.10.10

while true
do

  let 'cnt = cnt + 1'
  echo $cnt > /tmp/logtcnt
  cat /proc/net/ip_conntrack | nc $svr $port
  if [ $? -eq 0 ]; then 
    sleep 15
  else
    echo $cnt > /tmp/logtcntdone
    break
  fi

done

