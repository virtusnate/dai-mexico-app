import urllib.request
import zipfile
import io
import os

url = 'https://raw.githubusercontent.com/PhantomInsights/mexico-geojson/main/2023/%60mexico.zip'
print("Downloading zip...")
response = urllib.request.urlopen(url)
zip_data = response.read()
print("Downloaded, extracting...")

with zipfile.ZipFile(io.BytesIO(zip_data)) as z:
    # The file inside the zip is called `mexico.json
    z.extract('`mexico.json', 'public/')

os.rename('public/`mexico.json', 'public/municipalities.geojson')
print("Successfully extracted municipalities.geojson to public directory")
