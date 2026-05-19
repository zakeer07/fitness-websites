// Shared UI utilities — loaded by both recomp and bloom apps
window.FitnessUI = (function () {
  "use strict";

  function toDateKey(d) {
    return (
      d.getFullYear() +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(d.getDate()).padStart(2, "0")
    );
  }

  // Compute consecutive days with any protein logged, counting backwards from today.
  // Skips today if nothing logged yet (yesterday's streak is preserved).
  function computeStreak(trackerData) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const fields = ["breakfast", "lunch", "snack", "shake", "dinner"];

    function dayPro(key) {
      const day = trackerData[key] || {};
      return fields.reduce((s, f) => s + (parseFloat(day[f]) || 0), 0);
    }

    const todayKey = toDateKey(today);
    const todayPro = dayPro(todayKey);

    let streak = 0;
    const start = new Date(today);
    if (todayPro === 0) start.setDate(start.getDate() - 1);

    for (let i = 0; i < 365; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() - i);
      const pro = dayPro(toDateKey(d));
      if (pro > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  // Count workout days in the current week (Mon–today) from trackerData,
  // falling back to the default schedule for days without explicit data.
  function weekWorkoutsCount(trackerData, defaultSchedule) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dow = today.getDay(); // 0=Sun..6=Sat
    // ISO Monday of this week
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dow + 6) % 7));

    let done = 0,
      total = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      if (d > today) break;
      total++;
      const key = toDateKey(d);
      const day = trackerData[key] || {};
      const isWO =
        "isWorkout" in day ? day.isWorkout : defaultSchedule.includes(d.getDay());
      if (isWO) done++;
    }
    return { done, total };
  }

  // Returns whether today is a default workout day given the schedule array of weekday numbers.
  function defaultIsWorkoutToday(schedule) {
    return schedule.includes(new Date().getDay());
  }

  // ISO week string like "2025-W21" for a given Date.
  function isoWeekKey(d) {
    const tmp = new Date(d);
    tmp.setHours(0, 0, 0, 0);
    tmp.setDate(tmp.getDate() + 4 - (tmp.getDay() || 7));
    const yearStart = new Date(tmp.getFullYear(), 0, 1);
    const week = Math.ceil(((tmp - yearStart) / 86400000 + 1) / 7);
    return tmp.getFullYear() + "-W" + String(week).padStart(2, "0");
  }

  // Compute last-week (Mon–Sun) summary from trackerData.
  // Returns null if no data exists for last week.
  function computeWeeklySummary(trackerData, profile) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dow = today.getDay() || 7; // 1=Mon..7=Sun
    const lastSun = new Date(today);
    lastSun.setDate(today.getDate() - dow);
    const lastMon = new Date(lastSun);
    lastMon.setDate(lastSun.getDate() - 6);

    const weekKey = isoWeekKey(lastSun);
    const fields = ["breakfast", "lunch", "snack", "shake", "dinner"];
    const proteinGoal = profile?.proteinG || 120;

    let totalPro = 0,
      daysLogged = 0,
      proGoalDays = 0,
      workoutDays = 0,
      weightSum = 0,
      weightDays = 0;

    for (let i = 0; i < 7; i++) {
      const d = new Date(lastMon);
      d.setDate(lastMon.getDate() + i);
      const key = toDateKey(d);
      const day = trackerData[key] || {};
      const pro = fields.reduce((s, f) => s + (parseFloat(day[f]) || 0), 0);
      if (pro > 0) {
        totalPro += pro;
        daysLogged++;
        if (pro >= proteinGoal) proGoalDays++;
      }
      if (day.isWorkout) workoutDays++;
      const w = parseFloat(day.weightKg);
      if (w > 0) {
        weightSum += w;
        weightDays++;
      }
    }

    if (daysLogged === 0 && workoutDays === 0) return null;

    const avgPro = daysLogged > 0 ? Math.round(totalPro / daysLogged) : 0;
    const avgWeight = weightDays > 0 ? (weightSum / weightDays).toFixed(1) : null;
    const startLabel =
      lastMon.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
      "–" +
      lastSun.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    return { weekKey, startLabel, avgPro, daysLogged, proGoalDays, workoutDays, avgWeight };
  }

  // Apply a right-edge fade to a scrollable nav element.
  // Adds/removes class 'can-scroll-right' based on scroll position.
  function applyNavFade(navEl) {
    if (!navEl) return;
    function update() {
      const canScroll = navEl.scrollWidth - navEl.scrollLeft > navEl.clientWidth + 2;
      navEl.classList.toggle("can-scroll-right", canScroll);
    }
    navEl.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  // Draw a floating tooltip box on a canvas.
  // lines: array of strings. W, H: canvas dimensions.
  function drawCanvasTooltip(ctx, x, y, lines, W, H) {
    ctx.save();
    const pad = 8,
      lh = 16;
    ctx.font = "11px Inter,sans-serif";
    const tw = Math.max(...lines.map((l) => ctx.measureText(l).width)) + pad * 2;
    const th = lines.length * lh + pad;
    let tx = x + 12;
    let ty = y - th / 2;
    if (tx + tw > W - 4) tx = x - tw - 12;
    if (ty < 4) ty = 4;
    if (ty + th > H - 4) ty = H - th - 4;

    ctx.fillStyle = "rgba(6,8,15,0.92)";
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(tx, ty, tw, th, 6);
      ctx.fill();
    } else {
      ctx.fillRect(tx, ty, tw, th);
    }
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(tx, ty, tw, th, 6);
      ctx.stroke();
    } else {
      ctx.strokeRect(tx, ty, tw, th);
    }

    ctx.fillStyle = "#f2f6ff";
    ctx.textAlign = "left";
    lines.forEach((line, i) => {
      ctx.fillText(line, tx + pad, ty + pad + i * lh + lh * 0.72);
    });
    ctx.restore();
  }

  return {
    computeStreak,
    weekWorkoutsCount,
    defaultIsWorkoutToday,
    computeWeeklySummary,
    isoWeekKey,
    applyNavFade,
    drawCanvasTooltip,
  };
})();
