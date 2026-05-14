// =========================
// 1. ЛОГ СИСТЕМИ
// =========================
function logUserStatus(name = "Гість", age = "не вказано") {
    console.log(`[СИСТЕМА]: Користувач: ${name}, Вік: ${age}`);
}

// =========================
// 2. ІНІЦІАЛІЗАЦІЯ СТОРІНКИ
// =========================
window.onload = function () {

    if (!sessionStorage.getItem("userAge")) {
        let name = prompt("Вітаємо! Як вас звати?", "Гість");
        let age = prompt("Скільки вам років?");

        if (name && age) {
            sessionStorage.setItem("userName", name);
            sessionStorage.setItem("userAge", age);
            sessionStorage.setItem("fullAccessShown", "false");

            logUserStatus(name, age);
            window.location.reload();
            return;
        }
    }

    document.body.style.backgroundColor = "#f0f0f5";
    setTimeout(() => document.body.style.backgroundColor = "", 5000);

    document.querySelectorAll("a").forEach(link => {
        link.setAttribute("title", "Перехід за посиланням");
    });

    applyContentControl();
};

// =========================
// 3. КОНТРОЛЬ ДОСТУПУ
// =========================
function applyContentControl() {
    const age = parseInt(sessionStorage.getItem("userAge")) || 0;

    if (age < 18) {
        createStatusBanner(age, false);
    } else {
        if (sessionStorage.getItem("fullAccessShown") === "false") {
            createStatusBanner(age, true);
            sessionStorage.setItem("fullAccessShown", "true");
        }
    }

    if (age < 18) {
        const allowed = ["Minecraft", "Forza Horizon 5"];

        document.querySelectorAll("table").forEach(table => {
            const header = table.querySelector("th");
            if (!header) return;

            const gameName = header.textContent;

            if (!allowed.some(item => gameName.includes(item))) {
                table.remove();
            }
        });
    }
}

// =========================
// 4. БАНЕР
// =========================
function createStatusBanner(age, shouldHide) {
    const banner = document.createElement("div");

    banner.style.padding = "10px";
    banner.style.textAlign = "center";
    banner.style.fontWeight = "bold";

    if (age < 18) {
        banner.style.background = "#ffe4e6";
        banner.textContent = "⚠️ Дитячий режим";
    } else {
        banner.style.background = "#d1fae5";
        banner.textContent = "✅ Повний доступ";
    }

    document.body.prepend(banner);

    if (shouldHide) {
        setTimeout(() => banner.remove(), 2000);
    }
}

// =========================
// 5. КНОПКА HOME
// =========================
function goToHome() {
    if (confirm("Повернутись на головну?")) {
        window.location.href = "index.html";
    }
}

