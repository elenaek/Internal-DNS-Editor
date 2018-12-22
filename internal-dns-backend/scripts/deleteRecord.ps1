Param(
    [string]$subdomain,
    [string]$aliasToRemove,
    [string]$dnsserver
)

#Variables to set
$subdomainToChange = $subdomain
$domainToChange = "companyinternaldomain.com"
$dnsserver = "dnsserver-name"


#remove dns record
Remove-DnsServerResourceRecord -Name $subdomainToChange -RecordData $aliasToRemove -RRType "Cname" -ZoneName $domainToChange -ComputerName $dnsserver -Force