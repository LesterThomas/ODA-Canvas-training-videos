# Open a deck in real PowerPoint (COM), report each slide's auto-play effect, and export sample PNGs.
# Usage: pwsh ppt_check.ps1 <deck.pptx> [-OutDir <folder>] [-Slides "1,10,20"]
# Expect "N:1/3" for every slide: one main-sequence effect, trigger 3 = msoAnimTriggerAfterPrevious.
# The exported PNGs are what presentation-generator narrates over (it captures slides as stills).
param(
  [Parameter(Mandatory = $true)][string]$Deck,
  [string]$OutDir = (Join-Path $env:TEMP "ppt-check"),
  [string]$Slides = "1"   # comma-separated; a string so it works with both -File and -Command
)
$Deck = (Resolve-Path $Deck).Path
New-Item -ItemType Directory -Force $OutDir | Out-Null
$app = New-Object -ComObject PowerPoint.Application
try {
  $pres = $app.Presentations.Open($Deck, $true, $false, $false)
  $report = foreach ($s in $pres.Slides) {
    $seq = $s.TimeLine.MainSequence
    $trig = if ($seq.Count -ge 1) { $seq.Item(1).Timing.TriggerType } else { "none" }
    "{0}:{1}/{2}" -f $s.SlideIndex, $seq.Count, $trig
  }
  "slides: $($pres.Slides.Count)"
  $report -join "  "
  $bad = $report | Where-Object { $_ -notmatch ':1/3$' }
  if ($bad) { "PROBLEM: slides without a single auto-start effect: $($bad -join ', ')" } else { "auto-play OK on every slide" }
  foreach ($i in ($Slides -split "[,\s]+" | Where-Object { $_ } | ForEach-Object { [int]$_ })) {
    if ($i -le $pres.Slides.Count) { $pres.Slides.Item($i).Export((Join-Path $OutDir "slide_$i.png"), "PNG", 1920, 1080) }
  }
  "exported sample slides to $OutDir"
  $pres.Close()
} finally { $app.Quit() }
