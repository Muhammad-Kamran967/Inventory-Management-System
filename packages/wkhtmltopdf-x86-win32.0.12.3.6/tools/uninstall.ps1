param($installPath, $toolsPath, $package, $project)

$file = Join-Path (Join-Path $toolsPath "wkhtmltopdf") 'wkhtmltopdf.exe' | Get-ChildItem

$project.ProjectItems.Item($file.Name).Delete()
