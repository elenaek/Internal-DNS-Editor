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

<#
- Create a new record and old record,
- set the new record to the old record (byVal), 
- modify the alias of the new record object (set-dnsserverresourcerecord requires both old and new record objects)
#>

$oldRec = Get-DnsServerResourceRecord -name $subdomainToChange -zonename $domainToChange -RRType "CName" -ComputerName $dnsserver
$newRec = $oldRec.PSObject.Copy()
$newRec.RecordData.HostnameAlias = $destinationToChangeTo


#Set the new alias
Set-DnsServerResourceRecord -OldInputObject $oldRec -NewInputObject $newRec -zoneName $domainToChange -ComputerName $dnsserver

