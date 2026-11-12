# DTF U Village · Phone Call Guide

A step-by-step guide that helps cashiers handle phone calls. It shows what to say, what to ask and what to do, one step at a time. It works on phones and on the computer or tablet at the cashier station.

You don't need to be a developer to keep it up to date. This page explains everything.

---

## What's in this folder

| File | What it is | Do you edit it? |
|---|---|---|
| `content.js` | **All the words in the guide.** Every step, button and explanation. | **Yes**, this is the only file you edit. |
| `index.html` | The finished guide that people open. It's made automatically from `content.js`. | No. It gets rebuilt for you. |
| `template.html` | The app's layout, look and behavior. | No. |
| `build.mjs` | A small program that checks `content.js` and makes `index.html`. | No. |
| `README.md` | This guide. | Only if you want to. |
| `.gitignore` | Tells GitHub which junk files to ignore. | No. |

> **Golden rule:** whenever you upload a new `index.html`, upload `content.js` with it.
> `content.js` is the only editable copy of the guide's words. `index.html` is made from it, so if `content.js` is lost or out of date, your next edit will undo someone's changes.

---

## 1. One-time setup: install Node.js

Node.js is a free program that runs `build.mjs`. You only install it once.

1. Go to **https://nodejs.org**.
2. Download the version marked **LTS** (it means "long-term support", the stable one).
3. Open the downloaded file and click through the installer with the default choices.
4. Check that it worked:
   - **Mac:** open **Terminal** (press `⌘ Space`, type *Terminal*, press Enter).
   - **Windows:** open **Command Prompt** (press the Windows key, type *cmd*, press Enter).
   - Type `node --version` and press Enter. You should see a number like `v22.x.x`. If you see "command not found" or "not recognized", restart the computer and try again.

### How to open Terminal or Command Prompt "in this folder"

You'll run the build from inside this folder.

- **Mac:** open Terminal, type `cd ` (with a space after it), drag this folder from Finder into the Terminal window, and press Enter.
- **Windows:** open this folder in File Explorer, click the address bar at the top, type `cmd`, and press Enter.

---

## 2. Build the guide

In Terminal or Command Prompt, in this folder, type:

```
node build.mjs
```

Then press Enter.

- A **green ✔** means `index.html` was rebuilt. It also lists the notes that still need info (see the checklist at the bottom of this page). Those are reminders, not errors.
- A **red ✖** means something in `content.js` needs fixing. It tells you the step, the line number and what to do. `index.html` is left unchanged until you fix it and run the build again.

To check your work, double-click `index.html` to open it in your browser.

---

## 3. Publish on GitHub Pages (no git or coding needed)

You only do this once. Everything happens on the GitHub website.

### Create the repository

1. Go to **https://github.com** and sign up for a free account (or sign in).
2. Click the **+** in the top-right corner, then **New repository**.
3. **Repository name:** for example `dtf-call-guide`.
4. Choose **Public**. Free GitHub accounts can only publish Pages from public repositories.
5. Leave everything else as it is and click **Create repository**.

### Upload the files

1. On the new repository's page, click the link **uploading an existing file**.
2. Drag in all six files: `index.html`, `content.js`, `template.html`, `build.mjs`, `README.md` and `.gitignore`.
   - `.gitignore` is hidden by default. On a **Mac**, press `⌘ Shift .` (period) in Finder to show hidden files. On **Windows**, in File Explorer choose **View → Show → Hidden items**. It's fine to skip `.gitignore` if it's a hassle.
3. Scroll down and click **Commit changes**.

### Turn on GitHub Pages

1. In the repository, click **Settings** (the tab with the gear icon).
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Under **Branch**, choose **main** and **/ (root)**, then click **Save**.
5. Wait 1–2 minutes and refresh the page. A box at the top will say **"Your site is live at https://YOUR-USERNAME.github.io/dtf-call-guide/"**.

That's the link to share with the team. On a phone, open it and use **Add to Home Screen** so it opens like an app.

> The page is public: anyone with the link can open it. It asks search engines not to list it, but don't put anything private in `content.js`.

---

## 4. Edit the content and publish the update

### Use a plain-text editor

