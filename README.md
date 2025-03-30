# TechJeeper Designs Website

## Local Development Setup

1. Install a local server (choose one):
   ```bash
   # Using Python (Python 3)
   python -m http.server 8000

   # Using Node.js
   npx http-server

   # Using PHP
   php -S localhost:8000
   ```

2. Open the site in your browser:
   - Navigate to `http://localhost:8000`
   - Do NOT open the files directly using `file://` protocol

## Required Images

Please ensure the following images are present in the assets/img directory:

### Profile Images
- `assets/img/avatar.jpg` - Your profile avatar (recommended size: 200x200px)
- `assets/img/header.png` - Your header logo

### Shop Images
- `assets/img/shop/tshirt.jpg` - T-shirt product image (recommended size: 800x600px)
- `assets/img/shop/stickers.jpg` - Sticker pack image (recommended size: 800x600px)
- `assets/img/shop/print.jpg` - Digital art print image (recommended size: 800x600px)

### Blog Post Images
- `assets/img/posts/jeep-collection.jpg` - Jeep collection announcement image
- `assets/img/posts/digital-art.jpg` - Digital art preview image
- `assets/img/posts/sticker-designs.jpg` - Sticker designs preview image

## Development Notes

1. Image Guidelines:
   - Use JPG for photos and complex images
   - Use PNG for logos and images requiring transparency
   - Optimize all images for web use
   - Maintain consistent aspect ratios within each category

2. Twitch Integration:
   - Local development: uses `parent=localhost`
   - Production: update to `parent=techjeeper.com`
   - Must be accessed through a web server (not file://)

3. Missing Images:
   - The site will display placeholder images for any missing image files
   - Add your images to the corresponding directories when ready 