const ageElement = document.querySelector('.age')
ageElement.innerHTML += ' ' + (new Date().getFullYear() - 2009)

const container = document.querySelector('.container')
const ohbeomhoText = document.querySelector('h1')
let animating = false,
  left = 0
const animateTexts = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ[]()1234567890,./\'";'

const animateElements = [
  {
    title: 'INFO',
    elements: 'p'
  },
  {
    title: 'OSU!',
    elements: '.rank div span, .pp'
  }
]

const animateOptions = { duration: 500, fill: 'forwards', easing: 'cubic-bezier(.17,.67,0,1.07)' }

document.querySelectorAll('.left').forEach(element => {
  element.addEventListener('click', () => {
    if (!animating) {
      animating = true
      container.animate([{ left: left + 100 + '%' }], animateOptions).onfinish = () => {
        animating = false
        left += 100
      }
    }
  })

  element.classList.add('fa-solid', 'fa-arrow-left')
})

document.querySelectorAll('.right').forEach(element => {
  element.addEventListener('click', () => {
    if (!animating) {
      animating = true
      container.animate([{ left: left - 100 + '%' }], animateOptions).onfinish = () => {
        animating = false
        left -= 100
      }
    }
  })

  element.classList.add('fa-solid', 'fa-arrow-right')
})

document.querySelectorAll('.title-text').forEach(element =>
  element.addEventListener('click', () => {
    if (!animating) {
      animating = true
      ohbeomhoText.animate([{ top: '-50%' }], animateOptions)
      container.animate([{ top: '-100%' }], animateOptions).onfinish = () => (animating = false)

      document
        .querySelectorAll(animateElements.find(a => a.title === element.innerText).elements)
        .forEach((element, i) => {
          const content = element.innerHTML

          let d = 0

          const i2 = setInterval(() => {
            element.innerHTML = content.substring(0, d)
            for (let i = content.length; i > d; i--) {
              element.innerHTML += animateTexts.charAt(Math.floor(Math.random() * animateTexts.length))
            }
          }, 30)

          setTimeout(() => {
            const i1 = setInterval(() => {
              d++

              if (d === content.length) {
                clearInterval(i1)
                clearInterval(i2)
                element.innerHTML = content
              }
            }, 70)
          }, 100 + 200 * i)
        })
    }
  })
)

document.querySelectorAll('.up').forEach(element => {
  element.addEventListener('click', () => {
    if (!animating) {
      animating = true
      ohbeomhoText.animate([{ top: '20%' }], animateOptions)
      container.animate([{ top: '0px' }], animateOptions).onfinish = () => (animating = false)
    }
  })

  element.classList.add('fa-solid', 'fa-arrow-up')
})

const cursor = document.querySelector('.cursor')
const mousePos = { x: 0, y: 0 }
const prevMousePos = { x: 0, y: 0 }
let size = 50,
  currSize = 50
const clickElements = ['button', 'title-text', 'avatar']

window.addEventListener('mousemove', e => {
  const { pageX: x, pageY: y } = e

  mousePos.x = x
  mousePos.y = y

  if (e.target.classList && clickElements.some(element => e.target.classList.contains(element))) {
    size = 150
  } else {
    size = 50
  }
})

function parallax(element, xdiff, ydiff) {
  element.style.transform = `translateX(${xdiff / 100}px) translateY(${ydiff / 100}px)`
  element.childNodes.forEach(child => child instanceof Element && parallax(child, xdiff, ydiff))
}

function animate() {
  const distX = mousePos.x - prevMousePos.x
  const distY = mousePos.y - prevMousePos.y
  const dist = Math.sqrt(distX * distX + distY * distY)
  const delta = Math.min(Math.abs(dist), 120)
  const angle = Math.atan2(distY, distX)

  prevMousePos.x = mousePos.x
  prevMousePos.y = mousePos.y

  currSize += (size - currSize) / 6

  cursor.style.left = `${mousePos.x - currSize / 2}px`
  cursor.style.top = `${mousePos.y - currSize / 2}px`
  cursor.style.width = cursor.style.height = `${currSize}px`
  cursor.style.transform = `rotate(${angle}rad) scaleX(${1 + delta / 100}) scaleY(${1 - delta / 240})`

  const xdiff = mousePos.x - window.innerWidth / 2
  const ydiff = mousePos.y - window.innerHeight / 2
  parallax(container, xdiff, ydiff)
  ohbeomhoText.style.transform = `translateX(calc(${(xdiff / 150) * 2}px - 50%)) translateY(${(ydiff / 150) * 2}px)`

  requestAnimationFrame(animate)
}

