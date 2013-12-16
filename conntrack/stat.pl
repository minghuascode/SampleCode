#!/usr/bin/perl -w
#stat.pl

use strict;

my $cfg_debug = 0;
my $cfg_num = 100; # default number to show
my $cfg_start = 0; # default start record number to show
if ( $#ARGV >= 0 ) {
    if ( $ARGV[0] =~ m/\d+/ ) {
        my $n = $ARGV[0];
        if ( $n > 1 && $n < 254 ) {
            $cfg_num = $n;
        }
    }
  if ( $#ARGV >= 1 ) {
    if ( $ARGV[1] =~ m/\d+/ ) {
        my $n = $ARGV[1];
        if ( $n > 1 ) {
            $cfg_start = $n;
        }
    }
  }
}
printf " search number $cfg_num\n";
printf " search start  $cfg_start\n";

my $some_dir = 'datadir';
my @files = ();
{
    opendir(my $dh, $some_dir) || die "can't opendir $some_dir: $!";
    my @infiles = grep { /^[^\.]/ && -f "$some_dir/$_" } readdir($dh);
    closedir $dh;
    @files = sort @infiles;
}

print " num files: ", scalar @files, "\n";

# port 80 and 443 only:
# %conn: { abcd: { starttm: 123, packets: 123, 
#                  srcip: 12, srcport: 3345, dstip: 1.2.3.4, dstport:80, 
#                  state: old/new }
# @stat: [ [time, num_conn, num_old_conn, num_pkt, num_pkt_on_old_conn] ]

my @stat = ();
my %conn = ();

my $nfiles = 0;
my $show_start = 0;
my $show_span = 0;
my $show_time = time;

if ($cfg_start < 100) {
    $show_start = $#files + 1 - $cfg_start ;
    $show_start = 0 if $show_start < 0;
    print " show start at sample $show_start\n";
} else {
    $show_span = int($cfg_start/100) * 60 * 60;
    $show_time -= $show_span;
    print " show start at time $show_time\n";
}

for (my $i = $show_start; $i <= $#files; $i++) {
    my $f = $files[$i];

    if ( $cfg_start >= 100 ) {
        if ( $f =~ m/data(\d+)\.log/ ) {
            my $ftm = $1;
            if ( $ftm < $show_time ) {
                next;
            }
        } else {
            die "wrong file pattern\n";
        } 
    }

    #last if $nfiles >= 12;
    $nfiles ++;

    open (my $fh, "<datadir/$f") || die "can't open $f: $!";
    my @lines = <$fh>;
    close $fh;

    foreach my $k (keys(%conn)) {
        $conn{$k}{state} = "old";
    }

    my %con = ();
    my $tm = "0";

print "\n============================\n" if $cfg_debug;
print "got file $f: ", scalar @lines, "\n" if $cfg_debug;
    foreach my $l (@lines) {
        if ( $l =~ m/time=(\d+)\s*$/ && $tm == "0" ) {
            $tm = $1;
print "got time $tm\n" if $cfg_debug;
        } elsif ( $l =~ m/^tcp\s+\d+\s+\d+\s+\S+\s+(src.*)\s*$/ ) {
          my $r = $1;
          if ( $r =~ m/^src=\d+\.\d+\.\d+\.(\d+) dst=(\d+\.\d+\.\d+\.\d+) sport=(\d+) dport=(\d+)(.*)$/ ){ 
            my ($src, $dst, $spt, $dpt, $rst) = ($1, $2, $3, $4, $5);
print "\ngot line $l\n" if $cfg_debug;
print "got dport $dpt\n" if $cfg_debug;
            if ( $src == $cfg_num && ($dpt == 80 || $dpt == 443) ) {
                my $k = "".$src."_".$dst."_".$spt."_".$dpt;
                my $e = {}; 
                my $pkts = 0; if ( $rst =~ m/ packets.*packets=(\d+)\s+.*$/ ) { $pkts = $1; } 
print "\n**** got key  $k   pkts $pkts\n" if $cfg_debug;
                ${$e}{key} = $k; ${$e}{starttm} = $tm; ${$e}{packets} = $pkts;
                ${$e}{srcip} = $src; ${$e}{srcport} = $spt; ${$e}{dstip} = $dst; ${$e}{dstport} = $dpt;
                $con{$k} = $e;
            }
          }
        }
    }

    my $pktsum = 0;
    my $opktsum = 0;
    foreach my $k (keys(%conn)) {
        if ( exists( $con{$k} ) ) {
            $conn{$k} = $con{$k};
            ${$conn{$k}}{state} = 'new';
            my $pkts = $con{$k}{packets}; $pktsum += $pkts;
            delete $con{$k};
        }
    }
    foreach my $k (keys(%con)) {
            $conn{$k} = $con{$k};
            ${$conn{$k}}{state} = 'new';
            my $pkts = $con{$k}{packets}; $pktsum += $pkts;
            delete $con{$k};
    }

    my $ncon = 0;
    my $oncon = 0;
    foreach my $k (keys(%conn)) {
        if ( $conn{$k}{state} eq 'new' ) {
            $ncon ++;
        } else {
            my $pkts = $conn{$k}{packets}; $opktsum += $pkts;
            $oncon ++;
            delete $conn{$k};
        }
    }

    push @stat, [$tm, $ncon, $oncon, $pktsum, $opktsum];
}

{ my $lastpkts = 0;
  my $lasttm   = 0;
  my $skipt    = 0;
  for ( my $i = 0; $i <= $#stat; $i++ ) {
    my $s = $stat[$i];
    my ($tm, $nc, $onc, $pkts, $opkts) = @{$s};
    my @ltm = localtime $tm;
    $lastpkts = $pkts+$opkts if $lastpkts>$pkts+$opkts;
    $lasttm   = $tm-1 if $lasttm  >$tm-1;
    if ( $nc || $onc || $pkts || $opkts) {
        printf "   ... skipt $skipt ...\n" if $skipt;
        my $tmprt = sprintf "%s %02d-%02d-%02d:%02d:%02d", 
           $tm, $ltm[4]+1, $ltm[3], $ltm[2], $ltm[1], $ltm[0]; 
        printf " %s   %3d(-%3d)   %4d(-%4d)   %6.2f   %2d\n", 
           $tmprt, $nc, $onc, $pkts, $opkts, 
           ($pkts-$lastpkts+$opkts)/($tm-$lasttm), $tm-$lasttm ;
        $skipt = 0;
    } else { 
        $skipt ++;
    }
    $lastpkts = $pkts;
    $lasttm   = $tm;
  }
        printf "   ... skipt $skipt ...\n" if $skipt;
}



