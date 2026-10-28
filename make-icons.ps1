Add-Type -AssemblyName System.Drawing

$dir = Join-Path $PSScriptRoot "icons"
New-Item -ItemType Directory -Force -Path $dir | Out-Null

function New-CutTrackIcon {
  param([int]$Size, [string]$Path, [double]$TextRatio = 0.42)

  $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

  $lime = [System.Drawing.ColorTranslator]::FromHtml("#c9ff4d")
  $dark = [System.Drawing.ColorTranslator]::FromHtml("#080a08")
  $g.Clear($lime)

  $pad = [int]($Size * 0.085)
  $pen = New-Object System.Drawing.Pen($dark, [float]([Math]::Max(2, $Size * 0.018)))
  $g.DrawRectangle($pen, $pad, $pad, $Size - 2 * $pad, $Size - 2 * $pad)

  $fontName = "Arial Black"
  try { $test = New-Object System.Drawing.Font($fontName, 10); $test.Dispose() }
  catch { $fontName = "Segoe UI" }

  $font = New-Object System.Drawing.Font($fontName, [float]($Size * $TextRatio), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $brush = New-Object System.Drawing.SolidBrush($dark)
  $sf = New-Object System.Drawing.StringFormat
  $sf.Alignment = [System.Drawing.StringAlignment]::Center
  $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
  $rect = New-Object System.Drawing.RectangleF(0, 0, $Size, $Size)
  $g.DrawString("CT", $font, $brush, $rect, $sf)

  $dot = [float]($Size * 0.035)
  $g.FillEllipse($brush, [float]($Size / 2 - $dot / 2), [float]($Size * 0.76), $dot, $dot)

  $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)

  $brush.Dispose(); $font.Dispose(); $pen.Dispose(); $sf.Dispose(); $g.Dispose(); $bmp.Dispose()
}

New-CutTrackIcon -Size 512 -Path (Join-Path $dir "icon-512.png") -TextRatio 0.42
New-CutTrackIcon -Size 192 -Path (Join-Path $dir "icon-192.png") -TextRatio 0.42
New-CutTrackIcon -Size 180 -Path (Join-Path $dir "icon-180.png") -TextRatio 0.42
New-CutTrackIcon -Size 512 -Path (Join-Path $dir "icon-maskable-512.png") -TextRatio 0.34

Get-ChildItem $dir | Select-Object Name, Length