requestAnimationFrame(animate)

const clientInfo = {
  id: process.env.CLIENT_ID,
  secret: process.env.CLIENT_SECRET
}

const corsApiHost = process.env.CORS_API_HOST

let tokenInfo = localStorage.getItem('osu-api-token') ? JSON.parse(localStorage.getItem('osu-api-token')) : undefined
const profileElement = document.getElementById('profile')

if (!tokenInfo || tokenInfo.expiry_date < new Date().getTime()) {
  profileElement.innerHTML = 'Getting osu!api access token...'

  fetch(`${corsApiHost}/https://osu.ppy.sh/oauth/token`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `client_id=${clientInfo.id}&client_secret=${clientInfo.secret}&grant_type=client_credentials&scope=public`
  })
    .then(res => res.json())
    .then(userData => {
      const { access_token: token, expires_in } = userData
      tokenInfo = { token, expiry_date: new Date().getTime() + expires_in * 1000 }
      localStorage.setItem('osu-api-token', JSON.stringify(tokenInfo))
    })
    .finally(getProfile)
} else {
  getProfile()
}

function getProfile() {
  profileElement.innerHTML = 'Getting user data...'

  fetch(`${corsApiHost}/https://osu.ppy.sh/api/v2/users/31971539/osu`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenInfo.token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      const rankHistory = data.rankHistory.data
      let lowest = -Infinity,
        highest = Infinity

      for (let rank of rankHistory) {
        if (rank > lowest) {
          lowest = rank
        }

        if (rank < highest) {
          highest = rank
        }
      }

      profileElement.innerHTML = `
        <img class='avatar' alt='user avatar' />
        <span class='username'>${data.username}</span>
        <div class='rank'>
          <div>
            Global Ranking<br />
            <span>#${data.statistics.global_rank}</span>
          </div>
          <div>
            Country Ranking<br />
            <span>#${data.statistics.country_rank}</span>
          </div>
        </div>
        <span class='pp'>${data.statistics.pp}pp</span>
        <div>
          <div><div>Rank History</div></div>
          <div>
            <div>
              <canvas class='graph' height='150'></canvas>
            </div>
          </div>
          <div style='display: flex; justify-content: space-between; align-items: center'>
            <div>
              Lowest: <span>#${lowest}</span>
            </div>
            <div>
              Highest: <span>#${highest}</span>
            </div>
          </div>
        </div>
      `

      // TODO: Graph animation maybe?
      const graph = profileElement.querySelector('.graph')
      const context = graph.getContext('2d')

      graph.width = graph.offsetWidth

      context.strokeStyle = 'white'
      context.lineWidth = 3

      const previousPos = { x: 0, y: 0 }

      for (let i = 0; i < rankHistory.length; i++) {
        const x = i * ((graph.offsetWidth - 40) / 90) + 20
        const y = 5 + ((rankHistory[i] - highest) / (lowest - highest)) * 140

        if (i > 0) {
          context.beginPath()
          context.moveTo(previousPos.x, previousPos.y)
          context.lineTo(x, y)
          context.stroke()
        }

        previousPos.x = x
        previousPos.y = y
      }

      const avatar = profileElement.querySelector('.avatar')

      avatar.src = data.avatar_url

      let isOWO = false
      avatar.addEventListener('click', () => {
        if (isOWO) return

        avatar.src = '/assets/bemo_owo.png'
        avatar.animate([{ scale: 1 }, { scale: 1.2 }], { ...animateOptions, duration: 1200 })
        avatar.className = ''
        isOWO = true

        setTimeout(() => {
          isOWO = false
          avatar.src = data.avatar_url
          avatar.animate([{ scale: 1.2 }, { scale: 1 }], { ...animateOptions, duration: 1200 })
          avatar.className = 'avatar'
        }, 1500)
      })
    })
}
