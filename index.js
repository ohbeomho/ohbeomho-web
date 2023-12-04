const main = document.querySelector("main");
const osu = document.getElementById("osu");
const coding = document.getElementById("coding");
const about = document.getElementById("about");

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
        [{ left: "-100vw" }, { left: 0 }],
        [{ left: 0 }, { left: "100vw" }]
    ],
    coding: [
        [{ left: "100vw" }, { left: 0 }],
        [{ left: 0 }, { left: "-100vw" }]
    ],
    about: [
        [{ top: "100vh" }, { top: 0 }],
        [{ top: 0 }, { top: "-100vh" }]
    ]
};

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

function backToMain() {
    main.style.display = "flex";

    activePage.animate(keyframes[activePageName][0].toReversed(), options);
    main.animate(keyframes[activePageName][1].toReversed(), options);

    setTimeout(() => {
        activePage.style.display = "none";

        activePage = undefined;
        activePageName = undefined;
    }, options.duration);
}
