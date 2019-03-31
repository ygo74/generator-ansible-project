#https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/powershell?view=azure-devops

# Enable -Verbose option
[CmdletBinding()]

#Retrieve Versions in the public npm
$res = npm show generator-ansible-project@* version
$foundVersions = @()
$res | ForEach-Object {
    $versions = $_ -split " "
    $foundVersions += New-Object -TypeName System.Version $versions[1].trim().replace("'","")
}

if ($foundVersions.length -eq 0)
{
    $latestVersion = New-Object -TypeName System.Version 0.0.1
}
else {
    $version = ($foundVersions |Sort-Object -Descending)[0]
    $latestVersion = New-Object -TypeName System.Version $version.Major, $version.Minor, $($version.Build +1)
}

write-output "##vso[task.setvariable variable=myOutputVar;isOutput=true]$latestVersion"
