const scrollButtons = document.querySelectorAll("[data-scroll-target]");
const gallery = document.querySelector("#gallery");
const galleryForward = document.querySelector("#scrollGallery");
const galleryLeft = document.querySelector(".gallery-nav--left");
const galleryRight = document.querySelector(".gallery-nav--right");
const progressThumb = document.querySelector(".gallery-progress span");
const form = document.querySelector("#requestForm");
const statusLine = document.querySelector(".form-status");

scrollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.scrollTarget);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

function moveGallery(direction = 1) {
  if (!gallery) return;
  const card = gallery.querySelector(".gallery-card");
  const step = card ? card.getBoundingClientRect().width + 22 : 260;
  gallery.scrollBy({ left: step * direction, behavior: "smooth" });
}

function updateGalleryProgress() {
  if (!gallery || !progressThumb) return;
  const max = gallery.scrollWidth - gallery.clientWidth;
  const ratio = max > 0 ? gallery.scrollLeft / max : 0;
  progressThumb.style.transform = `translateX(${Math.round(ratio * 260)}%)`;
}

galleryForward?.addEventListener("click", () => moveGallery(1));
galleryRight?.addEventListener("click", () => moveGallery(1));
galleryLeft?.addEventListener("click", () => moveGallery(-1));
gallery?.addEventListener("scroll", updateGalleryProgress, { passive: true });
window.addEventListener("resize", updateGalleryProgress);
updateGalleryProgress();

document.querySelectorAll(".accordion-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".accordion-item");
    const isOpen = item.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
    button.querySelector(".accordion-icon").textContent = isOpen ? "−" : "+";
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const contact = String(data.get("contact") || "").trim();
  const goal = String(data.get("goal") || "").trim();
  const policy = data.get("policy");

  if (name.length < 2) {
    showStatus("Введите имя, чтобы мы понимали, как к вам обращаться.", true);
    form.elements.name.focus();
    return;
  }

  if (contact.length < 5) {
    showStatus("Оставьте телефон или Telegram для ответа.", true);
    form.elements.contact.focus();
    return;
  }

  if (!goal) {
    showStatus("Выберите цель - так проще подобрать программу.", true);
    form.elements.goal.focus();
    return;
  }

  if (!policy) {
    showStatus("Отметьте согласие на обработку персональных данных.", true);
    form.elements.policy.focus();
    return;
  }

  const request = {
    name,
    contact,
    goal,
    messenger: data.get("messenger"),
    createdAt: new Date().toISOString()
  };

  const requests = JSON.parse(localStorage.getItem("usmanova-fit-requests") || "[]");
  requests.push(request);
  localStorage.setItem("usmanova-fit-requests", JSON.stringify(requests));

  form.reset();
  form.elements.messenger.value = "Telegram";
  showStatus(`Заявка отправлена. ${name}, мы свяжемся с вами в ближайшее время.`, false);
});

function showStatus(message, isError) {
  if (!statusLine) return;
  statusLine.textContent = message;
  statusLine.style.color = isError ? "#b9245f" : "#2f7a28";
}
