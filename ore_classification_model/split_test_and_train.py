import os
import shutil
from sklearn.model_selection import train_test_split

# Path to the 'ores' folder where images are located
dataset_path = "ores"  # Assuming 'ores' is in your current working directory

# Define the train and test folder paths inside the 'ores' folder
train_folder = os.path.join(dataset_path, "train")  # Inside ores -> train
test_folder = os.path.join(dataset_path, "test")    # Inside ores -> test

# Ensure that train and test directories exist
os.makedirs(train_folder, exist_ok=True)
os.makedirs(test_folder, exist_ok=True)

# Get the list of all images in subfolders (tin_ore and copper_ore)
all_images = []
for subfolder in os.listdir(dataset_path):
    subfolder_path = os.path.join(dataset_path, subfolder)
    if os.path.isdir(subfolder_path):  # Check if it's a subfolder
        images = [f for f in os.listdir(subfolder_path) if os.path.isfile(os.path.join(subfolder_path, f)) and f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        all_images.extend([(subfolder, image) for image in images])  # Store tuple (subfolder, image name)

# Check if any images were found
if not all_images:
    print("No images found in the subfolders. Please check the folder contents.")
else:
    # Split the images into training and testing sets (80% train, 20% test)
    train_images, test_images = train_test_split(all_images, test_size=0.2, random_state=42)

# Function to move images to the correct folders
def move_images(images, source_folder, target_folder):
    for subfolder, image in images:
        source_path = os.path.join(source_folder, subfolder, image)
        target_subfolder = os.path.join(target_folder, subfolder)
        os.makedirs(target_subfolder, exist_ok=True)  # Create subfolder in train/test
        target_path = os.path.join(target_subfolder, image)
        shutil.move(source_path, target_path)

# Move the images to the train and test folders
move_images(train_images, dataset_path, train_folder)
move_images(test_images, dataset_path, test_folder)

print("Data split complete!")
