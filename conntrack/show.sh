#!/bin/bash
#show.sh -- show the log and put into a log file in datadir/

cnt=0

if [ ! -d datadir ]; then mkdir datadir; fi

while true
do

  let 'cnt = cnt + 1'

  #wait till alog2 is removed 
  while true; do
      if [ ! -e alog2 ]; then break; fi
      sleep 1
  done

  #wait till alog1 and alog2 are created
  # adlog3 is created before alog2
  while true; do
      if [ -e alog2 -a -e alog1 ]; then break; fi
      sleep 1
  done

  #date epoch time string
  str=`date +%s`
  logf=datadir/data${str}.log

  echo
  echo '========================================='
  cnts=`cat alog* | xargs`
  echo -n " lcnt $cnt   alog12 cnt $cnts  $logf   wc "

  echo 'time='$str   >  $logf
  cat adlog3         >> $logf

  wc                    $logf

  sleep 5

done

