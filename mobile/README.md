# TD MySpend Mobile

This is a React Native wrapper for the TD MySpend Reimagined web prototype.

## Setup

1.  **Serve the web files**:
    From the root of the project (one level up), run:
    ```bash
    python3 -m http.server 8000
    ```
    (This is likely already running if the AI started it).

2.  **Start the Expo App**:
    ```bash
    cd mobile
    npx expo start
    ```

3.  **Connect**:
    - Scan the QR code with the Expo Go app on your Pixel 8.
    - When the app loads, it will ask for your computer's IP.
    - Enter: `10.0.0.209` (or whatever your current local IP is).
    - Tap "Connect".

## Troubleshooting

-   **White Screen / Connection Error**: 
    -   Make sure your phone and computer are on the **same Wi-Fi network**.
    -   Check if the firewall is blocking port 8000.
    -   Verify the IP address hasn't changed (`ipconfig getifaddr en0` in terminal).

