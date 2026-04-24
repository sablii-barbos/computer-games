/**
 * ЛАБОРАТОРНА РОБОТА №6
 * Розробник: Саблій Остап
 */

// 1. Функція з параметрами за замовчуванням
function logUserStatus(name = "Гість", age = "не вказано") {
    console.log(`[СИСТЕМА]: Користувач: ${name}, Вік: ${age}`);
}

window.onload = function () {
    // Використовуємо sessionStorage (пам'ять на одну вкладку)
    if (!sessionStorage.getItem("userAge")) {
        let name = prompt("Вітаємо! Як вас звати?", "Гість");
        let age = prompt("Скільки вам років?");

        if (name && age) {
            sessionStorage.setItem("userName", name);
            sessionStorage.setItem("userAge", age);
            // Прапорець для контролю показу повідомлення "Повний доступ"
            sessionStorage.setItem("fullAccessShown", "false");
            
            logUserStatus(name, age);
            window.location.reload();
            return; 
        }
    }

    // --- БОМ: Фон на 5 сек ---
    document.body.style.backgroundColor = "#f0f0f5";
    setTimeout(() => {
        document.body.style.backgroundColor = "";
    }, 5000);

    // --- ДОМ: Атрибути посилань ---
    document.querySelectorAll("a").forEach(link => {
        link.setAttribute("title", "Перехід за посиланням");
    });

    applyContentControl();
};

function applyContentControl() {
    const age = parseInt(sessionStorage.getItem("userAge")) || 0;

    // ПЕРЕВІРКА ПОВІДОМЛЕННЯ
    if (age < 18) {
        // Якщо дитина — показуємо банер ЗАВЖДИ на кожній сторінці
        createStatusBanner(age, false); 
    } else {
        // Якщо 18+ — показуємо банер ТІЛЬКИ ОДИН РАЗ і з константою "true" для видалення
        if (sessionStorage.getItem("fullAccessShown") === "false") {
            createStatusBanner(age, true);
            sessionStorage.setItem("fullAccessShown", "true");
        }
    }

    // Фільтрація ігор
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

function createStatusBanner(age, shouldHide) {
    const banner = document.createElement("div");
    banner.id = "security-banner";
    
    // Стилі
    banner.style.padding = "10px";
    banner.style.textAlign = "center";
    banner.style.fontWeight = "bold";
    banner.style.fontSize = "14px";
    banner.style.borderBottom = "2px solid";
    banner.style.width = "100%";
    banner.style.transition = "opacity 1s ease";

    if (age < 18) {
        banner.style.background = "#ffe4e6";
        banner.style.color = "#b91c1c";
        banner.style.borderColor = "#f43f5e";
        banner.textContent = "⚠️ Дитячий режим: показано лише Minecraft та Forza.";
    } else {
        banner.style.background = "#f0fdf4";
        banner.style.color = "#15803d";
        banner.style.borderColor = "#22c55e";
        banner.textContent = "✅ Повний доступ дозволено (18+).";
    }

    document.body.prepend(banner);

    // Логіка зникнення (тільки для повного доступу)
    if (shouldHide) {
        setTimeout(() => {
            banner.style.opacity = "0";
            setTimeout(() => banner.remove(), 1000);
        }, 2000);
    }
}

function goToHome() {
    if (confirm("Бажаєте повернутися на головну?")) {
        window.location.href = "index.html";
    }
}