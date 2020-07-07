param($installPath, $toolsPath, $package, $project)

$exe = Join-Path (Join-Path $toolsPath "wkhtmltopdf") 'wkhtmltopdf.exe' | Get-ChildItem

$project.ProjectItems.AddFromFile($exe.FullName);
$pi = $project.ProjectItems.Item($exe.Name);
$pi.Properties.Item("BuildAction").Value = [int]2;
$pi.Properties.Item("CopyToOutputDirectory").Value = [int]2;

$project.ProjectItems.Item('wkhtmltopdf.exe').Properties.Item("CopyToOutputDirectory").Value = [int]2;
