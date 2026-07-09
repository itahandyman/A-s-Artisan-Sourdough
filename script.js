const WHATSAPP_NUMBER = "447348663199";

const MENU = [
  {
    name: "Artisan Loaves",
    icon: "🍞",
    items: [
      { id: "loaf-classic", name: "Classic Artisan Sourdough", tag: "Best Seller", price: 6.00 },
      { id: "loaf-rosemary", name: "Rosemary, Sundried Tomato & Cheese", tag: "Customer Favourite", price: 7.00 },
      { id: "loaf-double-cheese", name: "Double Cheese", price: 6.50 },
      { id: "loaf-cranberry-pecan", name: "Cranberry & Pecan", price: 7.00, nuts: true },
    ],
  },
  {
    name: "Sourdough Bagels",
    icon: "🥯",
    items: [
      { id: "bagels-4", name: "Bagels — Sesame, Cheese or Cheese & Chilli (box of 4)", price: 6.00 },
    ],
  },
  {
    name: "Sourdough Brioche Swirls",
    icon: "🥐",
    badge: "New",
    items: [
      { id: "brioche-vanilla-4", name: "Madagascan Vanilla Custard & Choc Chip (4)", price: 12.00 },
      { id: "brioche-vanilla-8", name: "Madagascan Vanilla Custard & Choc Chip (8)", price: 20.00 },
      { id: "brioche-frangipani-4", name: "Frangipani & Almond (4)", price: 12.00, nuts: true },
      { id: "brioche-frangipani-8", name: "Frangipani & Almond (8)", price: 20.00, nuts: true },
    ],
  },
  {
    name: "Sweet Treats",
    icon: "🧁",
    items: [
      { id: "muffins-4", name: "Blueberry & Lemon Muffins (box of 4)", price: 6.00 },
      { id: "muffins-12", name: "Blueberry & Lemon Muffins (box of 12)", price: 15.00 },
      { id: "cookie-1", name: "Sourdough Cookie — Single", price: 1.50 },
      { id: "cookies-6", name: "Sourdough Cookies (box of 6)", price: 6.00 },
      { id: "cookies-12", name: "Sourdough Cookies (box of 12)", price: 12.00 },
    ],
  },
  {
    name: "Mini Gift Set",
    icon: "🎁",
    items: [
      { id: "gift-set", name: "Classic Mini Loaf + 2 Inclusion Loaves", price: 10.00 },
    ],
  },
];

const BUNDLES = [
  {
    name: "Bundle Deals",
    icon: "🌾",
    items: [
      { id: "bundle-breakfast", name: "Breakfast Bundle — 4 Bagels + Muffin Box", price: 10.00 },
      { id: "bundle-family", name: "Family Favourite — Classic Loaf + Bagels + Cookies", price: 15.00 },
      { id: "bundle-sweet", name: "Sweet Treat Bundle — Muffins + 6 Cookies", price: 11.00 },
      { id: "bundle-lovers", name: "Bakery Lovers Bundle — Any 2 Loaves + 4 Muffins + 4 Bagels", tag: "Best Value", price: 20.00 },
    ],
  },
];

const ALL_ITEMS = [...MENU, ...BUNDLES].flatMap((group) => group.items);
const order = new Map();

function money(n) {
  return `£${n.toFixed(2)}`;
}

function renderGroups(groups, container) {
  container.innerHTML = "";
  groups.forEach((group) => {
    const card = document.createElement("div");
    card.className = "menu-card";

    const head = document.createElement("div");
    head.className = "menu-card-head";
    head.innerHTML = `
      <span class="menu-card-icon" aria-hidden="true">${group.icon}</span>
      <h3 class="menu-card-title">${group.name}</h3>
      ${group.badge ? `<span class="menu-card-badge">${group.badge}</span>` : ""}
    `;
    card.appendChild(head);

    group.items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "menu-item";
      row.innerHTML = `
        <div class="menu-item-info">
          <span class="menu-item-name">${item.name}${item.nuts ? ` <span title="Contains nuts" aria-label="Contains nuts">🥜</span>` : ""}</span>
          ${item.tag ? `<span class="menu-item-tag">${item.tag}</span>` : ""}
        </div>
        <span class="menu-item-price">${money(item.price)}</span>
        <div class="stepper" data-id="${item.id}">
          <button type="button" class="stepper-minus" aria-label="Remove one ${item.name}">&minus;</button>
          <span class="stepper-qty">0</span>
          <button type="button" class="stepper-plus" aria-label="Add one ${item.name}">+</button>
        </div>
      `;
      card.appendChild(row);
    });

    container.appendChild(card);
  });
}

