import os
try:
    os.remove('public/municipalities.geojson')
except Exception as e:
    print(e)

try:
    os.rename('public/`mexico.json', 'public/municipalities.geojson')
    print("Fixed files successfully!")
except Exception as e:
    print("Failed to rename:", e)
