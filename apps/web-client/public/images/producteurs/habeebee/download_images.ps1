# Script to download Habeebee images
$targetDir = "c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\apps\web-client\public\images\producteurs\habeebee"

# Create directory if it doesn't exist
if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir | Out-Null
}

# List of images to download
$images = @(
    @{
        url = "https://habeebee.be/cdn/shop/files/2021-06-24-habeebee-0059.jpg?v=1744961871&width=1500"
        filename = "hero.jpg"
    },
    @{
        url = "https://habeebee.be/cdn/shop/files/equipe-savonnerie-habeebee.jpg?v=1744896453&width=1500"
        filename = "portrait.jpg"
    },
    @{
        url = "https://habeebee.be/cdn/shop/files/Logo_habeebee_1.png?v=1778236057&width=600"
        filename = "logo.png"
    },
    @{
        url = "https://habeebee.be/cdn/shop/files/habeebeeculture-apiculture-durable-transmission-sensibilisation.webp?v=1744894067&width=1500"
        filename = "story-1-habeebeeculture-formation.webp"
    },
    @{
        url = "https://habeebee.be/cdn/shop/files/cycle-habeebeeculture-cire-d-abeille-apiculture-durable-circuit-court.png?v=1744894161&width=3200"
        filename = "story-2-cycle-habeebeeculture.png"
    },
    @{
        url = "https://habeebee.be/cdn/shop/files/ruche-habeebee-cire-propolis-apiculture-naturelle.jpg?v=1744894260&width=3840"
        filename = "story-3-ruche.jpg"
    },
    @{
        url = "https://habeebee.be/cdn/shop/files/habeebee-tedy-artisan-savonnier-equipe-savoir-faire.jpg?v=1744893228&width=1500"
        filename = "story-4-tedy-artisan.jpg"
    },
    @{
        url = "https://habeebee.be/cdn/shop/files/habeebee-tedy-fabrication-savons-coupe-artisanat-savonnerie.jpg?v=1744893329&width=1500"
        filename = "story-5-tedy-fabrication.jpg"
    },
    @{
        url = "https://habeebee.be/cdn/shop/files/scouts-savon-scout-toujours-habeebee.jpg?v=1744895068&width=1500"
        filename = "story-6-scouts.jpg"
    },
    @{
        url = "https://habeebee.be/cdn/shop/files/insertion-travail-habeebee.jpg?v=1744895512&width=1500"
        filename = "story-7-insertion.jpg"
    },
    @{
        url = "https://habeebee.be/cdn/shop/files/certificat-ecogarantie-controle-certisys.png?v=1744895912&width=3200"
        filename = "story-8-certificat-ecogarantie.png"
    },
    @{
        url = "https://habeebee.be/cdn/shop/files/habeebee-savonnerie-artisanale-apiculture-durable.webp?v=1744892378&width=1500"
        filename = "savonnerie-interieur.webp"
    }
)

# Download each image
foreach ($image in $images) {
    $outputPath = Join-Path $targetDir $image.filename
    Write-Host "Downloading $($image.filename)..."
    try {
        Invoke-WebRequest -Uri $image.url -OutFile $outputPath -UseBasicParsing
        Write-Host "OK: $($image.filename) downloaded" -ForegroundColor Green
    }
    catch {
        Write-Host "ERROR: Failed to download $($image.filename): $_" -ForegroundColor Red
    }
}

Write-Host "Download complete!" -ForegroundColor Cyan
