# Text Adventure in C++

## Overview

This is a personal project for self-practice, designed to create a text-based adventure game.

## Features

- Uses **CMake** for build automation
- Game runs in the terminal/command line

## Setup

### 1. Clone the repository

You can clone the repository using any of the following methods:

- **HTTPS**:
```shell
git clone https://github.com/Bongo044152/test.git
```

- **SSH**:
```shell
git clone git@github.com:Bongo044152/test.git
```

- **Download as a ZIP**:
  - Go to the [GitHub repository page](https://github.com/Bongo044152/test), click on the "Code" button, and select "Download ZIP."

### 2. Build and Run the Project

Follow these steps to build and run the game:

```shell
cd text_ad
mkdir build
cd build
cmake -G "MinGW Makefiles" ..  # Using g++ is recommended
cmake --build .
./Adventure.exe
```

If you encounter any issues building the project, you can download the pre-built `Adventure.exe` from [this link](https://github.com/Bongo044152/test/releases/download/homework/Adventure.exe).
