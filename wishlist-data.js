/*
  DANI'S WISHLIST — THE ONLY FILE YOU NEED TO EDIT 🎁

  Add, edit or remove gift objects inside the gifts array below.
  Keep commas between objects. Use double quotes around text.
  To remove an item, delete its whole { ... } block and its comma.
  To add a photo, paste an image URL into "image". Leave "" for the emoji placeholder.

  category must be one of:
  "Most Wanted", "Would Love", "Stocking Stuffers",
  "Practical Items", "Experiences", "Surprise Me"

  priority can be: "Top", "High", "Medium", "Low"
  priceBand can be: "small" (under $30), "medium" ($30–$75),
                    "big" ($75+), or "any".
  A blank link displays the item without a shop button.
*/

window.WISHLIST_DATA = {
  gifts: [
    {
      id: "basketball-shoes",
      name: "Basketball shoes",
      description: "A fresh pair for the court. Add your preferred brand, size or style here.",
      category: "Most Wanted",
      priority: "Top",
      priceBand: "big",
      link: "",
      image: "",
      emoji: "🏀",
      favorite: true
    },
    {
      id: "cozy-set",
      name: "Cozy matching set",
      description: "Something ridiculously comfortable for lounging, travelling and everything in between.",
      category: "Would Love",
      priority: "High",
      priceBand: "medium",
      link: "",
      image: "",
      emoji: "🧸",
      favorite: true
    },
    {
      id: "everyday-water-bottle",
      name: "Cute everyday water bottle",
      description: "A practical one that is also cute enough to take everywhere.",
      category: "Practical Items",
      priority: "Medium",
      priceBand: "small",
      link: "",
      image: "",
      emoji: "🥤",
      favorite: false
    },
    {
      id: "little-luxury",
      name: "Little luxury treat",
      description: "A small self-care or beauty treat. Surprise me with something lovely.",
      category: "Stocking Stuffers",
      priority: "Medium",
      priceBand: "small",
      link: "",
      image: "",
      emoji: "💄",
      favorite: false
    },
    {
      id: "coffee-date",
      name: "Coffee or brunch date",
      description: "Time together, a good coffee and a catch-up. Honestly, a perfect gift.",
      category: "Experiences",
      priority: "High",
      priceBand: "medium",
      link: "",
      image: "",
      emoji: "☕",
      favorite: true
    },
    {
      id: "surprise-me",
      name: "A total surprise",
      description: "If you see something and think of me, trust your instincts. I love a good surprise.",
      category: "Surprise Me",
      priority: "Low",
      priceBand: "any",
      link: "",
      image: "",
      emoji: "🎀",
      favorite: false
    }
  ],

  /*
    Optional: change the text for each relationship.
    These messages appear at the top of the wishlist.
  */
  messages: {
    parent: "Welcome to the family gifting department. You know me well — this is your official shortcut to getting it right. ❤️",
    sibling: "Well, well, well. My favourite lifelong rival. Your mission: get me something good. No regifting questionable stuff from your room.",
    grandparent: "Hello, my lovely! Please know that spending time together is always the best present. I've added a few ideas to make choosing something easy. ❤️",
    friend: "You made it! Consider this your curated guide to things I would happily unwrap. Festive drinks and excellent gift choices await.",
    coworker: "Welcome, colleague in Christmas crime. Here are a few ideas at different price points — easy, lovely, no awkward office guessing.",
    secret: "A SECRET ADMIRER?! Scandalous. Please remain calm, consult the list, and remember: excellent taste is extremely attractive. 😏"
  }
};
