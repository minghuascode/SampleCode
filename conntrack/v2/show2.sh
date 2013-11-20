#!/bin/sh
#show2.sh -- show the log filtered result

srcaddr='src=10.10.10.10'

cnt=0
ocnt=0

if [ ! -d /tmp/ncdata ]; then mkdir /tmp/ncdata; fi

while true
do

  let 'cnt = cnt + 1'
  datestr=`date +"m%md%d"`
  minstr=`date +"%M"`
  if [ $minstr -eq 0 ]; then ocnt=0; fi
  let 'ocnt = ocnt + 1'

  #wait till alog2 is removed 
  while true; do
      if [ ! -e /tmp/ncdata/alog2 ]; then break; fi
      sleep 1
  done

  #wait till alog1 and alog2 are created
  # adlog3 is created before alog2
  while true; do
      if [ -e /tmp/ncdata/alog2 -a -e /tmp/ncdata/alog1 ]; then break; fi
      sleep 1
  done

  #date epoch time string
  str=`date`
  grep 'tcp' /tmp/ncdata/adlog3 | grep $srcaddr > /tmp/ncdata/sumtmp
  n=`cat /tmp/ncdata/sumtmp | wc -l`

  ocnt=$((ocnt%30))
  if [ $ocnt -eq 1 ] ; then
      echo >> /tmp/ncdata/sum$datestr
      printf " %d  %s " $cnt "$str" >> /tmp/ncdata/sum$datestr
      printf " %3d" $n >> /tmp/ncdata/sum$datestr
  else
      printf " %3d" $n >> /tmp/ncdata/sum$datestr
  fi

  grep $datestr /www/sum.html > /dev/null 2>&1
  if [ $? -ne 0 ]; then
      echo '<p>'"<a href=sum$datestr.txt"'>'" sum$datestr.txt </a"'></p>' >> /www/sum.html
      ln -s /tmp/ncdata/sum$datestr /www/sum$datestr.txt
  fi

  sleep 50

done

