import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

os.makedirs("sample_images", exist_ok=True)

def create_scenic_landscape():
    """Generates a rich, vibrant scenic mountain landscape with sunset."""
    w, h = 800, 600
    img = Image.new("RGB", (w, h))
    draw = ImageDraw.Draw(img)

    # Gradient sky (sunset purple to orange to gold)
    for y in range(350):
        t = y / 350.0
        r = int(70 * (1 - t) + 245 * t)
        g = int(30 * (1 - t) + 120 * t)
        b = int(120 * (1 - t) + 40 * t)
        draw.line([(0, y), (w, y)], fill=(r, g, b))

    # Golden Sun
    draw.ellipse([w//2 - 60, 200, w//2 + 60, 320], fill=(255, 220, 100))

    # Far mountains (dark violet)
    mountain_pts1 = [(0, 350), (120, 240), (280, 320), (450, 210), (620, 330), (800, 250), (800, 600), (0, 600)]
    draw.polygon(mountain_pts1, fill=(65, 35, 75))

    # Near mountains (deep forest navy/green)
    mountain_pts2 = [(0, 420), (200, 310), (380, 400), (560, 290), (740, 380), (800, 340), (800, 600), (0, 600)]
    draw.polygon(mountain_pts2, fill=(28, 52, 58))

    # Lake in foreground with reflections
    for y in range(430, 600):
        t = (y - 430) / 170.0
        r = int(30 * (1 - t) + 20 * t)
        g = int(75 * (1 - t) + 90 * t)
        b = int(110 * (1 - t) + 140 * t)
        draw.line([(0, y), (w, y)], fill=(r, g, b))

    # Trees silhouettes along the bank
    for x in range(20, 780, 35):
        tree_h = 40 + (x * 17) % 35
        base_y = 440 + (x * 7) % 20
        draw.polygon([(x, base_y - tree_h), (x - 12, base_y), (x + 12, base_y)], fill=(15, 25, 20))

    img.save("sample_images/sample_landscape.jpg", quality=95)
    print("Created sample_images/sample_landscape.jpg")

def create_portrait_art():
    """Generates a stylish artistic portrait character with distinct facial features, hair, and clothing."""
    w, h = 600, 750
    img = Image.new("RGB", (w, h), (235, 238, 245))
    draw = ImageDraw.Draw(img)

    # Gradient studio background
    for y in range(h):
        t = y / h
        r = int(210 * (1 - t) + 180 * t)
        g = int(220 * (1 - t) + 195 * t)
        b = int(240 * (1 - t) + 225 * t)
        draw.line([(0, y), (w, y)], fill=(r, g, b))

    # Hair back
    draw.ellipse([150, 110, 450, 480], fill=(45, 30, 25))

    # Shoulders and Coat (Teal blue jacket)
    draw.polygon([(80, 750), (180, 480), (420, 480), (520, 750)], fill=(32, 85, 115))
    # Shirt collar
    draw.polygon([(250, 480), (300, 560), (350, 480)], fill=(245, 245, 245))

    # Neck
    draw.rectangle([260, 410, 340, 490], fill=(238, 192, 160))

    # Face Oval
    draw.ellipse([190, 170, 410, 450], fill=(248, 204, 172))

    # Eyes
    # Left eye
    draw.ellipse([230, 275, 280, 305], fill=(255, 255, 255))
    draw.ellipse([245, 277, 272, 303], fill=(50, 80, 130))
    draw.ellipse([253, 283, 265, 297], fill=(20, 20, 20))
    draw.ellipse([258, 285, 263, 290], fill=(255, 255, 255))
    draw.line([(225, 268), (285, 268)], fill=(45, 30, 25), width=3) # Brow

    # Right eye
    draw.ellipse([320, 275, 370, 305], fill=(255, 255, 255))
    draw.ellipse([328, 277, 355, 303], fill=(50, 80, 130))
    draw.ellipse([335, 283, 347, 297], fill=(20, 20, 20))
    draw.ellipse([340, 285, 345, 290], fill=(255, 255, 255))
    draw.line([(315, 268), (375, 268)], fill=(45, 30, 25), width=3) # Brow

    # Nose
    draw.line([(300, 290), (308, 340), (292, 345)], fill=(210, 160, 130), width=3)

    # Lips
    draw.polygon([(270, 380), (300, 372), (330, 380), (300, 395)], fill=(200, 75, 80))

    # Stylish Front Hair / Bangs
    draw.polygon([(180, 220), (240, 160), (300, 220), (360, 160), (420, 230), (390, 140), (210, 140)], fill=(55, 35, 28))

    img.save("sample_images/sample_portrait.jpg", quality=95)
    print("Created sample_images/sample_portrait.jpg")

def create_sports_car():
    """Generates a vibrant red sports car on an asphalt road."""
    w, h = 800, 550
    img = Image.new("RGB", (w, h), (180, 205, 230))
    draw = ImageDraw.Draw(img)

    # Road
    draw.rectangle([0, 380, w, h], fill=(60, 62, 65))
    draw.line([(0, 460), (w, 460)], fill=(240, 200, 50), width=5)

    # Car Body Red
    draw.polygon([
        (150, 380), (190, 300), (280, 240), (510, 240),
        (620, 290), (710, 330), (730, 380), (700, 400),
        (160, 400)
    ], fill=(225, 30, 35))

    # Cabin & Windshield
    draw.polygon([
        (290, 245), (490, 245), (460, 295), (260, 295)
    ], fill=(30, 35, 45))

    # Headlight
    draw.polygon([(680, 335), (715, 338), (705, 355), (670, 350)], fill=(255, 255, 200))

    # Wheels
    # Left wheel
    draw.ellipse([210, 350, 310, 450], fill=(25, 25, 25))
    draw.ellipse([235, 375, 285, 425], fill=(180, 185, 190))
    draw.ellipse([250, 390, 270, 410], fill=(40, 40, 40))

    # Right wheel
    draw.ellipse([540, 350, 640, 450], fill=(25, 25, 25))
    draw.ellipse([565, 375, 615, 425], fill=(180, 185, 190))
    draw.ellipse([580, 390, 600, 410], fill=(40, 40, 40))

    img.save("sample_images/sample_car.jpg", quality=95)
    print("Created sample_images/sample_car.jpg")

if __name__ == "__main__":
    create_scenic_landscape()
    create_portrait_art()
    create_sports_car()
