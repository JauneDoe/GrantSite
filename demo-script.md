# Client Demo Script: 2xclusive Solutions Consulting, LLC Platform

**Goal:** Demonstrate the seamless interaction between a Potential Client and the Grant Consultant (Admin), highlighting ease of access, real-time communication, and transparency.

**Setup:**
1.  Open **Two Browser Windows** (or one normal window and one Incognito/Private window).
    *   **Window 1 (Left):** Will be the **Visitor / Client**.
    *   **Window 2 (Right):** Will be the **Consultant (Owner)**.
2.  Open `index.html` in *Window 1*.
3.  Open `owner.html` in *Window 2*.

---

### Phase 1: The Visitor Experience (Window 1)

**Narrative:** "First, let's look at how a new organization engages with us. They land on our public site..."

1.  **Landing Page:**
    *   Scroll through the `index.html` homepage.
    *   Highlight the **"Client Success Tracker"** progress bar (shows transparency).
    *   Show sections: About Us, Who We Serve, Impact Stories.
    *   **Action:** Click the **"Get Qualified"** button in the top right or the **"Start Your Request"** button in the main Hero card.
    *   *Observation: This now instantly directs them to the Client Dashboard.*

2.  **Client Dashboard (Intake):**
    *   You are now on `client-dashboard.html`.
    *   **Enter Name:** If prompted or simply changing the name, imagine you are "Community Care Center".
    *   **Intake Form:** Scroll down to the "Start New Request" form.
    *   **Action:** Fill out a quick request:
        *   **Project Name:** "After-School STEM Program"
        *   **Amount:** $15,000
        *   **Needed By:** Pick a date.
        *   **Description:** "Funding for science kits."
        *   **Credit Score:** Select "Good".
    *   **Click "Submit Request".**
    *   *Result:* The table above updates immediately with the new request status ("Received").

---

### Phase 2: The Consultant Review (Window 2)

**Narrative:** "Now, let's switch hats. I am the Grant Consultant reviewing this."

1.  **Owner Dashboard:**
    *   Switch to `owner.html`.
    *   **Notifications:** Point out the red badge on the "Message Center" tab on the left sidebar (if any) or simply navigate to the **Message Center**.
2.  **Dashboard Overview:**
    *   Click the **"Dashboard"** tab.
    *   Notice the "Recently Submitted Applications" table. You should see the "After-School STEM Program" request there.
    *   **Action:** Change the Status dropdown from "Received" to **"Reviewing"** or **"Action Needed"**.
    *   *Sync:* Switch back to *Window 1* briefly to show the Client sees this status update instantly (if they refresh or re-check).

---

### Phase 3: Real-Time Communication (Split View)

**Narrative:** "This is the most powerful feature. We stop email clutter and communicate directly in the portal."

1.  **Initiate Chat (Window 2 - Owner):**
    *   Go to **Message Center** tab.
    *   Select **"Proposed Client"** (or the name appearing in the list).
    *   **Action:** Type: *"Hello! I reviewed your STEM proposal. Can you upload your 501(c)(3) letter?"*
    *   **Click Send.**

2.  **Receive Chat (Window 1 - Client):**
    *   Switch to the Client window.
    *   **Notification:** Point out the **Red Badge** appearing on the "Message Center" sidebar tab.
    *   **Action:** Click "Message Center".
    *   See the message from the Consultant.

3.  **Typing Indicators & File Sharing:**
    *   **Action (Client):** Start typing in the chat box: *"Sure, let me find that..."*
    *   **Look at Window 2 (Owner):** See the *"Client is typing..."* indicator appear in real-time.
    *   **Action (Client):** Click the **Paperclip Icon (📎)**.
    *   Select any dummy file (or cancel, the mock works either way).
    *   *Result:* A message appears: *"Shared a file: [Filename]"*.
    *   **Action (Owner):** See the file link appear instantly.

---

### Phase 4: Closing

**Narrative:** "This platform unifies the entire lifecycle: Intake, Status Tracking, and Document Collection. No lost emails, total transparency."
