# Apply the animation plan written by build_deck.py (<deck>.anim.json) using PowerPoint itself.
# Usage: pwsh tools/animate_deck.ps1 decks/<deck-id>.pptx
#
# - Native slides: each planned entrance effect is added to the main sequence. The first effect
#   starts "After Previous" (automatically, when the slide starts); the rest are "With Previous".
#   Every delay is measured from the start of the slide, so `at` maps straight to the narration.
# - All slides: auto-advance after the narration (secs + 1.5 s). Then PowerPoint's own
#   "Export to video" plays the deck with the right pacing, including clips and animations.
param([Parameter(Mandatory = $true)][string]$Deck)
$Deck = (Resolve-Path $Deck).Path
$planPath = [IO.Path]::ChangeExtension($Deck, ".anim.json")
$plan = Get-Content $planPath -Raw | ConvertFrom-Json

# MsoAnimEffect / MsoAnimDirection / MsoAnimTriggerType values
$EFFECTS = @{ "fade" = @(10, 0); "rise" = @(2, 11); "wipe-up" = @(22, 11); "wipe-down" = @(22, 10); "zoom" = @(53, 0) }
$AFTER_PREVIOUS = 3
$WITH_PREVIOUS = 2

$app = New-Object -ComObject PowerPoint.Application
try {
  $pres = $app.Presentations.Open($Deck, $false, $false, $false)
  $total = 0
  foreach ($prop in $plan.slides.PSObject.Properties) {
    $idx = [int]$prop.Name
    $entry = $prop.Value
    $slide = $pres.Slides.Item($idx)
    if ($entry.secs) {
      $slide.SlideShowTransition.AdvanceOnTime = -1   # msoTrue
      $slide.SlideShowTransition.AdvanceTime = [double]$entry.secs + 1.5
    }
    if ($entry.kind -ne "native") { continue }
    $seq = $slide.TimeLine.MainSequence
    for ($i = $seq.Count; $i -ge 1; $i--) { $seq.Item($i).Delete() }
    $first = $true
    foreach ($a in ($entry.anims | Sort-Object { [double]$_.at })) {
      $shape = $slide.Shapes.Item($a.shape)
      $spec = $EFFECTS[$a.effect]
      if (-not $spec) { throw "unknown effect $($a.effect)" }
      $trigger = if ($first) { $AFTER_PREVIOUS } else { $WITH_PREVIOUS }
      $eff = $seq.AddEffect($shape, $spec[0], 0, $trigger)
      if ($spec[1] -ne 0) { $eff.EffectParameters.Direction = $spec[1] }
      $eff.Timing.Duration = [double]$a.dur
      $eff.Timing.TriggerDelayTime = [double]$a.at
      $first = $false
      $total++
    }
  }
  $pres.Save()
  "animated $total effects; auto-advance set on $($pres.Slides.Count) slides"
  $pres.Close()
} finally { $app.Quit() }
