/* Shared vanilla interactions. No framework is required by the static export. */
export function initPortfolio() {
  const controller = new AbortController();
  const { signal } = controller;
  const on = (target, event, callback) =>
    target?.addEventListener(event, callback, { signal });
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [
    ...parent.querySelectorAll(selector),
  ];
  const motionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)")
    .matches;
  let toastTimer;
  let emailTimer;
  let currentProject = "";
  let opener = null;
  let messageDraft = "";
  let cartCount = 0;

  function notify(message) {
    const toast = $("[data-toast]");
    $("[data-toast-message]").textContent = message;
    if (toast.showPopover && !toast.matches(":popover-open"))
      toast.showPopover();
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
      if (toast.hidePopover && toast.matches(":popover-open"))
        toast.hidePopover();
    }, 3000);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        /* Try the static-host fallback. */
      }
    }
    const area = document.createElement("textarea");
    area.value = text;
    area.className = "clipboard-fallback";
    document.body.append(area);
    area.select();
    const success = document.execCommand("copy");
    area.remove();
    return success;
  }

  // Reveal only after the observer is ready; content remains visible without JS.
  const revealObserver =
    "IntersectionObserver" in window && motionAllowed
      ? new IntersectionObserver(
          (entries) =>
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("is-revealed");
              revealObserver.unobserve(entry.target);
            }),
          { threshold: 0.08 },
        )
      : null;
  $$("[data-reveal]").forEach((element) => {
    if (revealObserver) {
      element.classList.add("will-reveal");
      revealObserver.observe(element);
    }
  });

  const navObserver =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              $$("[data-nav-link]").forEach((link) => {
                const active = link.hash === `#${entry.target.id}`;
                link.classList.toggle("is-active", active);
                if (active) link.setAttribute("aria-current", "location");
                else link.removeAttribute("aria-current");
              });
            });
          },
          { rootMargin: "-18% 0px -65% 0px", threshold: 0 },
        )
      : null;
  $$("main > section[id]").forEach((section) => navObserver?.observe(section));

  const menu = $("#mobile-nav");
  const menuButton = $("[data-menu-toggle]");
  function closeMenu() {
    menu.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Ouvrir le menu");
  }
  on(menuButton, "click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute(
      "aria-label",
      open ? "Fermer le menu" : "Ouvrir le menu",
    );
    menu.hidden = !open;
  });
  on(menu, "click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  const desktopQuery = window.matchMedia("(min-width: 601px)");
  on(desktopQuery, "change", (event) => {
    if (event.matches) closeMenu();
  });
  on(document, "keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  on(document, "click", (event) => {
    if (!event.target.closest(".site-header")) closeMenu();
  });

  $$("[data-filter]").forEach((button) =>
    on(button, "click", () => {
      const category = button.dataset.filter;
      $$("[data-filter]").forEach((filter) => {
        const selected = filter === button;
        filter.classList.toggle("is-active", selected);
        filter.setAttribute("aria-pressed", String(selected));
      });
      let count = 0;
      $$(".project-card").forEach((card) => {
        const visible =
          category === "all" || card.dataset.category === category;
        card.hidden = !visible;
        if (visible) {
          count += 1;
          card.classList.add("is-revealed");
          if (motionAllowed)
            card.animate(
              [
                { opacity: 0, transform: "translateY(12px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              { duration: 350, easing: "ease-out" },
            );
        }
      });
      $("[data-filter-status]").textContent =
        `${count} projets affichés${category === "all" ? "" : ` dans la catégorie ${category}`}.`;
    }),
  );

  const dialog = $("#project-dialog");
  function setDialogTab(tab) {
    $$("[data-dialog-tab]").forEach((button) => {
      const selected = button.dataset.dialogTab === tab;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    $("#preview-panel").hidden = tab !== "preview";
    $("#code-panel").hidden = tab !== "code";
  }
  $$("[data-project]").forEach((button) =>
    on(button, "click", () => {
      currentProject = button.dataset.project;
      opener = button;
      const card = button.closest(".project-card");
      $("#dialog-title").textContent =
        card.querySelector("h3").firstChild.textContent;
      $("[data-dialog-category]").textContent = card.dataset.category;
      $$("[data-project-panel]").forEach((panel) => {
        panel.hidden = panel.dataset.projectPanel !== currentProject;
      });
      $$("[data-code-panel]").forEach((panel) => {
        panel.hidden = panel.dataset.codePanel !== currentProject;
      });
      setDialogTab(button.dataset.view === "code" ? "code" : "preview");
      closeMenu();
      dialog.showModal();
      document.body.classList.add("dialog-open");
      dialog.scrollTop = 0;
      $("[data-close-dialog]").focus({ preventScroll: true });
    }),
  );
  on($("[data-close-dialog]"), "click", () => dialog.close());
  on(dialog, "click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  });
  on(dialog, "close", () => {
    document.body.classList.remove("dialog-open");
    opener?.focus({ preventScroll: true });
  });
  $$("[data-dialog-tab]").forEach((button) => {
    on(button, "click", () => setDialogTab(button.dataset.dialogTab));
    on(button, "keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
        return;
      event.preventDefault();
      const tab =
        event.key === "Home"
          ? "preview"
          : event.key === "End"
            ? "code"
            : button.dataset.dialogTab === "preview"
              ? "code"
              : "preview";
      setDialogTab(tab);
      $(`[data-dialog-tab="${tab}"]`).focus();
    });
  });
  function currentCode() {
    return $(`[data-code-panel="${currentProject}"] code`).textContent;
  }
  on($("[data-copy-code]"), "click", async () => {
    notify(
      (await copyText(currentCode()))
        ? "Code copié !"
        : "La copie a échoué. Sélectionnez le code pour le copier.",
    );
  });
  on($("[data-download-code]"), "click", () => {
    const blob = new Blob([currentCode()], {
      type: "text/javascript;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentProject}.js`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  $$("[data-task]").forEach((task) =>
    on(task, "click", () => {
      const complete = task.getAttribute("aria-pressed") !== "true";
      task.setAttribute("aria-pressed", String(complete));
      task.classList.toggle("is-complete", complete);
      const count = $$('[data-task][aria-pressed="true"]').length;
      $("[data-task-progress]").textContent = `${count} sur 4 tâches terminées`;
      $("[data-task-bar]").style.width = `${count * 25}%`;
    }),
  );
  function updateCart() {
    $("[data-cart-count]").textContent = String(cartCount);
    $("[data-cart-feedback]").textContent = cartCount
      ? `${cartCount} article${cartCount > 1 ? "s" : ""} dans votre panier · ${(cartCount * 249).toLocaleString("fr-FR")} €`
      : "Panier de démonstration, sans paiement.";
    $("[data-clear-cart]").hidden = cartCount === 0;
  }
  on($("[data-add-cart]"), "click", () => {
    cartCount += 1;
    updateCart();
  });
  on($("[data-clear-cart]"), "click", () => {
    cartCount = 0;
    updateCart();
  });

  const analytics = {
    month: {
      revenue: "24 850 €",
      visitors: "12 408",
      conversion: "4,82 %",
      growth: "+18,6 % sur la période",
      points:
        "0,130 50,100 100,115 150,70 200,83 250,53 300,65 350,26 400,49 450,17 500,30 550,10 600,5",
    },
    week: {
      revenue: "6 240 €",
      visitors: "3 106",
      conversion: "5,12 %",
      growth: "+12,4 % sur la période",
      points: "0,120 100,140 200,70 300,90 400,40 500,60 600,15",
    },
    year: {
      revenue: "284 560 €",
      visitors: "148 920",
      conversion: "4,38 %",
      growth: "+32,8 % sur la période",
      points:
        "0,150 55,135 110,140 165,110 220,105 275,80 330,95 385,55 440,45 495,60 550,20 600,5",
    },
  };
  on($("[data-analytics-period]"), "change", (event) => {
    const values = analytics[event.target.value];
    $$("[data-stat]").forEach((stat) => {
      stat.textContent = values[stat.dataset.stat];
    });
    $("[data-analytics-line]").setAttribute("points", values.points);
  });
  on($("[data-itinerary-toggle]"), "click", (event) => {
    const button = event.currentTarget;
    const open = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(open));
    $("#terra-itinerary").hidden = !open;
    if (open)
      $("#terra-itinerary").scrollIntoView({
        behavior: motionAllowed ? "smooth" : "instant",
        block: "nearest",
      });
  });

  on($("[data-copy-email]"), "click", async (event) => {
    const success = await copyText(event.currentTarget.dataset.copyEmail);
    if (!success) {
      notify("Sélectionnez l’adresse pour la copier.");
      return;
    }
    notify("Copié ! À très vite dans votre messagerie.");
    $("[data-email-hint]").textContent = "Copié !";
    clearTimeout(emailTimer);
    emailTimer = window.setTimeout(() => {
      $("[data-email-hint]").textContent = "Cliquez pour copier l’adresse";
    }, 3000);
  });

  // GitHub Pages has no backend: prepare a real email, never fake a submission.
  const form = $("[data-contact-form]");
  on(form, "submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get("name")).trim();
    const email = String(data.get("email")).trim();
    const project = String(data.get("project") || "Un nouveau projet");
    const message = String(data.get("message")).trim();
    if (!name || message.length < 10) {
      notify("Ajoutez votre nom et au moins 10 caractères pour votre message.");
      return;
    }
    messageDraft = `Bonjour Hypolyte,\n\n${message}\n\nType de projet : ${project}\n\n${name}\n${email}`;
    const subject = `${project} - ${name}`;
    const mailto = `mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(messageDraft)}`;
    const link = document.createElement("a");
    link.href = mailto;
    document.body.append(link);
    link.click();
    link.remove();
    $("[data-form-success]").hidden = false;
  });
  on(form, "input", () => {
    $("[data-form-success]").hidden = true;
  });
  on($("[data-copy-message]"), "click", async () => {
    notify(
      (await copyText(messageDraft))
        ? "Message copié !"
        : "La copie a échoué. Votre texte reste dans le formulaire.",
    );
  });

  return () => {
    controller.abort();
    revealObserver?.disconnect();
    navObserver?.disconnect();
    clearTimeout(toastTimer);
    clearTimeout(emailTimer);
    const toast = $("[data-toast]");
    if (toast.hidePopover && toast.matches(":popover-open"))
      toast.hidePopover();
    document.body.classList.remove("dialog-open");
    $$("[data-reveal]").forEach((element) =>
      element.classList.remove("will-reveal"),
    );
  };
}

if (
  typeof document !== "undefined" &&
  document.documentElement.dataset.static === "true"
) {
  initPortfolio();
}
