window.addEventListener("load", () => {
    const leadForm = document.getElementById("leadForm");
    if (leadForm?.dataset.apiOrigin) {
        const base = String(leadForm.dataset.apiOrigin).replace(/\/$/, "");
        leadForm.action = `${base}/api/lead-intake`;
    }

    const industriesCsvUrl = new URL("assets/data/industries.csv", window.location.href).href;
    loadDropdownFromCSV("industrySelect", industriesCsvUrl);

    async function loadDropdownFromCSV(selectId, csvPath) {
        const selectElement = document.getElementById(selectId);
        if (!selectElement) {
            console.error(`Dropdown element with ID '${selectId}' not found.`);
            return;
        }

        try {
            const response = await fetch(csvPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const csvText = await response.text();

            const lines = csvText.trim().split("\n");

            const parsedData = lines.slice(1).map((line) => {
                const parts = line.split(",").map((part) => part.trim());
                return {
                    label: parts[0],
                    value: parts[1],
                    active: parts[2],
                };
            });

            const filteredData = parsedData.filter(
                (item) => item.active && item.active.toUpperCase() === "Y"
            );

            selectElement.innerHTML = "";

            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Select an option...";
            selectElement.appendChild(defaultOption);

            filteredData.forEach((item) => {
                const option = document.createElement("option");
                option.value = item.value;
                option.textContent = item.label;
                selectElement.appendChild(option);
            });
            window.dispatchEvent(new CustomEvent("leadForm:industriesLoaded"));
        } catch (error) {
            console.error(`Failed to load CSV data for ${selectId}:`, error);
            selectElement.innerHTML =
                '<option value="" disabled selected>Error loading options</option>';
        }
    }

    document.querySelectorAll(".multiselect-dropdown .dropdown-list").forEach((list) => {
        const labels = Array.from(list.querySelectorAll("label"));
        labels.sort((a, b) => {
            const textA = a.textContent.trim();
            const textB = b.textContent.trim();
            if (textA === "Other") return 1;
            if (textB === "Other") return -1;
            return textA.localeCompare(textB);
        });
        list.innerHTML = "";
        labels.forEach((label) => list.appendChild(label));
    });

    document.querySelectorAll(".multiselect-dropdown").forEach((dropdown) => {
        const button = dropdown.querySelector(".dropdown-btn");
        const list = dropdown.querySelector(".dropdown-list");

        const dataName = dropdown.dataset.name;

        if (!dataName) {
            console.error(
                "Multiselect initialization failed: Missing 'data-name' attribute on a dropdown."
            );
            return;
        }

        const isRequired =
            dropdown.hasAttribute("required") || dropdown.querySelector("[required]") !== null;

        const hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = dataName;

        if (isRequired) {
            hiddenInput.setAttribute("required", "required");
            hiddenInput.classList.add("multiselect-hidden");
        }

        dropdown.appendChild(hiddenInput);

        const defaultText = button.textContent.trim();

        const updateDropdown = () => {
            const selected = Array.from(list.querySelectorAll("input:checked")).map((cb) => cb.value);
            hiddenInput.value = selected.join(", ");
            const newText =
                selected.length === 0
                    ? defaultText
                    : selected.length === 1
                      ? selected[0]
                      : `${selected.length} items selected`;
            button.textContent = newText;
            button.classList.toggle("has-selection", selected.length > 0);

            if (isRequired) {
                if (selected.length > 0) {
                    button.closest("label")?.classList.remove("field-error");
                } else {
                    button.closest("label")?.classList.add("field-error");
                }
            }
        };

        updateDropdown();

        button.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle("open");
        });

        list.querySelectorAll("input[type='checkbox']").forEach((cb) =>
            cb.addEventListener("change", updateDropdown)
        );

        document.addEventListener("click", (e) => {
            if (!dropdown.contains(e.target)) dropdown.classList.remove("open");
        });
    });

    const form = document.getElementById("leadForm");
    if (!form) return;

    const requiredFields = form.querySelectorAll("[required]");

    const getTargetElement = (inputElement) => {
        if (inputElement.classList.contains("dropdown-btn")) {
            return inputElement.closest(".multiselect-dropdown")?.closest("label");
        }
        return inputElement.closest("label");
    };

    const clearError = (inputElement) => {
        const targetElement = getTargetElement(inputElement);
        if (targetElement) {
            targetElement.classList.remove("field-error");
        }
    };

    const applyError = (inputElement) => {
        const targetElement = getTargetElement(inputElement);
        if (targetElement) {
            targetElement.classList.add("field-error");
        }
    };

    const isValid = (input) => input.checkValidity();

    requiredFields.forEach((field) => {
        if (field.type === "hidden" && field.classList.contains("multiselect-hidden")) {
            return;
        }

        field.addEventListener("input", () => {
            if (isValid(field)) {
                clearError(field);
            }
        });

        field.addEventListener("change", () => {
            if (isValid(field)) {
                clearError(field);
            }
        });
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const button = form.querySelector("button[type='submit']");

        let isFormValid = true;

        form.querySelectorAll(".field-error").forEach((el) => el.classList.remove("field-error"));

        requiredFields.forEach((field) => {
            const isMultiselectHidden = field.classList.contains("multiselect-hidden");
            const elementToHighlight = isMultiselectHidden
                ? field.closest(".multiselect-dropdown")?.querySelector(".dropdown-btn")
                : field;

            if (!isValid(field)) {
                if (elementToHighlight) applyError(elementToHighlight);
                isFormValid = false;
            } else {
                if (elementToHighlight) clearError(elementToHighlight);
            }
        });

        if (!isFormValid) {
            const firstError = form.querySelector(".field-error");
            if (firstError) {
                firstError.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            button.disabled = false;
            button.textContent = "Submit";
            return;
        }

        button.disabled = true;
        button.textContent = "Submitting...";

        const formData = new FormData(form);

        const websiteInput = document.getElementById("websiteInput");
        if (websiteInput && websiteInput.value.trim()) {
            let websiteValue = websiteInput.value.trim();
            if (!/^https?:\/\//i.test(websiteValue)) {
                websiteValue = "https://" + websiteValue;
                formData.set("website", websiteValue);
            }
        }

        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok && data.status === "received") {
                const redirectURL = data.redirect || "thank-you.html";
                setTimeout(() => (window.location.href = redirectURL), 800);
            } else {
                let msg = "Submission failed. Please try again.";
                if (data && typeof data.hint === "string") msg += "\n\n" + data.hint;
                else if (data && typeof data.error === "string") msg += "\n\n" + data.error;
                alert(msg);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Unable to connect to the server. Please try again later.");
        } finally {
            setTimeout(() => {
                button.disabled = false;
                button.textContent = "Submit";
            }, 500);
        }
    });
});
