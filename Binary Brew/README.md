Binary Brew - Installation Guide
Overview
This guide will walk you through cloning the Binary Brew repository from GitHub, installing Python, setting up the required dependencies, and running the project.

Prerequisites
1. Git (For Cloning the Repository)
Windows: Download Git and install it.
Mac: Git is usually pre-installed. Otherwise, install it via:
 brew install git


Linux: Install Git via:
 sudo apt install git    # Ubuntu/Debian
sudo dnf install git    # Fedora
sudo pacman -S git      # Arch


2. Python Installation
Windows (Tested and Verified)
Download Python from the official site: Python Downloads
Verify installation:
 py --version
 python --version


Mac & Linux
Mac: Install via Homebrew:
 brew install python3


Linux: Install via package manager:
 sudo apt install python3    # Ubuntu/Debian
sudo dnf install python3    # Fedora
sudo pacman -S python       # Arch


Verify installation:
 python3 --version



Cloning the Repository
In a terminal or PowerShell, run:
git clone https://github.com/JHovious/team2cs334.github.io.git

Navigate into the project folder:
cd team2cs334.github.io/Binary\ Brew

(For Linux/Mac, escape spaces with \ as above.)

Setting Up Dependencies
1. Install pip (If Not Installed)
Check if pip is installed:
py -m ensurepip --default-pip  # Windows
python3 -m ensurepip --default-pip  # Mac/Linux

If pip isn’t found, install it manually:
py -m pip install --upgrade pip  # Windows
python3 -m pip install --upgrade pip  # Mac/Linux

2. Install Required Packages
Run:
py -m pip install Flask  # Windows
python3 -m pip install Flask  # Mac/Linux

To check installed packages:
py -m pip list  # Windows
python3 -m pip list  # Mac/Linux


Running the Application
Windows (Tested & Working)
Run:
py init.py

Mac/Linux
python3 init.py


Troubleshooting
1. Python Not Found (Windows)
Ensure Python is installed and added to PATH. Run:
 where python


If not found, reinstall Python and check "Add to PATH."
2. Flask Module Not Found
Run:
 py -m pip install Flask  # Windows
python3 -m pip install Flask  # Mac/Linux

