// 모바일 기기 감지
if (/Android|iPod|iPad|iPhone|BlackBerry|Windows Phone/i.test(navigator.userAgent)) {
    location.href = "/mobile.html";
}

// 한번 불러온 페이지 내용 저장
const loadedContents = {};

// (애니메이션을 위한) 페이지에 맞는 body 스타일
const flexDir = {
    about: "column",
    osu: "row-reverse",
    coding: "row"
};

const mainPage = document.getElementById("main-page");
const currentPage = document.getElementById("current-page");

document.querySelectorAll(".page-link").forEach((link) =>
    link.addEventListener("click", () => {
        if (currentPage.innerHTML) return;

        const page = link.dataset.page;
        const loaded = loadedContents[page];

        document.body.style.flexDirection = flexDir[page];

        // 애니메이션
        const options = {
            fill: "forwards",
            duration: 1200,
            easing: "cubic-bezier(.21,1.07,.64,1)"
        };
        mainPage.animate(
            [
                {
                    width: "100vw",
                    height: "100vh",
                    opacity: 1
                },
                {
                    width: page === "about" ? "100vw" : "0vw",
                    height: page === "about" ? "0vh" : "100vh",
                    opacity: 0
                }
            ],
            options
        );
        currentPage.animate(
            [
                {
                    width: page === "about" ? "100vw" : "0vw",
                    height: page === "about" ? "0vh" : "100vh",
                    opacity: 0
                },
                {
                    width: "100vw",
                    height: "100vh",
                    opacity: 1
                }
            ],
            options
        );

        if (loaded) {
            currentPage.innerHTML = loaded;
            currentPage.dataset.page = page;

            if (page === "about") document.getElementById("age").innerText = new Date().getFullYear() - 2009;

            return;
        }

        currentPage.innerHTML = "<h2>Loading...<h2>";

        // 페이지 내용 불러오기
        fetch(`./pages/${page}.html`)
            .then((res) => res.text())
            .then((content) => {
                if (content.includes("meta")) {
                    currentPage.innerHTML = `
                        <div>
                            <div style='text-align: center'>
                                <span style='font-size: calc(16px + 2vw); color: rgb(200, 0, 0)'>
                                    Failed to load page '${page}'
                                </span><br />
                                <button onclick='backToMain()'>Back</button>
                            </div>
                        </div>`;
                    return;
                }

                loadedContents[page] = content;
                currentPage.innerHTML = content;

                if (page === "about") document.getElementById("age").innerText = new Date().getFullYear() - 2009;
            })
            .finally(() => (currentPage.dataset.page = page));
    })
);

function backToMain() {
    const page = currentPage.dataset.page;

    const options = {
        fill: "forwards",
        duration: 1200,
        easing: "cubic-bezier(.21,1.07,.64,1)"
    };
    mainPage.animate(
        [
            {
                width: page === "about" ? "100vw" : "0vw",
                height: page === "about" ? "0vh" : "100vh",
                opacity: 0
            },
            {
                width: "100vw",
                height: "100vh",
                opacity: 1
            }
        ],
        options
    );
    currentPage.animate(
        [
            {
                width: "100vw",
                height: "100vh",
                opacity: 1
            },
            {
                width: page === "about" ? "100vw" : "0vw",
                height: page === "about" ? "0vh" : "100vh",
                opacity: 0
            }
        ],
        options
    );

    setTimeout(() => (currentPage.innerHTML = ""), 1200);
}
