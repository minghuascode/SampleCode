#!/usr/bin/perl -w
#whosip.pl

use strict;

my %ipmap = ();
my %baseip = ();
my @allip = ();

while(<>) {
    my $line = $_;
    chomp($line);
    if ( $line =~ m/^tcp\s+\d+\s+\d+\s+\w+\s+src=(\d+\.\d+\.\d+\.\d+)\s+dst=(\d+\.\d+\.\d+\.\d+)\s+sport.*/ ) {
        my $dst = $2;
        push @allip, $dst;
    } else {
        print "Error: Unknown line\n";
    }
}

print "\n";
foreach my $i (@allip) {
    printf " %16s ", $i;
    my $cmd = "whois $i";
    if ( exists ( $ipmap{$i} ) ) {
        my $transostr = "";
        $transostr = $ipmap{$i};
        printf "  %s\n", $transostr;
    } else {
        my @rlines = ` $cmd `;
        my $transostr = "";
        $transostr = whotranslate( @rlines );
        $ipmap{$i} = $transostr;
        printf " +%s\n", $transostr;
    }
}

exit 0;


    sub whotranslate {
        my @linesin = @_;
        my $state = 0;
        my $foundrange = 0;
        my $foundname  = 0;
        my $retl = "";
        foreach my $line (@linesin) {
            chomp($line);
            if ( $state == 0 ) {
                if ( $line =~ m/\[[r]?whois\.((\w|\.)+)\.(net|com)\]/ ) {
                    my $w = $1;
                    if ( $w eq "arin" ) { 
                        $state = 1;
                    } elsif ( $w eq "apnic" || $w eq "ripe" ) {
                        $state = 2;
                    } elsif ( $w eq "telco" || $w eq "gin.ntt" || $w eq "voxel" ) {
                        $state = 3;
                    } elsif ( $w eq "softlayer" ) {
                        $state = 4;
                    }
                }
            } elsif ( $state == 1 ) {
                if ( $line =~ m/NetRange\:\s+(\d+\.\d+\.\d+\.\d+)\s+\-\s+(\d+\.\d+\.\d+\.\d+).*/ ) {
                    $retl .= "  range $1 $2 ";
                    $foundrange = 1;
                }
                if ( $line =~ m/OrgName\:\s+(\S+.*)\s*/ ) {
                    $retl .= "  name $1 " if ( $foundname == 0 );
                    $foundname += 1;
                }
        
                if ( $line =~ m/(\w+.*)\s+\S+\s+\(\S+\)\s+(\d+\.\d+\.\d+\.\d+)\s+\-\s+(\d+\.\d+\.\d+\.\d+).*/ ) {
                    $retl .= "  range2 $2 $3 ";
                    $foundrange = 1;
                    $retl .= "  name2 $1 ";
                    $foundname += 1;
                }
        
            } elsif ( $state == 2 ) {
                if ( $line =~ m/inetnum\:\s+(\d+\.\d+\.\d+\.\d+)\s+\-\s+(\d+\.\d+\.\d+\.\d+).*/ ) {
                    $retl .= "  range $1 $2 ";
                    $foundrange = 1;
                }
                if ( $line =~ m/descr\:\s+(\S+.*)\s*/ ) {
                    $retl .= "  name $1 " if ( $foundname == 0 );
                    $foundname += 1;
                }
        
            } elsif ( $state == 3 || $state == 4 ) {
                if ( $line =~ m/network\:IP\-Network\:(\d+\.\d+\.\d+\.\d+)\/(\d+).*/ ) {
                    $retl .= "  range $1 $2 ";
                    $foundrange = 1;
                } elsif ( $line =~ m/network\:IP\-Network\:(\d+\.\d+\.\d+\.\d+)(\S*).*/ ) {
                    $retl .= "  range $1 **$2 ";
                    $foundrange = 1;
                }
                if ( $line =~ m/network\:Org\-Name\:(\S+.*)\s*/ ||
                     $line =~ m/network\:Organization;I\:(\S+.*)\s*/    ) {
                    $retl .= "  name $1 " if ( $foundname == 0 );
                    $foundname += 1;
                }
        
            } else {
                print STDERR "Error: Unknown state\n";
            }
        }
        if ( $state == 0 || $foundrange == 0 || $foundname == 0) {
            $retl = "  unknown ip  $state $foundrange $foundname ";
        }
        return $retl;
    }

__END__

[rwhois.softlayer.com]
network:IP-Network:175.26.10.192/28
network:Organization;I:Home Owners

[whois.voxel.net]
network:IP-Network:17.166.106.82
network:Org-Name:xyzk

[rwhois.gin.ntt.net]
network:IP-Network:204.2.145.0/24
network:Org-Name:Akamai

[rwhois.telco.net]
network:IP-Network:205.250.85.0/25
network:Org-Name:AKAMAI INTERNATIONAL B.V.

[whois.ripe.net]
inetnum:        131.13.64.0 - 131.13.127.255
descr:          Fraance Ltd

[whois.apnic.net]
inetnum:        13.131.4.0 - 13.131.7.255
descr:          Computer Associates, LLC

[whois.arin.net]
NetRange:       54.224.0.0 - 54.239.255.255
CIDR:           54.224.0.0/12
OrgName:        Amazon Technologies Inc.


