# Installing Tailwind CSS for Production

To fix the "cdn.tailwindcss.com should not be used in production" warning:

## Option 1: Install via npm
```bash
npm install tailwindcss
npx tailwindcss init
```

## Option 2: Use Django Tailwind
```bash
pip install django-tailwind
# Add 'tailwind' to INSTALLED_APPS
# Configure in settings.py
```

## Option 3: Use Tailwind CLI
```bash
# Download Tailwind CLI
curl -sLO https://github.com/tailwindlabs/tailwindcss/releases/latest/download/tailwindcss-linux-x64
chmod +x tailwindcss-linux-x64
mv tailwindcss-linux-x64 tailwindcss

# Build CSS
./tailwindcss -i ./static/css/input.css -o ./static/css/tailwind.css --watch
```

For now, the CDN version works fine in development. The warning is just about production optimization.