# Script to download Trilogy Ocean Restoration images
$targetDir = "c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\apps\web-client\public\images\producteurs\trilogy"

# Create directory if it doesn't exist
if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir | Out-Null
}

# List of images to download from TikTok
$images = @(
    @{
        url = "https://p16-common-sign.tiktokcdn-eu.com/tos-maliva-avt-0068/e4d59a4c083570c9cb7bbc770208d6ba~tplv-tiktokx-cropcenter:1080:1080.jpeg?dr=10399&refresh_token=1e659b3e&x-expires=1779238800&x-signature=l%2FnUnfvhPXT6Jd%2BkRDFaiyu6egE%3D&t=4d5b0474&ps=13740610&shp=a5d48078&shcp=81f88b70&idc=useast2b"
        filename = "profile-avatar.jpg"
    },
    @{
        url = "https://p16-common-sign.tiktokcdn-eu.com/tos-alisg-p-0037/oAeboVJADFCIceAdp5GLoTQ00QBYVkjRSLmIfQ~tplv-tiktokx-origin.image?dr=10395&x-expires=1779238800&x-signature=v9N542A2zL8EsNuAXfDdU%2FVZYZE%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast2b"
        filename = "story-1-coral-diver-karimunjawa.jpg"
    },
    @{
        url = "https://p16-common-sign.tiktokcdn-eu.com/tos-alisg-p-0037/o8B8MMVFjEEiw3TObcPjXIABdIaLxbi50ATOY~tplv-tiktokx-origin.image?dr=10395&x-expires=1779238800&x-signature=UgsEKUsXgRwv06nwxnmBLx7TOmU%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast2b"
        filename = "story-2-dive-explore-restore.jpg"
    },
    @{
        url = "https://p16-common-sign.tiktokcdn-eu.com/tos-alisg-p-0037/o8Q8QDDejQifAwDSQFdEfg4GiA7IDEBAonECCC~tplv-tiktokx-origin.image?dr=10395&x-expires=1779238800&x-signature=9T5WqDthZsY9d%2Bl4GU6vaS%2BJOVg%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast2b"
        filename = "story-3-padahariini.jpg"
    },
    @{
        url = "https://p16-common-sign.tiktokcdn-eu.com/tos-alisg-p-0037/o4LRurmSvApJD7ZJI3CxyjiCo5feguYeIZ0AQG~tplv-tiktokx-origin.image?dr=10395&x-expires=1779238800&x-signature=NLWfO7l73RTixI6q0iG37ubxAH4%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast2b"
        filename = "story-4-karimunjawa-diving.jpg"
    },
    @{
        url = "https://p16-common-sign.tiktokcdn-eu.com/tos-alisg-p-0037/okPakIBHd1GcQDJB9YAIQiXPMTSsXa5EqBVAi~tplv-tiktokx-origin.image?dr=10395&x-expires=1779238800&x-signature=q4XiWHGjjuH0oeFKvkpQmnZnWTE%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast2b"
        filename = "story-5-experience-program.jpg"
    },
    @{
        url = "https://p19-common-sign.tiktokcdn-eu.com/tos-alisg-p-0037/oEB2pG7IJcjIKgAgdCLSADYGAs4KeDfzegNI3n~tplv-tiktokx-origin.image?dr=10395&x-expires=1779238800&x-signature=dntvaFxsPWz3QLTHJaTEjJYjqXg%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast2b"
        filename = "story-6-marine-life.jpg"
    },
    @{
        url = "https://p16-common-sign.tiktokcdn-eu.com/tos-alisg-p-0037/oY5YjPUdRggsIqDXfC2X5foQgHMFsjAtVA8qYe~tplv-tiktokx-origin.image?dr=10395&x-expires=1779238800&x-signature=0rQW4WbuBJIF1aLBoVjhTldAWpo%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast2b"
        filename = "story-7-instructor-training.jpg"
    },
    @{
        url = "https://p16-common-sign.tiktokcdn-eu.com/tos-alisg-p-0037/oM3gALngwfuNMeG4fuMfihg7nYEH41ANNYK6eg~tplv-tiktokx-origin.image?dr=10395&x-expires=1779238800&x-signature=1KpY1MwNIjq%2B64Bu5Ubm5h3rKGM%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast2b"
        filename = "story-8-instructor-training-ssi.jpg"
    },
    @{
        url = "https://p16-common-sign.tiktokcdn-eu.com/tos-alisg-p-0037/osIjk9gU4sFWlfGSCAe4LKAoOkgnqtfDDkiRkI~tplv-tiktokx-origin.image?dr=10395&x-expires=1779238800&x-signature=udi4ElKS9998XcIbI%2BhjcnELe0o%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast2b"
        filename = "story-9-explore-biodiversity.jpg"
    },
    @{
        url = "https://p16-common-sign.tiktokcdn-eu.com/tos-alisg-p-0037/ow2KxEtAoNBEYiHeB6FEgsDIEvARXuAQIKfhUi~tplv-tiktokx-origin.image?dr=10395&x-expires=1779238800&x-signature=CeNoyMSGHU54vKSxbRPM0e2VZdI%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast2b"
        filename = "story-10-karimunjawa-scuba.jpg"
    },
    @{
        url = "https://p19-common-sign.tiktokcdn-eu.com/tos-alisg-p-0037/owwBO2Pfu7yoFBAgIs1ORCODgE6EUwDciEuzQe~tplv-tiktokx-origin.image?dr=10395&x-expires=1779238800&x-signature=o325E04fBNovtq%2BK3yIBpncSvuE%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast2b"
        filename = "story-11-kumcer-karimunjawa.jpg"
    },
    @{
        url = "https://p19-common-sign.tiktokcdn-eu.com/tos-alisg-p-0037/oUTIU8iOHAzjMxKQI3SQABCoIDTXQepeReCLsd~tplv-tiktokx-origin.image?dr=10395&x-expires=1779238800&x-signature=RNIJ4y41JlD5Ozkv0uLJr8VlanM%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=useast2b"
        filename = "story-12-dive-edutrip.jpg"
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
