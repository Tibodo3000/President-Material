/*
 * RENDU — LE BUDGET.
 *
 * Ce qui rentre, ce qui sort, et ce qu'on décide d'y mettre. Les postes se
 * règlent ici, à tout moment : c'est le seul endroit du jeu où le joueur
 * agit en dehors d'une carte, et c'est voulu. Un budget se pilote, il ne se
 * subit pas.
 */

function budgetLine(label, amount, extraClass) {
  return (
    '<div class="budget-line' + (extraClass || "") + '">' +
      "<span>" + label + "</span>" +
      "<span>" + (amount < 0 ? "−" : "") + formatMoney(Math.abs(amount)) + "</span>" +
    "</div>"
  );
}

/** Ce qu'un niveau de dépense apporte, écrit à partir de ses données. */
function investEffectText(spec) {
  const parts = [];
  if (spec.hold) {
    Object.entries(spec.hold).forEach(([gauge, value]) => {
      parts.push(t(gauge === "popularity" ? "label_popularity" : "label_standing") + " : " +
        t("budget_fx_hold") + " " + Math.round(value * 100) + " %");
    });
  }
  if (spec.nerve) parts.push(t("budget_fx_nerve") + " " + Math.round(spec.nerve * 100) + " %");
  if (spec.protect) parts.push(t("budget_fx_protect") + " " + Math.round(spec.protect * 100) + " %");
  return parts.join(" · ");
}

function investPostHTML(key) {
  const def = BUDGET_DATA.investments[key];
  const level = investLevel(game, key);
  const spec = def.levels[level];
  const next = def.levels[level + 1];
  const canUp = Boolean(next) && game.money >= next.cost;

  return (
    '<div class="budget-post">' +
      '<div class="budget-line">' +
        '<span title="' + escapeAttr(L(def.desc)) + '">' + L(def.label) + "</span>" +
        "<span>" + (spec.cost ? "−" + formatMoney(spec.cost) : "—") + "</span>" +
      "</div>" +
      '<div class="budget-level">' +
        '<button type="button" class="budget-btn" data-invest="' + key + '" data-delta="-1"' +
          (level > 0 ? "" : " disabled") + ">−</button>" +
        '<span class="budget-level-name">' + L(spec.name) +
          (level > 0 ? ' <span class="budget-level-fx">' + investEffectText(spec) + "</span>" : "") +
        "</span>" +
        '<button type="button" class="budget-btn" data-invest="' + key + '" data-delta="1"' +
          (canUp ? "" : " disabled") + ">+</button>" +
      "</div>" +
      (next
        ? '<p class="budget-next">' + t("budget_next") + " " + L(next.name) + " · −" +
            formatMoney(next.cost) + " · " + investEffectText(next) + "</p>"
        : "") +
    "</div>"
  );
}

function renderBudget() {
  const pane = document.getElementById("sheet-budget");
  if (!pane) return;

  const income = annualIncome(game);
  const expenses = annualExpenses(game);
  const balance = annualBalance(game);

  pane.innerHTML =
    '<p class="budget-title">' + t("budget_income") + "</p>" +
    budgetLine(t("budget_salary") + " · " + t("pos_" + game.position), income.salary) +
    budgetLine(t("budget_wealth"), income.wealth) +
    (income.hidden ? budgetLine(t("budget_hidden"), income.hidden) : "") +

    '<p class="budget-title">' + t("budget_expenses") + "</p>" +
    budgetLine(t("budget_lifestyle"), -expenses.lifestyle) +
    Object.keys(BUDGET_DATA.investments).map(investPostHTML).join("") +

    '<div class="budget-line budget-total' + (balance < 0 ? " is-negative" : "") + '">' +
      "<span>" + t("budget_balance") + "</span>" +
      "<span>" + (balance < 0 ? "−" : "+") + formatMoney(Math.abs(balance)) + "</span>" +
    "</div>";
}

/** Réglage d'un poste de dépense, depuis la fiche. */
function handleBudgetClick(event) {
  const post = event.target.closest("[data-invest]");
  if (!post) return;

  setInvestment(game, post.getAttribute("data-invest"), Number(post.getAttribute("data-delta")));
  saveGame();
  renderAll();
}
