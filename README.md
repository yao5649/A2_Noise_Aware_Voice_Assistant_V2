# Noise-Aware Voice Assistant V2.0

**README prose word count: 538** (not including headings, tables, and code).

## Project Status

This is my Assignment 2 project. I made a simple website to show how a voice assistant could respond when it is not sure about a command.

The website works as a simulation. It does not use a microphone or real speech recognition. It also does not control any real devices.

Users can choose a noise level and a command. The website shows a confidence score and decides what to do next. I also added a dashboard to show the results and the interaction history.

## Tools Used

- **HTML:** webpage structure.
- **CSS:** colours and layout.
- **JavaScript:** simulation and button functions.
- **VS Code:** writing and editing code.
- **Microsoft Edge:** testing the website.
- **Python HTTP server:** running the website locally.
- **ChatGPT:** help with checking code, finding possible problems, planning tests, and improving the documentation.

There is no real AI model in the website. No API key is needed.

## How to Run

1. Download the project and open its folder in VS Code.
2. Open the terminal in the same folder as `index.html`.
3. Enter:

   ```bash
   python -m http.server 8000
   ```

   If this does not work on Windows, try `py -m http.server 8000`.

4. Open `http://localhost:8000` in your browser.
5. Choose a noise level and a command, then click **Simulate Voice Input**.

## How It Works

| Noise level | Confidence | Result with 80% threshold |
| --- | --- | --- |
| Quiet | 95% | Command executed (simulation) |
| Medium | 65% | Ask the user to confirm |
| Noisy | 30% | Ask the user to try again |

Users can change the **Confidence Threshold** from 50% to 95%. The default is 80%.

If the confidence is at least the selected threshold, the command runs in the simulation. If it is lower but still at least 50%, the user can confirm or cancel. Below 50%, the system asks the user to try again.

Changing the threshold does not change the confidence score. The user needs to click **Simulate Voice Input** again to see a new decision.

The dashboard also counts simulations and keeps an interaction history. **Reset** clears the results.

## Development Record

1. **First idea:** I wanted to study problems with voice assistants in noisy places.
2. **First version:** I made a basic website with different confidence levels and user responses.
3. **Version 2.0:** I added a dashboard, confidence threshold slider, statistics, and interaction history. These make the results easier to understand.
4. **Fixing problems:** At one point, the confidence display did not always look correct. I checked the HTML and JavaScript and tested again in the browser. I could not confirm the exact cause.
5. **Testing:** I tested Quiet, Medium, Confirm, Cancel, Noisy, Try Again, and Reset. The main functions worked in my browser tests. This was not a test with real users.

**GitHub commit:** Add the final V2.0 commit link here after uploading the finished files.

## AI Assistance

I used ChatGPT to help me understand some JavaScript problems, suggest ways to fix them, and organise my testing and writing. I did not use ChatGPT as the voice recognition system. I checked the suggestions by looking at my code and testing the website in Microsoft Edge.

## Project Files

- `index.html` — webpage content.
- `style.css` — webpage design.
- `script.js` — simulation and interaction functions.
- `README.md` — project information.
- `screenshots/` — test screenshots, if added to GitHub.

## Limitations

The noise levels and confidence scores are fixed values. They are not collected from real sound. The website does not recognise speech or control lights, music, or alarms.

In the future, I would like to try real microphone input and ask users to test the design.
