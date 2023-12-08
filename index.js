const main = document.querySelector("main");
const osu = document.getElementById("osu");
const coding = document.getElementById("coding");
const about = document.getElementById("about");

const mainTitle = document.querySelector(".main-title");

const changeThemeButton = document.getElementById("change-theme");
const toggleSnowflakeButton = document.getElementById("toggle-snowflake");

// 나이 계산
document.getElementById("age").innerText = new Date().getFullYear() - 2009;

const pages = {
    osu,
    coding,
    about
};

// 애니메이션 키프레임
// 첫번째는 페이지, 두번째는 메인 페이지 키프레임
const keyframes = {
    osu: [
        [{ left: "-70svw" }, { left: 0 }],
        [{ left: 0 }, { left: "70svw" }]
    ],
    coding: [
        [{ left: "70svw" }, { left: 0 }],
        [{ left: 0 }, { left: "-70svw" }]
    ],
    about: [
        [{ top: "70svh" }, { top: 0 }],
        [{ top: 0 }, { top: "-70svh" }]
    ]
};

// 키프레임에 투명도 옵션 추가
for (let page in keyframes) {
    const pageKeyframes = keyframes[page];

    pageKeyframes[0][0].opacity = pageKeyframes[1][1].opacity = 0;
    pageKeyframes[0][1].opacity = pageKeyframes[1][0].opacity = 1;
}

// 애니메이션 옵션
const options = {
    fill: "forwards",
    duration: 800,
    easing: "cubic-bezier(.1,.65,.35,1)"
};

let activePage, activePageName;

document.querySelectorAll(".page-link").forEach((link) =>
    link.addEventListener("click", () => {
        if (activePage) return;

        activePageName = link.dataset.page;
        activePage = pages[activePageName];

        activePage.style.display = "block";

        activePage.animate(keyframes[activePageName][0], options);
        main.animate(keyframes[activePageName][1], options);

        setTimeout(() => {
            main.style.display = "none";
        }, options.duration);
    })
);

document.querySelectorAll("button.back").forEach((button) =>
    button.addEventListener("click", () => {
        main.style.display = "flex";

        activePage.animate(keyframes[activePageName][0].toReversed(), options);
        main.animate(keyframes[activePageName][1].toReversed(), options);

        const previousPage = activePage;
        setTimeout(() => (previousPage.style.display = "none"), options.duration);

        activePage = undefined;
        activePageName = undefined;
    })
);

function isTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

if (!isTouchDevice()) {
    window.addEventListener("mousemove", (e) => {
        // 3D rotate effect
        const rotateXAxis = (window.innerHeight / 2 - e.clientY) * (6 / (window.innerHeight / 2));
        const rotateYAxis = (window.innerWidth / 2 - e.clientX) * (-3 / (window.innerWidth / 2));
        (activePage
            ? activePage.querySelector(".content")
            : main.querySelector(".content")
        ).style.transform = `perspective(700px) rotateX(${rotateXAxis}deg) rotateY(${rotateYAxis}deg)`;
    });
}

// 눈 내리는 효과 (for christmas)

const snowflakes = [];

function createSnowflake() {
    const snowflake = document.createElement("div");
    snowflake.classList.add("snowflake");
    snowflake.style.top = "calc(-20px - 0.5vw)";
    snowflake.style.left = `${Math.random() * window.visualViewport.width - 30}px`;
    snowflake.style.opacity = Math.random() * 0.4 + 0.2;
    snowflake.innerHTML = "<i class='fa-solid fa-snowflake'></i>";
    snowflake
        .animate([{ top: `${window.visualViewport.height}px`, transform: `rotate(${Math.random() * 720 - 360}deg)` }], {
            fill: "forwards",
            duration: 10000,
            easing: "ease-in"
        })
        .addEventListener("finish", () => {
            snowflakes.splice(snowflakes.indexOf(snowflake), 1);
            snowflake.remove();
        });

    document.body.appendChild(snowflake);
}

// 쿠키 get/set
function getCookie(name, defaultValue) {
    const index = document.cookie.search(new RegExp(`${name}=`));

    if (index !== -1) {
        const str = document.cookie.slice(index + name.length + 1);
        const semiIndex = str.indexOf(";");
        return str.slice(0, semiIndex === -1 ? str.length : semiIndex);
    }

    return defaultValue;
}

function setCookie(name, value) {
    document.cookie = `${name}=${encodeURIComponent(String(value))}; max-age=${60 * 60 * 24 * 10}`;
}

// 눈 내리는 효과 설정
let snowflakeInterval,
    snowflakeEnabled = getCookie("snowflake", false);

function setSnowflake(enable) {
    snowflakeEnabled = enable;
    setCookie("snowflake", enable);

    if (!enable) {
        if (snowflakeInterval) clearInterval(snowflakeInterval);
        toggleSnowflakeButton.classList.add("disabled");
        return;
    }

    createSnowflake();
    snowflakeInterval = setInterval(createSnowflake, 400);
    toggleSnowflakeButton.classList.remove("disabled");
}

// 테마 설정
function setTheme(theme) {
    document.body.dataset.theme = theme;

    if (theme === "dark") {
        changeThemeButton.classList.remove("disabled");
    } else {
        changeThemeButton.classList.add("disabled");
    }

    setCookie("theme", theme);
}

// 테마/눈 내리는 효과 상태 불러오기
setTheme(getCookie("theme", "light"));
setSnowflake(snowflakeEnabled);

changeThemeButton.addEventListener("click", () => setTheme(document.body.dataset.theme === "light" ? "dark" : "light"));
toggleSnowflakeButton.addEventListener("click", () => setSnowflake(snowflakeEnabled ? false : true));
