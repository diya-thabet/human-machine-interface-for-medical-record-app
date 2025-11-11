# Human Machine Interface for Medical Record App

This project implements a mobile application interface for managing medical records, designed for both patients and doctors. It provides a streamlined and intuitive user experience for viewing personal health data, managing patient records, and interacting with the system.

## Features

-   **User Authentication:** Secure login and registration for patients and doctors.
-   **Patient Dashboard:** Quick overview of appointments and health metrics for patients.
-   **Patient Records History:** Detailed view of a patient's historical medical records.
-   **Patient Profile Management:** Patients can view and update their personal information.
-   **Doctor Dashboard:** Overview of managed patients for doctors.
-   **Patient Record Management (Doctor):** Doctors can view and add health records for specific patients.
-   **Doctor Profile Management:** Doctors can view and update their personal and professional information.
-   **Responsive UI:** Designed to be user-friendly across various mobile devices.

## App Screenshots

Here are some screenshots demonstrating the application's interface:

<p align="center">
  <img src="interfaces/1.jpg" width="300" alt="Screenshot 1: Login Screen" />
  <img src="interfaces/2.jpg" width="300" alt="Screenshot 2: Registration Screen" />
  <img src="interfaces/3.jpg" width="300" alt="Screenshot 3: Patient Dashboard" />
  <img src="interfaces/4.jpg" width="300" alt="Screenshot 4: Patient Records History" />
  <img src="interfaces/5.jpg" width="300" alt="Screenshot 5: Add Record Screen" />
  <img src="interfaces/6.jpg" width="300" alt="Screenshot 6: Patient Profile" />
  <img src="interfaces/7.jpg" width="300" alt="Screenshot 7: Doctor Dashboard" />
  <img src="interfaces/8.jpg" width="300" alt="Screenshot 8: View Patient Profile (by Doctor)" />
  <img src="interfaces/9.jpg" width="300" alt="Screenshot 9: Doctor's View of Patient Records" />
  <img src="interfaces/10.jpg" width="300" alt="Screenshot 10: Doctor Profile" />
</p>

## How to Run the Project

Follow these steps to set up and run the project locally on your machine.

### Prerequisites

* **Node.js and npm:** Make sure you have Node.js (which includes npm) installed. You can download it from [nodejs.org](https://nodejs.org/).
* **Expo CLI:** Install Expo CLI globally.
    ```bash
    npm install -g expo-cli
    ```
* **Expo Go App:** Install the Expo Go app on your physical mobile device (Android or iOS) for easy testing, or use an emulator/simulator.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/diya-thabet/human-machine-interface-for-medical-record-app.git
    cd human-machine-interface-for-medical-record-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the App

1.  **Start the Expo development server:**
    ```bash
    expo start
    ```
    This will open a new tab in your web browser with the Expo Developer Tools.

2.  **Open on your device/emulator:**
    * **Physical Device:** Scan the QR code displayed in your terminal or browser with the Expo Go app on your phone.
    * **Android Emulator:** Press `a` in the terminal or click "Run on Android device/emulator" in the browser.
    * **iOS Simulator:** Press `i` in the terminal or click "Run on iOS simulator" in the browser. (Requires Xcode installed on macOS).

The app should now launch on your chosen device or emulator.