- **Best:** [Visual Studio Code](https://code.visualstudio.com) (free). It colors the file so mistakes are easier to spot.
- **Also fine:** Notepad on Windows.
- **Avoid:** Word, Pages or Google Docs. On a Mac, TextEdit only works if you choose **Format → Make Plain Text** and turn off **Edit → Substitutions → Smart Quotes**. Smart quotes break the file.

### The steps

1. Open `content.js` and make your change. The comment at the top of the file explains the format.
2. Change `lastUpdated` near the top to today's date, e.g. `lastUpdated: "2026-12-01",`. It shows in the guide's footer.
3. Save the file.
4. Run `node build.mjs` and fix anything it reports.
5. Open `index.html` in your browser and check your change.
6. Upload **both `content.js` and `index.html`** to GitHub:
   - In the repository, click **Add file → Upload files**.
   - Drag in `content.js` and `index.html`. Files with the same name are replaced.
   - Click **Commit changes**.
7. Wait a minute, then reload the live site. If you still see the old version, force a fresh copy: `Ctrl Shift R` on Windows, `⌘ Shift R` on a Mac. On a phone, close the tab and open it again.

### Common edits

| You want to… | Do this in `content.js` |
|---|---|
| Change wording | Edit the text between the straight quotes `"..."`. |
| Answer a `[TBD: ...]` or `[CONFIRM: ...]` | Replace the whole bracket, including `[` and `]`, with the real info. The yellow badge disappears. |
| Make a word bold | Put two stars on each side: `**Toast POS**`. |
| Show a blank the cashier fills in | Put it in square brackets in a `say` line: `[your name]`. |
| Add a search word | Add it to that step's `keywords` list, in quotes, followed by a comma. |
| Add an explanation | Add `why: "..."` to an item. A **Why?** button appears next to it. |
| Mark a step as unfinished | Add `todo: true,` to the step. It shows a **Coming soon** label. |

Text rules that prevent most mistakes:

- Text goes inside **straight** double quotes: `"like this"`.
- Need quote marks *inside* the text? Use curly ones: `“like this”`. Apostrophes (`don't`) are fine as they are.
- Every item in a list ends with a comma.

### What the build's messages mean

| Message | What to do |
|---|---|
| *…goes to "xyz", but there is no step with that id* | A button points to a step that doesn't exist. Fix the spelling after `to:`. It usually suggests the right id. |
| *…can't be reached* | No button leads to this step. Add an option that points to it, or delete the step. |
| *…has no options* | Every step needs at least one button. End a topic with `{ label: "Done — wrap up", to: "wrap" },` |
| *The id "xyz" is used for 2 different steps* | Two steps have the same id. Rename one. |
| *content.js has a typo… around line N* | Usually a missing comma at the end of the line **above** the arrow, or a missing quote mark. It shows you the lines. |
| *curly quotes (“ ”) are being used around text* | Your editor changed `"` into `“ ”`. Retype them as straight quotes. |

---

## 5. Add a new topic (example: Takeout)

Takeout already exists as a placeholder: it's on the topic screen, marked **Coming soon**, and its card says the content hasn't been written yet. Here's how to fill it in. The wording below is only an example of the format. Replace every `[TBD: ...]` with the real procedure.

**Step 1.** In `content.js`, find the step that starts with `"takeout": {`. Replace it, from that line down to its closing `},`, with your new version. Remove `todo: true,` and point its options at new steps:

```js
    "takeout": {
      title: "Takeout orders",
      items: [
        { type: "ask", text: "“Would you like to place a new order, or is this about an order you already placed?”" },
      ],
      options: [
        { label: "Place a new order", to: "takeout-new" },
        { label: "Question about an existing order", to: "takeout-existing" },
      ],
      keywords: ["takeout", "take out", "to go", "pickup order", "order food", "carry out", "order ahead"],
    },
```

**Step 2.** Right after it, add the new steps. Each one ends at `wrap` so the call can continue:

```js
    "takeout-new": {
      title: "Place a takeout order",
      items: [
        { type: "info", text: "[TBD: how do guests place a takeout order?]" },
      ],
      options: [
        { label: "Done — wrap up", to: "wrap" },
      ],
      keywords: ["new order", "place an order", "order for pickup"],
    },

    "takeout-existing": {
      title: "Existing takeout order",
      items: [
        { type: "do", text: "[TBD: what should the cashier check, and where?]" },
      ],
      options: [
        { label: "Done — wrap up", to: "wrap" },
      ],
      keywords: ["my order", "order status", "is my order ready", "pickup time"],
    },
```

**Step 3.** Run `node build.mjs`. If you misspell an id, or forget to link a step, it tells you exactly where.

**Step 4.** Upload `content.js` and `index.html`.

### Adding a topic that isn't on the topic screen yet

Do the same, and also add a button for it to the `"hub"` step's `options` list. Give it a `hint` with something a guest might say:

```js
        { label: "Catering", hint: "“Do you do catering?”", to: "catering" },
```

The topic screen has room for 10 topics with number keys (1–9, then 0). An 11th topic still works, but it won't have a number key.

---

## 6. Using the guide

- **Tap the buttons** at the bottom of each card, or press the number keys **1–9** and **0**.
- **Tap an earlier card** to go back to that point in the call.
- **Top bar:** **Back** goes one step back. **Restart** starts a new call. **Topics** jumps to the topic list. **Map** shows every step. **Search** finds a step by the words guests use. Press **/** to search from the keyboard.
- **Why?** opens a short explanation under that line. **Menu → Training mode** opens every explanation at once for studying before a shift.
- **Links to a step:** the address bar always ends with the step's id, for example `…/dtf-call-guide/#res-5plus`. Use **Menu → Copy link to this step** to text a trainee the exact situation. The ids are the names in quotes in `content.js`. Useful ones:

| Situation | Link ending |
|---|---|
| Start of a call | `#ring` |
| Topic list | `#hub` |
| Party of 5 or more | `#res-5plus` |
| Running late / removed from waitlist | `#late` |
| Cancel a reservation | `#cancel` |
| Where we are now | `#loc-now` |
| Allergens | `#allergen` |
| Lost item | `#lost` |
| Order problem / refund | `#refund` |
| Gift card balance | `#gift` |

---

## 7. Checklist: info still needed

Each item shows as a yellow **Needs info** badge in the guide, and `node build.mjs` lists them every time it runs. Once you have the answer, replace the whole bracket in `content.js`.

- [ ] **Party of 1–2** (`res-1-2`) — CONFIRM: does the bar's 21+ ID rule apply to every guest in the party, or just one?
- [ ] **Private dining room** (`res-pdr`) — TBD: Guest Services phone
- [ ] **Private dining room** (`res-pdr`) — TBD: Guest Services email
- [ ] **Private dining room** (`res-pdr`) — CONFIRM: exact minimums (currently "about $600 lunch, about $1,000 dinner")
- [ ] **Running late / removed from the waitlist** (`late`) — CONFIRM: does the same 15-minute hold apply to reservations, or only to the waitlist?
- [ ] **Change the party size** (`chg-size`) — CONFIRM: the source notes say changes "from <4 to 4+" usually aren't possible, which conflicts with "any change within 1–4 is fine." The guide currently assumes the cutoff is moving into 5 or more.
- [ ] **Waive the cancellation fee** (`cancel-dnc`) — CONFIRM: writing "DNC" for anything within 24 hours goes beyond SOP (which only requires it under 2 hours), so confirm it with a manager.
- [ ] **The new location** (`loc-move`) — TBD: where is the new location, in case guests ask?
- [ ] **Takeout orders** (`takeout`) — TBD: takeout content hasn't been written yet (see section 5).
- [ ] **Menu items** (`menu-item`) — TBD: any other recent menu changes cashiers should know?
- [ ] **We have it** (`lost-found`) — TBD: pickup process, e.g. do they need ID, and how long do we hold items?
- [ ] **Not found (yet)** (`lost-notfound`) — TBD: where should the guest's name, number and item description be written down?
- [ ] **Something else** (`other`) — TBD: what should cashiers do for calls not covered here? (For example, put the guest on a brief hold and ask a manager?)
- [ ] **End the call** (`close`) — CONFIRM: is there a standard closing line?

### Draft explanations to review

These **Why?** explanations were written from context, not from official notes. They're marked `// draft` in `content.js`. Ask a manager to check them, then delete the `// draft` line.

- [ ] `ring` — why answer within 3 rings
- [ ] `greeting` — why use the same greeting every time
- [ ] `res-pdr` — why mention the minimum spend and Monday–Thursday limit up front
- [ ] `late` — why explain the 15-minute hold
- [ ] `chg-time` — why the guest books the new time before we cancel the old one
- [ ] `size-ok` — why add a note with your initials
- [ ] `size-large` — why G3 has to confirm first
- [ ] `loc-now` — why give landmarks
- [ ] `refund-olo` — why bring in a manager for website orders
- [ ] `refund-3p` — why only the delivery app can refund

---

## Troubleshooting

- **"node: command not found" / "'node' is not recognized"**: Node.js isn't installed, or the computer needs a restart after installing it.
- **"I can't find content.js"**: Terminal is in the wrong folder. See *How to open Terminal or Command Prompt "in this folder"* above.
- **The live site shows a 404 page**: wait a few minutes after turning on Pages, and check that `index.html` is in the top level of the repository, not inside a folder.
- **The live site didn't change**: check that you uploaded the new `index.html`, wait a minute, then force-refresh (`Ctrl Shift R` or `⌘ Shift R`).
- **Opening `template.html` shows "No content loaded"**: that's expected. Open `index.html` instead.
