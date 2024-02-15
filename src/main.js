const container = document.querySelector('.container')
const ohbeomhoText = document.querySelector('h1')
let animating = false,
  left = 0

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

const client_info = {
  id: process.env.CLIENT_ID,
  secret: process.env.CLIENT_SECRET
}

const cors_api_host = process.env.CORS_API_HOST

let token_info = localStorage.getItem('osu-api-token')
const profile_element = document.getElementById('profile')

if (!token_info || JSON.parse(token_info).expiry_date < new Date().getTime()) {
  profile_element.innerHTML = 'Getting osu!api access token...'

  fetch(`${cors_api_host}/https://osu.ppy.sh/oauth/token`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `client_id=${client_info.id}&client_secret=${client_info.secret}&grant_type=client_credentials&scope=public`
  })
    .then(res => res.json())
    .then(data => {
      const { access_token: token, expires_in } = data
      token_info = { token, expiry_date: new Date().getTime() + expires_in * 1000 }
      localStorage.setItem('osu-api-token', JSON.stringify(token_info))
    })
    .finally(getProfile)
} else {
  getProfile()
}

function getProfile() {
  token_info = JSON.parse(token_info)
  profile_element.innerHTML = 'Getting user data...'

  fetch(`${cors_api_host}/https://osu.ppy.sh/api/v2/users/31971539/osu`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token_info.token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log(data)

      const avatar = document.createElement('img')
      avatar.src = data.avatar_url
      avatar.className = 'avatar'

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
        }, 2000)
      })

      // TODO: Add more elements
      profile_element.innerHTML = `
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
      `

      profile_element.prepend(avatar)
    })
}
