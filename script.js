(() => {
  "use strict";
  const data = window.WISHLIST_DATA || { gifts: [], messages: {} };
  const gifts = Array.isArray(data.gifts) ? data.gifts : [];
  const categories = ["All gifts", "Most Wanted", "Would Love", "Stocking Stuffers", "Practical Items", "Experiences", "Surprise Me"];
  const roleNames = {parent:"Parent", sibling:"Sibling", grandparent:"Grandparent", friend:"Friend", coworker:"Coworker", secret:"Secret Admirer"};
  const roleIntros = {
    parent:"The family knows best. Here's a handy little guide.",
    sibling:"Let's see if you can finally make a good decision.",
    grandparent:"A thoughtful gift is lovely, but time together is even lovelier.",
    friend:"You know the vibe. Here's the inside scoop.",
    coworker:"A few easy ideas to make holiday gifting a breeze.",
    secret:"Well, this is mysterious. Let's make it a memorable Christmas."
  };
  const $ = id => document.getElementById(id);
  let selectedRole = "friend", selectedBudget = "any", activeCategory = "All gifts", searchTerm = "";
  const screens = ["welcomeScreen","relationshipScreen","budgetScreen","wishlistScreen"];
  const showScreen = id => screens.forEach(s => $(s).classList.toggle("hidden", s !== id));
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const toast = message => {
    $("toast").textContent = message; $("toast").classList.add("show");
    window.clearTimeout(toast.timer); toast.timer = window.setTimeout(() => $("toast").classList.remove("show"), 2400);
  };

  $("enterButton").addEventListener("click", () => showScreen("relationshipScreen"));
  $("backToWelcome").addEventListener("click", () => showScreen("welcomeScreen"));
  $("backToRoles").addEventListener("click", () => showScreen("relationshipScreen"));
  $("homeLink").addEventListener("click", e => { e.preventDefault(); showScreen("welcomeScreen"); });
  $("relationshipOptions").addEventListener("click", e => {
    const button = e.target.closest("[data-role]"); if (!button) return;
    selectedRole = button.dataset.role; showScreen("budgetScreen");
  });
  $("budgetOptions").addEventListener("click", e => {
    const button = e.target.closest("[data-budget]"); if (!button) return;
    selectedBudget = button.dataset.budget; startWishlist();
  });

  function startWishlist() {
    $("routeEyebrow").textContent = `${roleNames[selectedRole].toUpperCase()} ACCESS GRANTED`;
    $("routeMessage").textContent = roleIntros[selectedRole] || "Welcome to the Christmas list.";
    $("welcomeNote").textContent = data.messages?.[selectedRole] || "Thanks for visiting my Christmas wishlist!";
    activeCategory = "All gifts"; searchTerm = ""; $("searchInput").value = "";
    renderFilters(); renderGifts(); showScreen("wishlistScreen");
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function matchesBudget(gift) {
    return selectedBudget === "any" || gift.priceBand === selectedBudget || gift.priceBand === "any";
  }
  function giftCard(gift) {
    const priority = String(gift.priority || "Medium").toLowerCase();
    const image = gift.image
      ? `<img src="${escapeHTML(gift.image)}" alt="${escapeHTML(gift.name)}" loading="lazy" onerror="this.parentElement.textContent='${escapeHTML(gift.emoji || "🎁")}'">`
      : `<span aria-hidden="true">${escapeHTML(gift.emoji || "🎁")}</span>`;
    const link = gift.link
      ? `<a class="gift-link" href="${escapeHTML(gift.link)}" target="_blank" rel="noopener noreferrer">View gift ↗</a>`
      : `<span class="gift-category">LINK COMING SOON</span>`;
    return `<article class="gift-card">
      <div class="gift-image">${image}</div>
      <div class="gift-content">
        <div class="gift-meta"><span class="priority ${priority}">${escapeHTML(gift.priority || "Medium")} priority</span>${gift.favorite ? '<span class="favorite-mark" aria-label="Dani favourite">★</span>' : ""}</div>
        <h4>${escapeHTML(gift.name)}</h4><p>${escapeHTML(gift.description)}</p>
        <div class="gift-bottom"><span class="gift-category">${escapeHTML(gift.category || "Wishlist")}</span>${link}</div>
      </div></article>`;
  }
  function visibleGifts() {
    return gifts.filter(g => matchesBudget(g) &&
      (activeCategory === "All gifts" || g.category === activeCategory) &&
      (`${g.name} ${g.description} ${g.category}`.toLowerCase().includes(searchTerm)));
  }
  function renderFilters() {
    $("categoryFilters").innerHTML = categories.map(c =>
      `<button class="filter-chip ${c === activeCategory ? "active" : ""}" data-category="${escapeHTML(c)}" aria-pressed="${c === activeCategory}">${escapeHTML(c)}</button>`
    ).join("");
  }
  function renderGifts() {
    const filtered = visibleGifts();
    $("giftGrid").innerHTML = filtered.map(giftCard).join("");
    $("itemCount").textContent = `${filtered.length} ${filtered.length === 1 ? "gift" : "gifts"}`;
    $("categoryHeading").textContent = activeCategory === "All gifts" ? "All the good stuff" : activeCategory;
    $("emptyState").classList.toggle("hidden", filtered.length !== 0);
    const favorites = gifts.filter(g => g.favorite && matchesBudget(g));
    $("favoritesSection").classList.toggle("hidden", favorites.length === 0 || activeCategory !== "All gifts" || searchTerm !== "");
    $("favoriteGrid").innerHTML = favorites.map(giftCard).join("");
  }
  $("categoryFilters").addEventListener("click", e => {
    const button = e.target.closest("[data-category]"); if (!button) return;
    activeCategory = button.dataset.category; renderFilters(); renderGifts();
  });
  $("searchInput").addEventListener("input", e => { searchTerm = e.target.value.trim().toLowerCase(); renderGifts(); });

  $("surpriseButton").addEventListener("click", () => {
    const choices = visibleGifts();
    if (!choices.length) { toast("No gifts in this view — try another filter!"); return; }
    const gift = choices[Math.floor(Math.random() * choices.length)];
    $("surpriseName").textContent = gift.name;
    $("surpriseDescription").textContent = gift.description;
    const link = $("surpriseLink");
    if (gift.link) { link.href = gift.link; link.classList.remove("hidden"); }
    else { link.classList.add("hidden"); }
    $("surpriseDialog").showModal();
  });
  $("closeDialog").addEventListener("click", () => $("surpriseDialog").close());
  $("restartButton").addEventListener("click", () => showScreen("welcomeScreen"));

  let snowOn = true;
  function makeSnow() {
    $("snowLayer").innerHTML = "";
    if (!snowOn || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (let i=0; i<28; i++) {
      const flake = document.createElement("span"); flake.className = "flake"; flake.textContent = "❄";
      flake.style.left = `${Math.random()*100}%`; flake.style.animationDuration = `${9+Math.random()*13}s`;
      flake.style.animationDelay = `${-Math.random()*20}s`; flake.style.fontSize = `${7+Math.random()*9}px`;
      $("snowLayer").appendChild(flake);
    }
  }
  $("snowToggle").addEventListener("click", () => {
    snowOn = !snowOn; $("snowToggle").setAttribute("aria-pressed", String(snowOn));
    $("snowToggle").innerHTML = `<span>❄</span> Snow: ${snowOn ? "on" : "off"}`; makeSnow();
  });
  function updateCountdown() {
    const now = new Date(), year = now.getFullYear();
    let christmas = new Date(year,11,25,0,0,0);
    if (now >= christmas) christmas = new Date(year+1,11,25,0,0,0);
    const days = Math.ceil((christmas-now)/86400000);
    $("countdown").textContent = `🎄 ${days} ${days === 1 ? "day" : "days"} until Christmas`;
  }
  $("year").textContent = new Date().getFullYear();
  updateCountdown(); makeSnow();
})();
