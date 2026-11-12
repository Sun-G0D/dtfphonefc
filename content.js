/*
  =====================================================================
  DTF U VILLAGE · PHONE CALL GUIDE — CONTENT FILE
  =====================================================================
  Every word in the guide lives in this file. You never need to open
  template.html or build.mjs to change what the guide says.

  AFTER ANY CHANGE
    1. Save this file.
    2. In Terminal (Mac) or Command Prompt (Windows), in this folder, run:
           node build.mjs
       It checks your work and creates a new index.html.
    3. Open index.html in your browser to check the change.
    4. Upload BOTH content.js and index.html to GitHub.

  HOW TO EDIT TEXT
    - Change only the words between the straight double quotes "like this".
    - Need quote marks inside the text? Use curly quotes “like this”.
      Apostrophes (don't, we're) are fine as they are.
    - Every line inside a list ends with a comma, including the last one.
    - **Two stars on each side** make text bold.
    - [Square brackets] in a "say" line highlight a blank the cashier
      fills in, like [your name].
    - [TBD: ...] and [CONFIRM: ...] show a yellow "Needs info" badge.
      Delete the whole bracket once you have the answer.
    - Lines starting with // are notes for you. The guide ignores them.
      "// draft" marks a "why" that was written from context and should
      be checked by a manager.
    - Change lastUpdated (just below) to today's date whenever you edit.

  WHAT ONE STEP LOOKS LIKE
      "step-id": {
        title: "Short title shown on the card",
        items: [
          { type: "say", text: "Words the cashier says out loud." },
          { type: "info", text: "A fact.", why: "Shown when Why? is tapped." },
        ],
        options: [
          { label: "Button text", to: "another-step-id" },
        ],
        keywords: ["words", "guests might use"],
      },

    - Item types: "say", "ask", "info", "do", "rule".
    - "why" is optional. It adds a Why? button to that item.
    - exact: true on a "say" item labels it "Say word for word".
    - hint on an option is an optional example line under the button,
      e.g. what the guest might say. The topic buttons use these.
    - Add  todo: true,  to a step to show a "Coming soon" label.

  ADD A NEW STEP
    1. Copy an existing step, from its "id": { line down to its closing },
    2. Paste it right after another step's closing },
    3. Give it a NEW id: lowercase letters, numbers and dashes only.
       The id is used in links, e.g. https://.../#my-new-step
    4. Change the title, items, options and keywords.
    5. Link to it from another step (see next).

  LINK AN OPTION TO ANOTHER STEP
    Inside any step's options list, add a line like:
        { label: "What the button says", to: "my-new-step" },
    "to" must be the id of a step that exists. To end a topic, use:
        { label: "Done — wrap up", to: "wrap" },

  The build stops and tells you what to fix if an option points to a
  step that doesn't exist, a step can't be reached, a step has no
  options, or two steps share an id.
  =====================================================================
*/

