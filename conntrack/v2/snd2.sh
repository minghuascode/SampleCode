#!/bin/sh
#snd2.sh -- send conntrack data to server via nc

cnt=0
errcnt=0
port=1234
svr=10.10.10.100

rm /tmp/logtcntdone

while true
do

  let 'cnt = cnt + 1'
  echo $cnt > /tmp/logtcnt
  cat /proc/net/ip_conntrack | nc $svr $port
  if [ $? -eq 0 ]; then 
      let 'errcnt = 0'
  else
      let 'errcnt = errcnt + 1'
      echo error $cnt >> /tmp/logtcntdone
      if [ $errcnt -gt 40 ]; then 
          echo done $cnt >> /tmp/logtcntdone
          break
      fi
  fi
  sleep 15
                        
done
 
