$ErrorActionPreference = 'Stop'
$file = Join-Path $PSScriptRoot '..\src\lib\mock\mock-academy.ts'
$lines = Get-Content $file -Encoding UTF8

# Sanity check anchors
if ($lines[590] -notlike '*CHAPTER_ONE_UNITS*') { throw "Anchor 591 mismatch: $($lines[590])" }
if ($lines[726] -notlike '*LEGACY_ACADEMY_CURRICULUM*') { throw "Anchor 727 mismatch: $($lines[726])" }
if ($lines[1433] -ne ']') { throw "Anchor 1434 mismatch: $($lines[1433])" }

$replacement = @(
  '// --- Coquilles de chapitres (V2 = source de verite) -----------------------',
  '// Toutes les unites des chapitres 1-5 sont migrees dans `src/lib/academy/content`.',
  '// Ce tableau ne conserve que la metadata des chapitres ; `applyV2OverridesToChapter`',
  "// injecte les unites V2 a l'execution via le runtime adapter.",
  '',
  'const LEGACY_ACADEMY_CURRICULUM: AcademyChapter[] = [',
  "  { id: 'chapter-1', slug: 'alphabet-originel', title: ""L'Alphabet Originel"", subtitle: 'Comprends les forces invisibles qui font tourner notre monde.', level: 'A1', order: 1, durationMinutes: 84, difficulty: 'debutant', units: [] },",
  "  { id: 'chapter-2', slug: 'grammaire-especes', title: 'La Grammaire des Especes', subtitle: ""Comment les etres vivants interagissent, s'allient et evoluent."", level: 'A2', order: 2, durationMinutes: 60, difficulty: 'debutant', units: [] },",
  "  { id: 'chapter-3', slug: 'economie-biosphere', title: ""L'Economie de la Biosphere"", subtitle: 'Les grands cycles qui maintiennent le moteur de la planete.', level: 'B1', order: 3, durationMinutes: 75, difficulty: 'intermediaire', units: [] },",
  "  { id: 'chapter-4', slug: 'sanctuaires-sauvages', title: 'Les Sanctuaires Sauvages', subtitle: 'Ecosystemes uniques, isoles et fragiles.', level: 'B2', order: 4, durationMinutes: 90, difficulty: 'intermediaire', units: [] },",
  "  { id: 'chapter-5', slug: 'eveil-gardiens', title: ""L'Eveil des Gardiens"", subtitle: 'Comprendre les crises actuelles pour agir concretement.', level: 'C1/C2', order: 5, durationMinutes: 120, difficulty: 'avance', units: [] }",
  ']'
)

$before = $lines[0..589]
$after = $lines[1434..($lines.Length - 1)]
$newLines = $before + $replacement + $after

Set-Content -Path $file -Value $newLines -Encoding UTF8
Write-Output "Lines before: $($lines.Length)"
Write-Output "Lines after:  $($newLines.Length)"
Write-Output "Removed:      $($lines.Length - $newLines.Length)"
