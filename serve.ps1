$root = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8765/")
$listener.Start()
Write-Host "Serving $root on http://localhost:8765/"
while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $path = $ctx.Request.Url.LocalPath
    if ($path -eq "/") { $path = "/index.html" }
    $rel = $path.TrimStart("/") -replace "/", "\"
    $file = Join-Path $root $rel
    if (Test-Path -LiteralPath $file -PathType Leaf) {
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $ext = [System.IO.Path]::GetExtension($file).ToLower()
      $mime = "application/octet-stream"
      if ($ext -eq ".html") { $mime = "text/html; charset=utf-8" }
      elseif ($ext -eq ".css") { $mime = "text/css; charset=utf-8" }
      elseif ($ext -eq ".js") { $mime = "application/javascript; charset=utf-8" }
      elseif ($ext -eq ".json") { $mime = "application/json; charset=utf-8" }
      elseif ($ext -eq ".webmanifest") { $mime = "application/manifest+json; charset=utf-8" }
      elseif ($ext -eq ".png") { $mime = "image/png" }
      elseif ($ext -eq ".svg") { $mime = "image/svg+xml" }
      $ctx.Response.ContentType = $mime
      $ctx.Response.Headers.Add("Cache-Control", "no-store")
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
    }
    $ctx.Response.Close()
  } catch {
  }
}
