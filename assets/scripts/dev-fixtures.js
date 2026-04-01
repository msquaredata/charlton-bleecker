/**
 * Test-data loader for #leadForm. Shown when:
 * - localhost / 127.0.0.1
 * - Vercel Preview & other *.vercel.app URLs (add ?devFixtures=0 to hide)
 * - any host with ?devFixtures=1 to force on (e.g. custom-domain staging)
 */
(function () {
    function showFixturesBar() {
        const q = new URLSearchParams(location.search);
        if (q.get("devFixtures") === "0") return false;
        if (q.get("devFixtures") === "1") return true;
        const h = location.hostname;
        if (h === "localhost" || h === "127.0.0.1") return true;
        if (/\.vercel\.app$/i.test(h)) return true;
        return false;
    }

    if (!showFixturesBar()) return;

    const TEST = {
        firstName: "Jane",
        lastName: "Tester",
        role: "Advisor",
        email: "jane.tester@example.com",
        phone: "555-123-4567",
        companyRepresented: "Test Advisors LLC",
        businessName: "Acme Demo Services Inc.",
        website: "www.acme-demo-services.com",
        industryValue: "FINANCIAL_SERVICES",
        hqCity: "Fort Lauderdale",
        hqState: "FL",
        yearFounded: "2012",
        ownership: "Private Company",
        transitionGoal: "Growth Capital",
        transitionTiming: "< 12 months",
        revenueRangeText: "$2–5M",
        ebitdaMargin: "10–20%",
        leverage: "Manageable",
        keyassets: ["Team", "Contracts", "Technology"],
        notableCustomers: "Multi-year agreements with regional utilities; preferred vendor status.",
        fitReason: "Recurring revenue, strong retention, succession-ready founder.",
        challenge: ["Succession Planning", "Operational Efficiency"],
        hasManagementTeam: true,
        referralSource: "Website",
        otherDetails: "Dev fixture data — not a real submission.",
    };

    function waitForIndustries(timeoutMs) {
        const deadline = Date.now() + (timeoutMs || 20000);
        return new Promise((resolve, reject) => {
            let settled = false;
            const finish = (sel) => {
                if (settled || !sel) return;
                settled = true;
                resolve(sel);
            };
            const fail = (msg) => {
                if (settled) return;
                settled = true;
                reject(new Error(msg));
            };

            window.addEventListener(
                "leadForm:industriesLoaded",
                () => {
                    const sel = document.getElementById("industrySelect");
                    if (sel && sel.options.length > 1) finish(sel);
                },
                { once: true }
            );

            function tick() {
                if (settled) return;
                const sel = document.getElementById("industrySelect");
                if (!sel) {
                    fail("industrySelect missing");
                    return;
                }
                const opts = sel.querySelectorAll("option");
                const hasError = Array.from(opts).some((o) =>
                    o.textContent.includes("Error loading options")
                );
                if (hasError) {
                    fail("Industry CSV failed to load (see console)");
                    return;
                }
                const stillLoading = Array.from(opts).some((o) =>
                    o.textContent.includes("Loading options")
                );
                if (opts.length > 1 && !stillLoading) {
                    finish(sel);
                    return;
                }
                if (Date.now() > deadline) {
                    fail("Industry dropdown did not load in time");
                    return;
                }
                requestAnimationFrame(tick);
            }
            tick();
        });
    }

    function setSelectValue(select, valueOrText) {
        if (!select) return;
        select.value = valueOrText;
        if (select.value !== valueOrText) {
            const opt = Array.from(select.options).find(
                (o) => o.value === valueOrText || o.textContent.trim() === valueOrText
            );
            if (opt) select.value = opt.value;
        }
    }

    function setMultiselectValues(dropdown, values) {
        if (!dropdown) return;
        const list = dropdown.querySelector(".dropdown-list");
        if (!list) return;
        list.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
            cb.checked = values.includes(cb.value);
            cb.dispatchEvent(new Event("change", { bubbles: true }));
        });
    }

    async function applyTestData(btn, statusEl) {
        const form = document.getElementById("leadForm");
        if (!form) return;

        btn.disabled = true;
        statusEl.textContent = "Loading industries…";
        statusEl.classList.add("dev-fixtures--busy");

        try {
            await waitForIndustries();
        } catch (e) {
            statusEl.textContent = e.message || "Industry load failed";
            statusEl.classList.remove("dev-fixtures--busy");
            btn.disabled = false;
            return;
        }

        statusEl.textContent = "Applying…";

        document.getElementById("firstNameInput").value = TEST.firstName;
        document.getElementById("lastNameInput").value = TEST.lastName;
        setSelectValue(document.getElementById("roleSelect"), TEST.role);
        document.getElementById("emailInput").value = TEST.email;
        document.getElementById("phoneInput").value = TEST.phone;
        document.getElementById("companyRepresentedInput").value = TEST.companyRepresented;
        document.getElementById("businessNameInput").value = TEST.businessName;
        document.getElementById("websiteInput").value = TEST.website;

        setSelectValue(document.getElementById("industrySelect"), TEST.industryValue);

        document.getElementById("hqCityInput").value = TEST.hqCity;
        setSelectValue(document.getElementById("hqStateSelect"), TEST.hqState);
        document.getElementById("yearFoundedInput").value = TEST.yearFounded;

        setSelectValue(document.getElementById("ownershipSelect"), TEST.ownership);
        setSelectValue(document.getElementById("transitionGoalSelect"), TEST.transitionGoal);
        setSelectValue(document.getElementById("transitionTimingSelect"), TEST.transitionTiming);

        setSelectValue(document.getElementById("revenueRangeTextSelect"), TEST.revenueRangeText);
        setSelectValue(document.getElementById("ebitdaMarginSelect"), TEST.ebitdaMargin);
        setSelectValue(document.getElementById("leverageSelect"), TEST.leverage);

        setMultiselectValues(
            document.querySelector('.multiselect-dropdown[data-name="keyassets"]'),
            TEST.keyassets
        );

        document.getElementById("notableCustomersInput").value = TEST.notableCustomers;
        document.getElementById("fitReasonInput").value = TEST.fitReason;

        setMultiselectValues(
            document.querySelector('.multiselect-dropdown[data-name="challenge"]'),
            TEST.challenge
        );

        const mgmt = document.getElementById("hasManagementTeamCheckbox");
        if (mgmt) mgmt.checked = TEST.hasManagementTeam;

        setSelectValue(document.getElementById("referralSourceSelect"), TEST.referralSource);
        document.getElementById("otherDetailsInput").value = TEST.otherDetails;

        form.querySelectorAll(".field-error").forEach((el) => el.classList.remove("field-error"));

        statusEl.textContent = "Test data applied.";
        statusEl.classList.remove("dev-fixtures--busy");
        btn.disabled = false;
    }

    function clearForm(btn, statusEl) {
        const form = document.getElementById("leadForm");
        if (!form) return;
        form.reset();
        document.querySelectorAll('.multiselect-dropdown input[type="checkbox"]').forEach((cb) => {
            cb.checked = false;
            cb.dispatchEvent(new Event("change", { bubbles: true }));
        });
        statusEl.textContent = "Form cleared.";
    }

    window.addEventListener("load", () => {
        const form = document.getElementById("leadForm");
        if (!form) return;

        const badgeLabel = /\.vercel\.app$/i.test(location.hostname) ? "PREVIEW" : "DEV";

        const bar = document.createElement("div");
        bar.className = "dev-fixtures";
        bar.setAttribute("role", "region");
        bar.setAttribute("aria-label", "Test data loader");
        bar.innerHTML = `
      <div class="dev-fixtures__inner">
        <span class="dev-fixtures__badge">${badgeLabel}</span>
        <span class="dev-fixtures__status" aria-live="polite"></span>
        <button type="button" class="dev-fixtures__btn dev-fixtures__btn--primary">Load test data</button>
        <button type="button" class="dev-fixtures__btn">Clear</button>
      </div>
    `;
        document.body.appendChild(bar);

        const style = document.createElement("style");
        style.textContent = `
      .dev-fixtures {
        position: fixed;
        bottom: 16px;
        right: 16px;
        z-index: 99999;
        font-family: system-ui, sans-serif;
        font-size: 13px;
        max-width: min(420px, calc(100vw - 32px));
        box-shadow: 0 8px 32px rgba(0,0,0,.12);
        border-radius: 12px;
        border: 1px solid #e0e0e0;
        background: #fff;
      }
      .dev-fixtures__inner {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        padding: 12px 14px;
      }
      .dev-fixtures__badge {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: .06em;
        background: #ff4d3d;
        color: #fff;
        padding: 4px 8px;
        border-radius: 6px;
      }
      .dev-fixtures__status {
        flex: 1 1 140px;
        min-height: 1.2em;
        color: #555;
      }
      .dev-fixtures__status.dev-fixtures--busy::after {
        content: "";
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-left: 6px;
        border: 2px solid #ccc;
        border-top-color: #ff4d3d;
        border-radius: 50%;
        animation: dev-fixtures-spin .7s linear infinite;
        vertical-align: middle;
      }
      @keyframes dev-fixtures-spin { to { transform: rotate(360deg); } }
      .dev-fixtures__btn {
        cursor: pointer;
        border: 1px solid #ccc;
        background: #f5f5f5;
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 12px;
      }
      .dev-fixtures__btn--primary {
        background: #1a1a1a;
        color: #fff;
        border-color: #1a1a1a;
      }
      .dev-fixtures__btn:disabled { opacity: .5; cursor: not-allowed; }
    `;
        document.head.appendChild(style);

        const statusEl = bar.querySelector(".dev-fixtures__status");
        const loadBtn = bar.querySelector(".dev-fixtures__btn--primary");
        const clearBtn = bar.querySelectorAll(".dev-fixtures__btn")[1];

        loadBtn.addEventListener("click", () => applyTestData(loadBtn, statusEl));
        clearBtn.addEventListener("click", () => clearForm(clearBtn, statusEl));
    });
})();
