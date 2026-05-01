// --- 1. Функція ---
function logUserStatus(name = "Гість", age = "не вказано") {
    console.log(`[СИСТЕМА]: Користувач: ${name}, Вік: ${age}`);
}

// --- LOAD ---
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

    // фон
    document.body.style.backgroundColor = "#f0f0f5";
    setTimeout(() => {
        document.body.style.backgroundColor = "";
    }, 5000);

    // title для посилань
    document.querySelectorAll("a").forEach(link => {
        link.setAttribute("title", "Перехід за посиланням");
    });

    applyContentControl();
};

// --- ДОСТУП ---
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
            if (header) {
                const gameName = header.textContent;
                if (!allowed.some(item => gameName.includes(item))) {
                    table.remove();
                }
            }
        });
    }
}

// --- БАНЕР ---
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
        setTimeout(() => {
            banner.remove();
        }, 2000);
    }
}

// --- КНОПКА ---
function goToHome() {
    if (confirm("Повернутись на головну?")) {
        window.location.href = "index.html";
    }
}

// --- ПОДІЇ ---
document.addEventListener("DOMContentLoaded", () => {

    // картки
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", () => {
            card.classList.toggle("card-secret-active");
        });
    });

   const title = document.querySelector("h1");

if (title) {
    title.addEventListener("mouseover", () => {
        title.style.color = "#e76f51";
        title.style.transform = "translateX(-50%) scale(1.1)";
    });

    title.addEventListener("mouseout", () => {
        title.style.color = "";
        title.style.transform = "translateX(-50%) scale(1)";
    });
}

    // пошук
    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const value = this.value.toLowerCase();

            document.querySelectorAll("#games-preview-table tr").forEach((row, i) => {
                if (i === 0) return;
                row.style.display = row.textContent.toLowerCase().includes(value) ? "" : "none";
            });
        });
    }
});

// --- ДЕЛЕГУВАННЯ ---
document.addEventListener("click", function (e) {
    const row = e.target.closest(".genre-row");

    if (row) {
        document.querySelectorAll(".genre-row").forEach(r => {
            r.classList.remove("js-selected-row");
        });

        row.classList.add("js-selected-row");
    }
});
// --- ПОШУК З ПЕРЕХОДОМ ---
function searchGame() {
    const input = document.getElementById("searchInput");

    if (!input || input.value.trim() === "") {
        alert("Введіть назву гри!");
        return;
    }

    const value = input.value.toLowerCase();

    // передаємо в іншу сторінку
    sessionStorage.setItem("searchQuery", value);

    window.location.href = "games.html";
}
// --- ОБРОБКА ПОШУКУ НА СТОРІНЦІ ІГОР ---
document.addEventListener("DOMContentLoaded", () => {

    const query = sessionStorage.getItem("searchQuery");

    if (query) {

        let found = false;

        document.querySelectorAll("table").forEach(table => {
            const text = table.textContent.toLowerCase();

            if (text.includes(query)) {
                found = true;

                // підсвітка
                table.style.border = "2px solid #e76f51";
                table.style.boxShadow = "0 0 10px rgba(231,111,81,0.4)";
            } else {
                table.style.display = "none";
            }
        });

        // якщо нічого не знайдено
        if (!found) {
            const msg = document.createElement("h2");
            msg.textContent = "❌ Гру не знайдено";
            msg.style.textAlign = "center";
            document.body.appendChild(msg);
        }

        // очищаємо після використання
        sessionStorage.removeItem("searchQuery");
    }
});