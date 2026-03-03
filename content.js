(() => {
  const ROOT_CLASS = "zlg";
  const READY_CLASS = "zlg-ready";
  const PRESS_CLASS = "zlg-pressed";
  const THEME_LIGHT = "zlg-theme-light";
  const MODE_WEEK = "zlg-mode-week";
  const MODE_DAY = "zlg-mode-day";

  const pressableSelector = [
    "button",
    "a.item",
    ".menuPage .item",
    ".settingsPage .item",
    ".appointmentItem",
    ".appointmentItemWithOptionalSwitch",
    ".compactAppointmentItem",
    ".dayWeek .day",
    ".dayWeek .week",
    ".tabs .item",
    ".choicePage .titleBar"
  ].join(",");

  const injectFonts = () => {
    if (!document.head) return;

    const hasPoppins = document.querySelector('link[href*="fonts.googleapis.com/css2?family=Poppins"]');
    if (hasPoppins) return;

    const preconnectGoogle = document.createElement("link");
    preconnectGoogle.rel = "preconnect";
    preconnectGoogle.href = "https://fonts.googleapis.com";

    const preconnectGstatic = document.createElement("link");
    preconnectGstatic.rel = "preconnect";
    preconnectGstatic.href = "https://fonts.gstatic.com";
    preconnectGstatic.crossOrigin = "anonymous";

    const poppinsStylesheet = document.createElement("link");
    poppinsStylesheet.rel = "stylesheet";
    poppinsStylesheet.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";

    document.head.append(preconnectGoogle, preconnectGstatic, poppinsStylesheet);
  };

  const isStandaloneLoginPage = () => {
    const path = window.location.pathname.toLowerCase();
    const likelyAuthPath = /login|signin|auth|inloggen/.test(path);
    const hasPasswordField = Boolean(document.querySelector('input[type="password"]'));
    const hasAppShell = Boolean(
      document.querySelector(".navBar, .masterDetail, .menuPage, .swipeSchedulePage, .daySchedule, .weekSchedule")
    );
    return (likelyAuthPath || hasPasswordField) && !hasAppShell;
  };

  const applyBaseClasses = () => {
    document.documentElement.classList.add(ROOT_CLASS, READY_CLASS, THEME_LIGHT);
    document.documentElement.classList.remove("zlg-theme-dark");

    if (document.body) {
      document.body.classList.add(ROOT_CLASS, READY_CLASS, THEME_LIGHT);
      document.body.classList.remove("zlg-theme-dark");
    }
  };

  const disableThemeClasses = () => {
    const classes = [ROOT_CLASS, READY_CLASS, THEME_LIGHT, "zlg-theme-dark", MODE_WEEK, MODE_DAY];
    document.documentElement.classList.remove(...classes);
    if (document.body) {
      document.body.classList.remove(...classes);
    }
  };

  const applyMode = (root, week, day) => {
    if (!root) return;
    root.classList.toggle(MODE_WEEK, week);
    root.classList.toggle(MODE_DAY, day);
    if (!week && !day) {
      root.classList.remove(MODE_WEEK, MODE_DAY);
    }
  };

  const isVisible = (element) => {
    if (!element) return false;
    if (element.getClientRects().length === 0) return false;
    const style = window.getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden";
  };


  const updateScheduleModeClasses = () => {
    const explicitWeek = Boolean(document.querySelector(".swipeSchedulePage.showWeek, .showWeek"));
    const explicitDay = Boolean(document.querySelector(".swipeSchedulePage.showDay, .showDay"));
    const visibleWeek = [...document.querySelectorAll(".weekSchedule")].some(isVisible);
    const visibleDay = [...document.querySelectorAll(".daySchedule")].some(isVisible);

    const hasWeek = explicitWeek || (!explicitDay && visibleWeek && !visibleDay);
    const hasDay = explicitDay || (!hasWeek && visibleDay);

    applyMode(document.documentElement, hasWeek, hasDay);
    applyMode(document.body, hasWeek, hasDay);

    return { hasWeek, hasDay };
  };

  const clearScheduleZoom = () => {
    const lists = document.querySelectorAll(".daySchedule .scroll .appointmentlist, .weekSchedule .scroll .appointmentlist");
    lists.forEach((list) => {
      list.style.zoom = "1";
    });
  };

  let scheduleFitRaf = 0;
  const scheduleFitTick = () => {
    scheduleFitRaf = 0;

    if (isStandaloneLoginPage()) {
      clearScheduleZoom();
      return;
    }

    updateScheduleModeClasses();
    clearScheduleZoom();
  };

  const requestScheduleFit = () => {
    if (scheduleFitRaf) return;
    scheduleFitRaf = window.requestAnimationFrame(scheduleFitTick);
  };

  const animatePress = (target) => {
    target.classList.remove(PRESS_CLASS);
    target.offsetWidth;
    target.classList.add(PRESS_CLASS);
    window.setTimeout(() => target.classList.remove(PRESS_CLASS), 220);
  };

  const onPointerDown = (event) => {
    const target = event.target.closest(pressableSelector);
    if (!target) return;
    animatePress(target);
  };

  const bootstrap = () => {
    if (isStandaloneLoginPage()) {
      disableThemeClasses();
      return;
    }

    injectFonts();
    applyBaseClasses();
    requestScheduleFit();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  } else {
    bootstrap();
  }

  if (!isStandaloneLoginPage()) {
    applyBaseClasses();
    requestScheduleFit();
  }

  window.addEventListener("pageshow", () => {
    if (isStandaloneLoginPage()) {
      disableThemeClasses();
      return;
    }
    applyBaseClasses();
    requestScheduleFit();
  }, { passive: true });

  window.addEventListener("resize", requestScheduleFit, { passive: true });

  document.addEventListener("pointerdown", onPointerDown, {
    passive: true,
    capture: true
  });

  const fitObserver = new MutationObserver(requestScheduleFit);
  fitObserver.observe(document.documentElement, { childList: true, subtree: true });
})();
