import cv2
import os
import numpy as np

#folders contatining images and where to put
input_folder = "ores/tin_ore"  
output_folder = "training_tin_ores"  
os.makedirs(output_folder, exist_ok=True)

# Get list of image files
image_files = [f for f in os.listdir(input_folder) if f.endswith((".png", ".jpg", ".jpeg"))]

# Counter for naming images
counter = 1

for image_file in image_files:
    # Load image
    img_path = os.path.join(input_folder, image_file)
    img = cv2.imread(img_path)

    if img is None:
        print(f"Error loading {image_file}. Skipping...")
        continue

    # Resize to 64x64
    img = cv2.resize(img, (64, 64))

    # Save original resized image
    cv2.imwrite(os.path.join(output_folder, f"tin_ore{counter:03}.png"), img)
    counter += 1

    # Define transformations
    transformations = [
        ("rot90", cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)),
        ("rot180", cv2.rotate(img, cv2.ROTATE_180)),
        ("rot270", cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)),
        ("flip_h", cv2.flip(img, 1)),  # Horizontal Flip
        ("flip_v", cv2.flip(img, 0)),  # Vertical Flip
    ]

    # Apply transformations and save
    for name, transformed_img in transformations:
        cv2.imwrite(os.path.join(output_folder, f"tin_ore{counter:03}.png"), transformed_img)
        counter += 1

print("Processing complete. Images saved in:", output_folder)