function setQty(id, qty) {
  const item = ALL_ITEMS.find((i) => i.id === id);
  if (!item) return;
  if (qty <= 0) {
    order.delete(id);
  } else {
    order.set(id, qty);
  }
  document.querySelectorAll(`.stepper[data-id="${id}"]`).forEach((stepper) => {
    const qtyEl = stepper.querySelector(".stepper-qty");
    const minusBtn = stepper.querySelector(".stepper-minus");
    qtyEl.textContent = String(qty);
    minusBtn.disabled = qty <= 0;
  });
  renderOrder();
}

function getQty(id) {
  return order.get(id) || 0;
}

function renderOrder() {
  const list = document.getElementById("order-list");
  const totalEl = document.getElementById("order-total");
  const sendBtn = document.getElementById("send-order");
  const mobileBar = document.getElementById("mobile-order-bar");
  const mobileCount = document.getElementById("mobile-order-count");
  const mobileTotal = document.getElementById("mobile-order-total");

  list.innerHTML = "";
  let total = 0;
  let itemCount = 0;

  if (order.size === 0) {
    const li = document.createElement("li");
    li.className = "order-empty";
    li.textContent = "Your order is empty — add items from the menu above.";
    list.appendChild(li);
  } else {
    order.forEach((qty, id) => {
      const item = ALL_ITEMS.find((i) => i.id === id);
      if (!item) return;
      const lineTotal = item.price * qty;
      total += lineTotal;
      itemCount += qty;

      const li = document.createElement("li");
      li.innerHTML = `
        <span><span class="order-item-name">${qty} &times; ${item.name}</span>
        <button type="button" class="order-item-remove" data-id="${id}">remove</button></span>
        <span>${money(lineTotal)}</span>
      `;
      list.appendChild(li);
    });
  }

  totalEl.textContent = money(total);

  const message = buildMessage();
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  sendBtn.href = url;
  sendBtn.setAttribute("aria-disabled", order.size === 0 ? "true" : "false");

  mobileTotal.textContent = money(total);
  mobileCount.textContent = `${itemCount} item${itemCount === 1 ? "" : "s"}`;
  mobileBar.hidden = order.size === 0;
}

function buildMessage() {
  if (order.size === 0) {
    return "Hi! I'd like to place an order with A's Artisan Sourdough.";
  }
  const lines = ["Hi! I'd like to order the following from A's Artisan Sourdough:", ""];
  let total = 0;
  order.forEach((qty, id) => {
    const item = ALL_ITEMS.find((i) => i.id === id);
    if (!item) return;
    const lineTotal = item.price * qty;
    total += lineTotal;
    lines.push(`- ${qty} x ${item.name} (${money(lineTotal)})`);
  });
  lines.push("", `Total: ${money(total)}`, "", "Please let me know availability and collection time. Thank you!");
  return lines.join("\n");
}

function initSteppers(container) {
  container.addEventListener("click", (e) => {
    const plus = e.target.closest(".stepper-plus");
    const minus = e.target.closest(".stepper-minus");
    if (!plus && !minus) return;
    const stepper = e.target.closest(".stepper");
    const id = stepper.dataset.id;
    const current = getQty(id);
    setQty(id, plus ? current + 1 : Math.max(0, current - 1));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const menuContainer = document.getElementById("menu-groups");
  const bundleContainer = document.getElementById("bundle-groups");
  renderGroups(MENU, menuContainer);
  renderGroups(BUNDLES, bundleContainer);
  initSteppers(menuContainer);
  initSteppers(bundleContainer);
  renderOrder();

  document.getElementById("clear-order").addEventListener("click", () => {
    [...order.keys()].forEach((id) => setQty(id, 0));
  });

  document.getElementById("order-list").addEventListener("click", (e) => {
    const btn = e.target.closest(".order-item-remove");
    if (!btn) return;
    setQty(btn.dataset.id, 0);
  });

  document.getElementById("year").textContent = new Date().getFullYear();
});
