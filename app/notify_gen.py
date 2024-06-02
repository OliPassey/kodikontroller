from PIL import Image, ImageDraw, ImageFont
import os
import random

def create_image_with_text(headline, content, image_folder='images', save_path='output.png'):
    # Randomly select an image from the specified folder
    image_files = [f for f in os.listdir(image_folder) if f.endswith(('.png', '.jpg', '.jpeg'))]
    if not image_files:
        raise FileNotFoundError("No images found in the folder.")
    img_path = os.path.join(image_folder, random.choice(image_files))
    image = Image.open(img_path)
    
    # Prepare drawing context
    draw = ImageDraw.Draw(image)
    
    # Load fonts
    headline_font = ImageFont.truetype("arial.ttf", 50)
    content_font = ImageFont.truetype("arial.ttf", 30)
    
    # Insert headline
    draw.text((10, 10), headline, font=headline_font, fill=(255, 255, 255))
    
    # Insert content block below headline
    draw.text((10, 70), content, font=content_font, fill=(255, 255, 255))
    
    # Save the modified image
    image.save(save_path)
    return save_path