export default {
  meta: {
    title: "DTF U Village · Phone Call Guide",
    lastUpdated: "2026-11-11",
    version: "1.0.0",
  },

  // The step every call starts on.
  startId: "ring",

  nodes: {

    // ----------------------------------------------------------------
    // START OF EVERY CALL
    // ----------------------------------------------------------------

    "ring": {
      title: "Phone is ringing",
      items: [
        {
          type: "do",
          text: "Answer within 3 rings.",
          // draft
          why: "A quick pickup is the guest's first impression of the restaurant. Callers are often deciding where to eat right now.",
        },
      ],
      options: [
        { label: "I picked up", to: "greeting" },
      ],
      keywords: ["ring", "ringing", "phone", "answer", "pick up", "incoming call", "new call", "start", "3 rings", "three rings"],
    },

    "greeting": {
      title: "Greeting",
      items: [
        {
          type: "say",
          exact: true,
          text: "Hi there, thank you for calling Din Tai Fung University Village, this is [your name]. How can I help you?",
          // draft
          why: "Using the same greeting on every call tells guests they've reached the University Village location and who they're talking to.",
        },
      ],
      options: [
        { label: "Guest explains why they're calling", to: "hub" },
      ],
      keywords: ["greeting", "hello", "hi there", "what do I say", "script", "how to answer", "word for word", "opening line"],
    },

    "hub": {
      title: "What's the call about?",
      items: [
        { type: "ask", text: "Listen for why they're calling, then pick the topic." },
      ],
      options: [
        { label: "Reservations & waitlist", hint: "“Can I book a table for 6?”", to: "res-size" },
        { label: "Running late / removed from waitlist", hint: "“We got taken off the waitlist”", to: "late" },
        { label: "Change or cancel a reservation", hint: "“Can I move my reservation to 7?”", to: "change" },
        { label: "Location & the move", hint: "“Where exactly are you?”", to: "loc" },
        { label: "Takeout orders", hint: "“Can I order takeout?”", to: "takeout" },
        { label: "Allergens & menu", hint: "“Does this have peanuts?”", to: "menu" },
        { label: "Lost item", hint: "“I left my jacket there”", to: "lost" },
        { label: "Order problem / refund", hint: "“My order was missing an item”", to: "refund" },
        { label: "Gift card balance", hint: "“How much is left on my card?”", to: "gift" },
        { label: "Something else", hint: "Anything not on this list", to: "other" },
      ],
      keywords: ["topics", "topic list", "why are they calling", "reason for call", "main menu", "what is the call about"],
    },

    // ----------------------------------------------------------------
    // RESERVATIONS & WAITLIST
    // ----------------------------------------------------------------

    "res-size": {
      title: "Dine-in: reservations & waitlist",
      items: [
        { type: "rule", text: "Cashiers can't make reservations or add names to the waitlist over the phone. Point the guest to the right option instead." },
        {
          type: "ask",
          text: "“How many people will be in your party?”",
          why: "Party size decides which options are available. Parties of 1–2 have the most options and parties of 5+ have the fewest.",
        },
      ],
      options: [
        { label: "1–2 guests", to: "res-1-2" },
        { label: "3–4 guests", to: "res-3-4" },
        { label: "5 or more", to: "res-5plus" },
      ],
      keywords: ["reservation", "reserve", "book", "booking", "book a table", "table", "waitlist", "wait list", "how long is the wait", "wait time", "party size", "dine in", "dinner tonight", "lunch today", "put my name down", "add me to the list", "how many people"],
    },

    "res-1-2": {
      title: "Party of 1–2 (the most options)",
      items: [
        { type: "info", text: "Book a reservation online." },
        { type: "info", text: "Join the waitlist online." },
        { type: "info", text: "Join the waitlist in person. Only one person needs to come in to put the name down, but the whole party must be here when the table is ready." },
        {
          type: "info",
          text: "Sit at the bar: first come, first served, open seating. Usually faster than the main dining room. Requires a valid ID showing 21+. [CONFIRM: every guest in the party, or just one?]",
          why: "The bar is open seating on a first-come, first-served basis, so it's usually faster than waiting for a table in the main dining room.",
        },
      ],
      options: [
        { label: "Done — wrap up", to: "wrap" },
      ],
      keywords: ["party of 1", "party of 2", "table for one", "table for two", "just me", "two people", "couple", "date night", "solo", "bar", "bar seating", "21+", "id", "first come first served", "walk in", "online reservation", "online waitlist"],
    },

    "res-3-4": {
      title: "Party of 3–4",
      items: [
        { type: "info", text: "Same options as 1–2: book a reservation online, join the waitlist online, or join the waitlist in person (one person can put the name down, but the whole party must be here when the table is ready)." },
        {
          type: "rule",
          text: "Only very rarely suggest the bar for 3–4.",
          why: "The bar only has 3 tables that fit a party of 3–4, so it's rarely faster for them.",
        },
      ],
      options: [
        { label: "Done — wrap up", to: "wrap" },
      ],
      keywords: ["party of 3", "party of 4", "table for three", "table for four", "three people", "four people", "family", "bar", "online reservation", "online waitlist", "walk in"],
    },

    "res-5plus": {
      title: "Party of 5 or more",
      items: [
        {
          type: "info",
          text: "Online reservations and the online waitlist aren't available for 5+.",
          why: "Many calls about large parties come from guests the online system told to call us, so expect them. Online booking can't seat 5+, so the in-person waitlist and the private dining room are the only options.",
        },
        { type: "info", text: "There are two options: (1) come in person to join the waitlist, or (2) book a private dining room through Guest Services." },
      ],
      options: [
        { label: "Interested in a private dining room", to: "res-pdr" },
        { label: "They'll come in person", to: "wrap" },
      ],
      keywords: ["party of 5", "party of 6", "party of 7", "party of 8", "party of 10", "table for 6", "table for 8", "large party", "big group", "group", "birthday", "5 people", "6 people", "8 people", "website told me to call", "online said to call", "can't book online"],
    },

    "res-pdr": {
      title: "Private dining room",
      items: [
        { type: "info", text: "Booked through Guest Services, not the restaurant. Give the guest their contact info: phone [TBD: Guest Services phone], email [TBD: Guest Services email]." },
        { type: "info", text: "Available Monday–Thursday only." },
        {
          type: "info",
          text: "Minimum spend is about $600 for lunch and about $1,000 for dinner. [CONFIRM: exact minimums]",
          // draft
          why: "Mention the minimum and the Monday–Thursday limit up front so the guest can decide before contacting Guest Services.",
        },
      ],
      options: [
        { label: "Done — wrap up", to: "wrap" },
      ],
      keywords: ["private dining room", "private room", "pdr", "event", "party room", "banquet", "corporate", "company dinner", "minimum spend", "guest services", "monday", "thursday"],
    },

    // ----------------------------------------------------------------
    // RUNNING LATE / REMOVED FROM WAITLIST
    // ----------------------------------------------------------------

    "late": {
      title: "Running late / removed from the waitlist",
      items: [
        { type: "info", text: "When we notify a party that their table is ready, we hold it for up to 15 minutes. After that, the table goes to the next party. [CONFIRM: does the same 15-minute hold apply to reservations, or only to the waitlist?]" },
        {
          type: "say",
          text: "No problem! When you get here, just let the greeters at the front know you're running late. They'll put you back on the waitlist for the next available table, so you'll be first in line and usually won't wait more than about 15 minutes.",
          // draft
          why: "Guests who were removed can feel brushed off. Explaining the 15-minute hold shows it's policy, not personal, and telling them they'll be first in line shows they aren't starting over.",
        },
      ],
      options: [
        { label: "Done — wrap up", to: "wrap" },
      ],
      keywords: ["late", "running late", "removed", "taken off", "kicked off the waitlist", "missed my table", "missed the text", "lost my spot", "15 minutes", "hold my table", "stuck in traffic", "on my way"],
    },

    // ----------------------------------------------------------------
    // CHANGE OR CANCEL A RESERVATION
    // ----------------------------------------------------------------

    "change": {
      title: "Change or cancel a reservation",
      items: [
        { type: "ask", text: "“What would you like to change?”" },
      ],
      options: [
        { label: "The time", to: "chg-time" },
        { label: "The party size", to: "chg-size" },
        { label: "Cancel it", to: "cancel" },
      ],
      keywords: ["change reservation", "modify", "move my reservation", "reschedule", "update reservation", "edit booking", "existing reservation"],
    },

    "chg-time": {
      title: "Change the reservation time",
      items: [
        { type: "rule", text: "We can't change the time of an existing reservation, and cashiers can't make reservations over the phone." },
        {
          type: "say",
          text: "Unfortunately we can't move an existing reservation, but if you book a new one online for the time you'd like, we're happy to cancel the old one for you.",
          // draft
          why: "The guest books the new time themselves because we can't. We only cancel the old one after the new one is booked so they never lose their spot.",
        },
      ],
      options: [
        { label: "They've booked the new time, so cancel the old one", to: "cancel" },
        { label: "Done — wrap up", to: "wrap" },
      ],
      keywords: ["change time", "move to 7", "earlier", "later", "reschedule", "different time", "different day", "push back", "move my reservation", "new time"],
    },

    "chg-size": {
      title: "Change the party size",
      items: [
        { type: "ask", text: "“How many people is the reservation for now, and how many will there be?”" },
        { type: "info", text: "[CONFIRM: the source notes say changes “from <4 to 4+” usually aren't possible, which conflicts with “any change within 1–4 is fine.” This flow assumes the cutoff is moving into 5 or more.]" },
      ],
      options: [
        { label: "Staying within 1–4 guests (for example, 2 → 4)", to: "size-ok" },
        { label: "Going to 5+, or the party is already 5+", to: "size-large" },
      ],
      keywords: ["more people", "fewer people", "add a person", "add guests", "extra person", "party size", "bigger party", "smaller party", "bringing a friend", "one more person", "change number of guests"],
    },

    "size-ok": {
      title: "Party size change within 1–4",
      items: [
        {
          type: "do",
          text: "Update the party size in **Yelp Guest Manager**, then add a note about the change with your initials.",
          // draft
          why: "The note and initials show who made the change, in case the host stand has questions.",
        },
      ],
      options: [
        { label: "Done — wrap up", to: "wrap" },
      ],
      keywords: ["update party size", "yelp", "yelp guest manager", "initials", "note", "2 to 4", "3 to 4", "add one person"],
    },

    "size-large": {
      title: "Party size change involving 5+",
      items: [
        { type: "info", text: "Usually not possible, except in special circumstances." },
        { type: "do", text: "If you're not too busy, check with G3 whether the change can be made." },
        {
          type: "info",
          text: "Even if G3 approves it, let the guest know it will probably mean an extra wait.",
          // draft
          why: "Tables for larger parties are limited, so G3 has to confirm before anything is promised.",
        },
      ],
      options: [
        { label: "Done — wrap up", to: "wrap" },
      ],
      keywords: ["g3", "5 people", "6 people", "party of 5", "party of 6", "bigger group", "large party change", "special circumstances", "extra wait"],
    },

    "cancel": {
      title: "Cancel a reservation",
      items: [
        { type: "do", text: "Find the reservation in **Yelp Guest Manager** and cancel it." },
        { type: "ask", text: "Is the reservation within the next 24 hours?" },
      ],
      options: [
        { label: "Yes, within 24 hours", to: "cancel-dnc" },
        { label: "No, more than 24 hours away", to: "wrap" },
      ],
      keywords: ["cancel", "cancellation", "can't make it", "not coming", "cancel my reservation", "cancellation fee", "no show", "yelp", "24 hours"],
    },

    "cancel-dnc": {
      title: "Waive the cancellation fee",
      items: [
        { type: "say", text: "I'll make sure you won't be charged a cancellation fee." },
        {
          type: "do",
          text: "In the reservation's guest notes in **Yelp Guest Manager**, write “DNC” followed by your initials (for example, “DNC JS”).",
          why: "“DNC” means “do not charge.” SOP only requires it for cancellations made less than 2 hours before the reservation (or after it), but writing it for anything within 24 hours means guests are never surprised by a fee. [CONFIRM: the 24-hour practice goes beyond SOP, so confirm it with a manager]",
        },
      ],
      options: [
        { label: "Done — wrap up", to: "wrap" },
      ],
      keywords: ["dnc", "do not charge", "waive fee", "cancellation fee", "no charge", "within 24 hours", "same day cancel", "will I be charged", "fee"],
    },

    // ----------------------------------------------------------------
    // LOCATION & THE MOVE
    // ----------------------------------------------------------------

    "loc": {
      title: "Location & the move",
      items: [
        { type: "ask", text: "“Are you asking where we are now, or about our move?”" },
      ],
      options: [
        { label: "Where are you?", to: "loc-now" },
        { label: "When are you moving?", to: "loc-move" },
      ],
      keywords: ["location", "address", "where", "directions", "move", "moving", "relocation", "new location", "find you"],
    },

    "loc-now": {
      title: "Where we are now",
      items: [
        {
          type: "say",
          text: "We're on the second floor of the parking garage at the south end of U Village, right next to the Tesla store and very close to Chipotle. Look for the big red sign out front with the Din Tai Fung characters on it.",
          // draft
          why: "The garage location is easy to miss from street level, so landmarks and the red sign help guests find us.",
        },
      ],
      options: [
        { label: "Done — wrap up", to: "wrap" },
      ],
      keywords: ["where are you", "address", "directions", "parking garage", "second floor", "2nd floor", "tesla", "chipotle", "can't find you", "how do I get there", "red sign", "u village", "university village", "parking"],
    },

    "loc-move": {
      title: "The new location",
      items: [
        { type: "info", text: "The move has been pushed back several times. It was originally planned for Q4 2026, and the current estimate is around February 2027 (as of November 2026)." },
        {
          type: "say",
          text: "We're currently expecting to move around February 2027, but the date has changed before, so it's best to check back closer to then.",
          why: "The date has already moved several times, so give it as an estimate, not a promise.",
        },
        { type: "info", text: "[TBD: where is the new location, in case guests ask?]" },
      ],
      options: [
        { label: "Done — wrap up", to: "wrap" },
      ],
      keywords: ["move", "moving", "relocating", "relocation", "new location", "new restaurant", "when are you moving", "february 2027", "are you closing", "closing"],
    },

    // ----------------------------------------------------------------
    // TAKEOUT (not written yet)
    // ----------------------------------------------------------------

    "takeout": {
      title: "Takeout orders",
      todo: true,
      items: [
        { type: "info", text: "[TBD: takeout content hasn't been written yet.]" },
      ],
      options: [
        { label: "Done — wrap up", to: "wrap" },
      ],
      keywords: ["takeout", "take out", "to go", "pickup order", "order food", "carry out", "phone order", "order ahead"],
    },

    // ----------------------------------------------------------------
    // ALLERGENS & MENU
    // ----------------------------------------------------------------

    "menu": {
      title: "Allergens & menu",
      items: [
        { type: "ask", text: "“Is this about an allergy, or about a specific menu item?”" },
      ],
      options: [
        { label: "Allergy or ingredient question", to: "allergen" },
        { label: "“Do you still have…?” or other menu question", to: "menu-item" },
      ],
      keywords: ["menu", "allergy", "allergen", "ingredients", "dish", "food", "what's in"],
    },

    "allergen": {
      title: "Allergens & ingredients",
      items: [
        { type: "do", text: "Check the allergen cheat sheet in the **runner training binder**, and/or look up the item's allergens in **Toast POS**." },
        {
          type: "do",
          text: "If the guest is worried about an ingredient that isn't normally listed as an allergen, go the extra mile and check the full ingredient list in the **runners' binder**.",
          why: "The cheat sheet and Toast cover the standard allergens. The full ingredient list catches anything else a guest is concerned about.",
        },
      ],
      options: [
        { label: "Done — wrap up", to: "wrap" },
      ],
      keywords: ["allergy", "allergic", "allergen", "peanut", "peanuts", "nuts", "tree nuts", "shellfish", "shrimp", "gluten", "wheat", "celiac", "dairy", "milk", "egg", "soy", "sesame", "fish", "msg", "pork", "vegetarian", "vegan", "ingredients", "does this have", "cheat sheet", "binder", "toast"],
    },

    "menu-item": {
      title: "Menu items",
      items: [
        { type: "info", text: "Rice cakes have been removed from the menu because they weren't a very popular item (as of November 2026)." },
        { type: "info", text: "[TBD: any other recent menu changes cashiers should know?]" },
      ],
      options: [
        { label: "Done — wrap up", to: "wrap" },
      ],
      keywords: ["rice cakes", "do you still have", "discontinued", "removed from menu", "menu change", "no longer", "menu item", "favorite dish"],
    },

    // ----------------------------------------------------------------
    // LOST ITEM
    // ----------------------------------------------------------------

    "lost": {
      title: "Lost item",
      items: [
        {
          type: "ask",
          text: "“What did you leave behind?”",
          why: "Where we keep an item depends on what it is. Valuables (jewelry, credit cards, IDs, wallets, etc.) go in the manager safe. Everyday items (clothes, water bottles, etc.) go in the lost & found bins at the cashier station.",
        },
      ],
      options: [
        { label: "Something valuable (jewelry, card, ID, wallet…)", to: "lost-safe" },
        { label: "An everyday item (clothes, water bottle…)", to: "lost-bins" },
      ],
      keywords: ["lost", "left", "forgot", "left behind", "lost and found", "lost & found", "jacket", "wallet", "phone", "keys", "umbrella", "bag", "lost item", "left my"],
    },

    "lost-safe": {
      title: "Check the manager safe",
      items: [
        { type: "do", text: "Ask a manager to check the safe. You need a manager's help to look for the item and to retrieve it." },
      ],
      options: [
        { label: "Found it", to: "lost-found" },
        { label: "Not there", to: "lost-notfound" },
      ],
      keywords: ["wallet", "credit card", "debit card", "card", "id", "driver's license", "license", "jewelry", "earring", "necklace", "bracelet", "watch", "valuable", "safe", "manager safe"],
    },

    "lost-bins": {
      title: "Check the lost & found bins",
      items: [
        { type: "do", text: "Check the lost & found bins at the cashier station." },
      ],
      options: [
        { label: "Found it", to: "lost-found" },
        { label: "Not there", to: "lost-notfound" },
      ],
      keywords: ["jacket", "coat", "sweater", "hoodie", "scarf", "hat", "gloves", "clothes", "water bottle", "bottle", "tumbler", "lost and found bin", "bins"],
    },

    "lost-found": {
      title: "We have it",
      items: [
        { type: "info", text: "Let the guest know we have it and they can come pick it up. [TBD: pickup process, e.g., do they need ID, and how long do we hold items?]" },
      ],
      options: [
        { label: "Done — wrap up", to: "wrap" },
      ],
      keywords: ["found it", "we have it", "come pick it up", "pick up lost item", "come get it"],
    },

    "lost-notfound": {
      title: "Not found (yet)",
      items: [
        {
          type: "do",
          text: "Take the guest's name, phone number, and a description of the item. [TBD: where should this be written down?]",
          why: "If the item turns up later, we can call them to come pick it up.",
        },
      ],
      options: [
        { label: "Done — wrap up", to: "wrap" },
      ],
      keywords: ["not found", "can't find it", "call me if you find it", "contact info", "description", "phone number"],
    },

    // ----------------------------------------------------------------
    // ORDER PROBLEM / REFUND
    // ----------------------------------------------------------------

    "refund": {
      title: "Order problem / refund",
      items: [
        {
          type: "ask",
          text: "“How did you place your order: on our website, or through an app like DoorDash or Uber Eats?”",
          why: "Who handles the refund depends on where the order was placed.",
        },
      ],
      options: [
        { label: "Our website (OLO)", to: "refund-olo" },
        { label: "DoorDash, Uber Eats, or another delivery app", to: "refund-3p" },
        { label: "Not sure", to: "refund-lookup" },
      ],
      keywords: ["refund", "missing item", "wrong order", "order problem", "complaint", "missing", "forgot my", "money back", "delivery", "online order", "olo", "order was wrong"],
    },

    "refund-lookup": {
      title: "Look up the order",
      items: [
        { type: "do", text: "Ask for the guest's name and search for it in **Toast POS** to see where the order came from." },
      ],
      options: [
        { label: "Our website (OLO)", to: "refund-olo" },
        { label: "Third-party delivery app", to: "refund-3p" },
      ],
      keywords: ["not sure", "don't know", "look up order", "find order", "order name", "which app", "toast"],
    },

    "refund-olo": {
      title: "Website order (OLO)",
      items: [
        {
          type: "do",
          text: "Call a manager on the **walkie-talkie** and brief them: the guest's name, the order, and what was wrong or missing. The manager decides the best compensation.",
          // draft
          why: "For orders placed on our website, the manager decides how to make it right, so bring them in rather than promising anything yourself.",
        },
      ],
      options: [
        { label: "Done — wrap up", to: "wrap" },
      ],
      keywords: ["website order", "online order", "olo", "ordered online", "our website", "manager", "compensation", "walkie", "walkie-talkie"],
    },

    "refund-3p": {
      title: "Third-party delivery order",
      items: [
        {
          type: "say",
          text: "I'm so sorry about that! Since the order went through [DoorDash / Uber Eats], their customer support handles refunds. You can reach them through the app.",
          // draft
          why: "The order and payment went through the delivery app, so only that app's support can refund it.",
        },
      ],
      options: [
        { label: "Done — wrap up", to: "wrap" },
      ],
      keywords: ["doordash", "door dash", "uber eats", "ubereats", "delivery app", "third party", "delivery driver", "dasher", "app support"],
    },

    // ----------------------------------------------------------------
    // GIFT CARD BALANCE
    // ----------------------------------------------------------------

    "gift": {
      title: "Gift card balance",
      items: [
        { type: "info", text: "Guests can check their balance online on the Din Tai Fung website, but we're happy to check it over the phone." },
        { type: "ask", text: "“Could I get the number on the gift card?”" },
        {
          type: "do",
          text: "In **Toast POS**, use **Balance Inquiry** and read the balance to the guest.",
          why: "Some guests would rather call than check online, and Toast's Balance Inquiry makes it quick.",
        },
      ],
      options: [
        { label: "Done — wrap up", to: "wrap" },
      ],
      keywords: ["gift card", "gift card balance", "balance", "how much is left", "card balance", "check balance", "remaining balance", "balance inquiry", "toast"],
    },

    // ----------------------------------------------------------------
    // SOMETHING ELSE
    // ----------------------------------------------------------------

    "other": {
      title: "Something else",
      items: [
        { type: "info", text: "[TBD: what should cashiers do for calls not covered here? For example, put the guest on a brief hold and ask a manager?]" },
      ],
      options: [
        { label: "Done — wrap up", to: "wrap" },
      ],
      keywords: ["other", "something else", "not listed", "not covered", "don't know", "hold", "manager", "hours", "hiring", "job", "catering"],
    },

    // ----------------------------------------------------------------
    // END OF EVERY CALL
    // ----------------------------------------------------------------

    "wrap": {
      title: "Anything else?",
      items: [
        { type: "ask", text: "“Is there anything else I can help you with?”" },
      ],
      options: [
        { label: "Yes", hint: "Back to the topics", to: "hub" },
        { label: "No, that's all", to: "close" },
      ],
      keywords: ["wrap up", "anything else", "finish", "end of call", "another question"],
    },

    "close": {
      title: "End the call",
      items: [
        { type: "say", text: "Thank you for calling Din Tai Fung University Village. Have a great day! [CONFIRM: is there a standard closing line?]" },
      ],
      options: [
        { label: "Start a new call", to: "ring" },
      ],
      keywords: ["goodbye", "bye", "end call", "hang up", "closing line", "thank you for calling", "have a great day"],
    },

  },
};
