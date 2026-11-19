
(() => {
  "use strict";

  const data = window.WISHLIST_DATA || { gifts: [], messages: {} };
  const gifts = Array.isArray(data.gifts) ? data.gifts : [];

  const categories = [
    "All gifts",
    "Would Love",
    "Stocking Stuffers",
    "Practical Items",
    "Experiences",
    "Surprise Me"
  ];

  const roleNames = {
    parent: "Parent",
    sibling: "Sibling",
    grandparent: "Grandparent"
  };

  const roleIntros = {
    parent: "The family knows best. Here's a handy little guide.",
    sibling: "Let's see if you can finally make a good decision.",
    grandparent: "A thoughtful gift is lovely, but time together is even lovelier."
  };

  const $ = id => document.getElementById(id);

  let selectedRole = "friend";
  let activeCategory = "All gifts";
  let searchTerm = "";

  // Create the two private message pages.
  // Neither page has access to the wishlist.
  function createMessageScreen(id, title, emoji, message, extraMessage = "") {
    const section = document.createElement("section");
    section.id = id;
    section.className = "screen hidden";

    section.innerHTML = `
      <div style="
        max-width: 650px;
        margin: 50px auto;
        padding: 35px 25px;
        text-align: center;
        background: rgba(255,255,255,0.94);
        border-radius: 20px;
        box-shadow: 0 10px 35px rgba(0,0,0,0.08);
      ">
        <div style="font-size: 48px; margin-bottom: 12px;">
          ${emoji}
        </div>
        <p style="letter-spacing: 3px; font-size: 11px; font-weight: bold;">
          A LITTLE CHRISTMAS MESSAGE
        </p>
        <h2 style="font-size: 30px; margin: 12px 0;">
          ${title}
        </h2>
        <p id="${id}Message" style="
          line-height: 1.9;
          margin: 25px auto;
          white-space: pre-line;
        "></p>
        ${extraMessage ? `
          <div style="
            margin: 28px 0;
            padding: 22px;
            background: rgba(245,230,230,0.55);
            border-radius: 14px;
          ">
            <p id="${id}Extra" style="line-height: 1.8;"></p>
          </div>
        ` : ""}
        <p style="font-size: 13px; opacity: 0.7; line-height: 1.6;">
          No pressure. Just a little Christmas love. ❤️
        </p>
        <button id="${id}BackButton" type="button" style="
          margin-top: 18px;
          padding: 12px 24px;
          border: none;
          border-radius: 30px;
          cursor: pointer;
          font: inherit;
        ">
          Back to the beginning
        </button>
      </div>
    `;

    $("app").appendChild(section);

    $(`${id}BackButton`).addEventListener("click", () => {
      showScreen("welcomeScreen");
    });

    return section;
  }

  createMessageScreen(
    "friendScreen",
    "For my friends",
    "🥂",
    ""
  );

  createMessageScreen(
    "secretScreen",
    "Secret Admirer",
    "💌",
    "",
    " "
  );

  const screens = [
    "welcomeScreen",
    "relationshipScreen",
    "budgetScreen",
    "wishlistScreen",
    "friendScreen",
    "secretScreen"
  ];

  function showScreen(id) {
    screens.forEach(screenId => {
      const element = $(screenId);
      if (element) {
        element.classList.toggle("hidden", screenId !== id);
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const escapeHTML = value =>
    String(value ?? "").replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));

  const toast = message => {
    $("toast").textContent = message;
    $("toast").classList.add("show");
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(
      () => $("toast").classList.remove("show"),
      2400
    );
  };

  // Main navigation
  $("enterButton").addEventListener("click", () => {
    showScreen("relationshipScreen");
  });

  $("backToWelcome").addEventListener("click", () => {
    showScreen("welcomeScreen");
  });

  $("homeLink").addEventListener("click", e => {
    e.preventDefault();
    showScreen("welcomeScreen");
  });

  $("restartButton").addEventListener("click", () => {
    showScreen("welcomeScreen");
  });

  // Relationship selection
  $("relationshipOptions").addEventListener("click", e => {
    const button = e.target.closest("[data-role]");
    if (!button) return;

    selectedRole = button.dataset.role;

    if (selectedRole === "friend") {
      showFriendScreen();
      return;
    }

    if (selectedRole === "secret") {
      showSecretScreen();
      return;
    }

    if (roleNames[selectedRole]) {
      startWishlist();
    }
  });

  // Friend-only message page
  function showFriendScreen() {
    $("friendScreenMessage").textContent =
      data.messages?.friend ||
      "I don't need a present from you, but if you insist...\n\nTo be known is to be loved. Anything you think I'd like, I'll love. ❤️";

    showScreen("friendScreen");
  }

  // Secret Admirer-only message page
  function showSecretScreen() {
    const settings = data.generalNotes?.secretAdmirer || {};

    $("secretScreenMessage").textContent =
      settings.message ||
      "No presents here. If you've been keeping feelings for me a secret, write me a letter. Tell me who you are and what you've been wanting to say. Be brave—Christmas is a good time for honesty. 💌";

    $("secretScreenExtra").textContent =
      settings.snooperMessage ||
      "If you're family, a friend, or just snooping around: your Christmas assignment is to get me a boyfriend. I don't need another present—I need a man. Make some calls. Work your connections. Christmas miracles are encouraged. 😂";

    showScreen("secretScreen");
  }

  // Wishlist access is limited to family roles.
  function startWishlist() {
    $("routeEyebrow").textContent =
      `${roleNames[selectedRole].toUpperCase()} ACCESS GRANTED`;

    $("routeMessage").textContent =
      roleIntros[selectedRole] || "Welcome to the Christmas list.";

    $("welcomeNote").textContent =
      data.messages?.[selectedRole] ||
      "Thanks for visiting my Christmas wishlist!";

    activeCategory = "All gifts";
    searchTerm = "";
    $("searchInput").value = "";

    renderFilters();
    renderGifts();
    showScreen("wishlistScreen");
  }

  // Gift cards: no prices or priority labels.
  function giftCard(gift) {
    const image = gift.image
      ? `<img src="${escapeHTML(gift.image)}"
          alt="${escapeHTML(gift.name)}"
          loading="lazy"
          onerror="this.parentElement.innerHTML='<span>🎁</span>'">`
      : `<span aria-hidden="true">${escapeHTML(gift.emoji || "🎁")}</span>`;

    const link = gift.link
      ? `<a class="gift-link"
          href="${escapeHTML(gift.link)}"
          target="_blank"
          rel="noopener noreferrer">View inspiration ↗</a>`
      : "";

    return `
      <article class="gift-card">
        <div class="gift-image">${image}</div>
        <div class="gift-content">
          <div class="gift-meta">
            ${gift.favorite
              ? '<span class="favorite-mark" aria-label="Dani favourite">★</span>'
              : ""}
          </div>
          <h4>${escapeHTML(gift.name)}</h4>
          <p>${escapeHTML(gift.description)}</p>
          <div class="gift-bottom">
            <span class="gift-category">
              ${escapeHTML(gift.category || "Wishlist")}
            </span>
            ${link}
          </div>
        </div>
      </article>
    `;
  }

  function visibleGifts() {
    return gifts.filter(gift =>
      (activeCategory === "All gifts" ||
        gift.category === activeCategory) &&
      (`${gift.name} ${gift.description} ${gift.category}`)
        .toLowerCase()
        .includes(searchTerm)
    );
  }

  function renderFilters() {
    $("categoryFilters").innerHTML = categories.map(category => `
      <button
        class="filter-chip ${category === activeCategory ? "active" : ""}"
        data-category="${escapeHTML(category)}"
        aria-pressed="${category === activeCategory}">
        ${escapeHTML(category)}
      </button>
    `).join("");
  }

  function renderGifts() {
    const filtered = visibleGifts();

    $("giftGrid").innerHTML = filtered.map(giftCard).join("");

    $("itemCount").textContent =
      `${filtered.length} ${filtered.length === 1 ? "gift" : "gifts"}`;

    $("categoryHeading").textContent =
      activeCategory === "All gifts"
        ? "All the good stuff"
        : activeCategory;

    $("emptyState").classList.toggle("hidden", filtered.length !== 0);

    const favorites = gifts.filter(gift => gift.favorite);

    $("favoritesSection").classList.toggle(
      "hidden",
      favorites.length === 0 ||
      activeCategory !== "All gifts" ||
      searchTerm !== ""
    );

    $("favoriteGrid").innerHTML = favorites.map(giftCard).join("");
  }

  $("categoryFilters").addEventListener("click", e => {
    const button = e.target.closest("[data-category]");
    if (!button) return;

    activeCategory = button.dataset.category;
    renderFilters();
    renderGifts();
  });

  $("searchInput").addEventListener("input", e => {
    searchTerm = e.target.value.trim().toLowerCase();
    renderGifts();
  });

  // Surprise me
  $("surpriseButton").addEventListener("click", () => {
    const choices = visibleGifts();

    if (!choices.length) {
      toast("No gifts in this view — try another filter!");
      return;
    }

    const gift = choices[Math.floor(Math.random() * choices.length)];

    $("surpriseName").textContent = gift.name;
    $("surpriseDescription").textContent = gift.description;

    const link = $("surpriseLink");

    if (gift.link) {
      link.href = gift.link;
      link.classList.remove("hidden");
    } else {
      link.classList.add("hidden");
    }

    $("surpriseDialog").showModal();
  });

  $("closeDialog").addEventListener("click", () => {
    $("surpriseDialog").close();
  });

  // Snow
  let snowOn = true;

  function makeSnow() {
    $("snowLayer").innerHTML = "";

    if (
      !snowOn ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    for (let i = 0; i < 28; i++) {
      const flake = document.createElement("span");
      flake.className = "flake";
      flake.textContent = "❄";
      flake.style.left = `${Math.random() * 100}%`;
      flake.style.animationDuration = `${9 + Math.random() * 13}s`;
      flake.style.animationDelay = `${-Math.random() * 20}s`;
      flake.style.fontSize = `${7 + Math.random() * 9}px`;
      $("snowLayer").appendChild(flake);
    }
  }

  $("snowToggle").addEventListener("click", () => {
    snowOn = !snowOn;

    $("snowToggle").setAttribute("aria-pressed", String(snowOn));
    $("snowToggle").innerHTML =
      `<span>❄</span> Snow: ${snowOn ? "on" : "off"}`;

    makeSnow();
  });

  // Christmas countdown
  function updateCountdown() {
    const now = new Date();
    const year = now.getFullYear();

    let christmas = new Date(year, 11, 25, 0, 0, 0);

    if (now >= christmas) {
      christmas = new Date(year + 1, 11, 25, 0, 0, 0);
    }

    const days = Math.ceil((christmas - now) / 86400000);

    $("countdown").textContent =
      `🎄 ${days} ${days === 1 ? "day" : "days"} until Christmas`;
  }

  $("year").textContent = new Date().getFullYear();

  updateCountdown();
  makeSnow();
})();
