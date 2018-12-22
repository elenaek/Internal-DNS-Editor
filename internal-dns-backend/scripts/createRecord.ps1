Param(
    [string]$subdomain,
    [string]$destination,
    [string]$dnsserver
)

#Variables to set
$subdomainToChange = $subdomain
$domainToChange = "companyinternaldomain.com"
$destinationToChangeTo = $destination
$dnsserver = "dnsserver-name"

#Create a dns cname record
Add-DnsServerResourceRecordCName -Name $subdomainToChange -HostNameAlias $destinationToChangeTo -ZoneName $domainToChange -ComputerName $dnsserver 