// =========================
// 6. ОСНОВНА ЛОГІКА СТОРІНКИ
// =========================
document.addEventListener("DOMContentLoaded", () => {

    // ---- КАРТКИ  ----
    document.querySelectorAll(".card").forEach(card => {

        function toggleCard(e) {
            console.log("currentTarget:", e.currentTarget);
            card.classList.toggle("card-secret-active");

            // приклад removeEventListener (після першого кліку відключаємо)
            card.removeEventListener("dblclick", toggleCard);
        }

        card.addEventListener("click", toggleCard);

        // подвійний клік для демонстрації removeEventListener
        card.addEventListener("dblclick", toggleCard);
    });

    // ---- mouse event + onclick property + setAttribute ----
    const title = document.querySelector("h1");

    if (title) {

        // через властивість
        title.onclick = function () {
            console.log("CLICK через onclick property");
        };

        // через атрибут
        title.setAttribute("onclick", "console.log('CLICK через HTML attribute')");

        // addEventListener (2 обробники)
        title.addEventListener("mouseover", () => {
            title.style.color = "#e76f51";
            title.style.transform = "translateX(-50%) scale(1.1)";
        });

        title.addEventListener("mouseover", () => {
            console.log("Другий обробник mouseover");
        });

        title.addEventListener("mouseout", () => {
            title.style.color = "";
            title.style.transform = "translateX(-50%) scale(1)";
        });
    }

    // ---- handleEvent (об’єкт-обробник) ----
    const hoverHandler = {
        handleEvent(event) {
            console.log("handleEvent працює:", event.type, event.currentTarget);
            event.currentTarget.style.background = "#fff3cd";
        }
    };

    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("mouseenter", hoverHandler);
    });

    // ---- пошук ----
    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const value = this.value.toLowerCase();

            document.querySelectorAll("#games-preview-table tr").forEach((row, i) => {
                if (i === 0) return;

                row.style.display =
                    row.textContent.toLowerCase().includes(value) ? "" : "none";
            });
        });
    }

    // ---- пошук з переходом ----
    const query = (sessionStorage.getItem("searchQuery") || "").toLowerCase();

    if (query) {
        let found = false;

        document.querySelectorAll("table").forEach(table => {
            const data = table.dataset.game || "";
            const text = table.textContent.toLowerCase();

            if (data.includes(query) || text.includes(query)) {
                found = true;

                table.style.border = "2px solid #e76f51";
                table.style.boxShadow = "0 0 10px rgba(231,111,81,0.4)";
            } else {
                table.style.display = "none";
            }
        });

        if (!found) {
            const msg = document.createElement("h2");
            msg.textContent = "❌ Гру не знайдено";
            msg.style.textAlign = "center";
            document.body.appendChild(msg);
        }

        sessionStorage.removeItem("searchQuery");
    }

    // ---- СПИСОК (делегування) ----
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("list-item")) {

            document.querySelectorAll(".list-item").forEach(item => {
                item.style.background = "";
            });

            e.target.style.background = "#d1fae5";
            console.log("event.target:", e.target);
        }
    });

    // ---- МЕНЮ з data-* ----
    document.querySelectorAll(".menu button").forEach(btn => {
        btn.addEventListener("click", function (e) {

            const action = e.target.dataset.action;

            switch (action) {
                case "home":
                    goToHome();
                    break;

                case "alert":
                    alert("Кнопка з data-action працює!");
                    break;

                case "log":
                    console.log("Menu action LOG");
                    break;
            }

            console.log("data-action:", action);
        });
    });

});

// =========================
// 7. ДЕЛЕГУВАННЯ КЛІКІВ (жанри)
// =========================
document.addEventListener("click", function (e) {
    const row = e.target.closest(".genre-row");

    if (row) {
        document.querySelectorAll(".genre-row").forEach(r => {
            r.classList.remove("js-selected-row");
        });

        row.classList.add("js-selected-row");
    }
});

// =========================
// 8. ПОШУК + ПЕРЕХІД
// =========================
function searchGame() {
    const input = document.getElementById("searchInput");

    if (!input || input.value.trim() === "") {
        alert("Введіть назву гри!");
        return;
    }

    sessionStorage.setItem("searchQuery", input.value.toLowerCase());
    window.location.href = "games.html";
}
  const lambda = document.getElementById("moving-lambda");

    if (lambda) {

        let isDragging = false;

        let shiftX = 0;
        let shiftY = 0;

        lambda.addEventListener("mousedown", function (event) {

            isDragging = true;

            lambda.classList.add("lambda-active");

            shiftX = event.clientX - lambda.offsetLeft;
            shiftY = event.clientY - lambda.offsetTop;

            console.log("mousedown target:", event.target);

        });

        document.addEventListener("mousemove", function (event) {

            if (!isDragging) return;

            lambda.style.left = event.clientX - shiftX + "px";
            lambda.style.top = event.clientY - shiftY + "px";

        });

        document.addEventListener("mouseup", function () {

            if (isDragging) {
                console.log("mouseup завершено");
            }

            isDragging = false;

            lambda.classList.remove("lambda-active");
        });

        lambda.addEventListener("mouseover", function (event) {

            console.log("mouseover lambda:", event.target);
            console.log("related:", event.relatedTarget);

        });

        lambda.addEventListener("mouseout", function (event) {

            console.log("mouseout lambda:", event.target);
            console.log("related:", event.relatedTarget);

        });
    }