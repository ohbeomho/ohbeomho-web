const isMobile = (function (a) {
  if (
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
      a
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      a.substr(0, 4)
    )
  )
    return true
  else return false
})(navigator.userAgent || navigator.vendor || window.opera)

const ageElement = document.querySelector('.age')
ageElement.innerHTML += ' <span>' + (new Date().getFullYear() - 2009) + '</span>'

const container = document.querySelector('.container')
const ohbeomhoText = document.querySelector('h1')
let animating = false,
  left = 0
const animateTexts = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ[]()1234567890,./\'";'

const animateElements = [
  {
    title: 'INFO',
    elements: '#info p span'
  },
  {
    title: 'OSU!',
    elements: '.rank div span, .pp, .rank-history span'
  },
  {
    title: 'CODING',
    elements: '#coding p span'
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
          const content = element.innerHTML.trim()

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
            }, 70 - content.length)
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

if (!isMobile) {
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
    element.style.transform = `translateX(${xdiff / 150}px) translateY(${ydiff / 150}px)`
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
} else {
  cursor.style.display = 'none'
}

const profileElement = document.getElementById('profile')

let tokenInfo = localStorage.getItem('osu-api-token') ? JSON.parse(localStorage.getItem('osu-api-token')) : undefined

if (!tokenInfo || tokenInfo.expiry_date < new Date().getTime()) {
  profileElement.innerHTML = 'Getting osu!api access token...'

  fetch(`${process.env.CORS_API_HOST}/https://osu.ppy.sh/oauth/token`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=client_credentials&scope=public`
  })
    .then(res => res.json())
    .then(data => {
      const { access_token: token, expires_in } = data
      tokenInfo = { token, expiry_date: new Date().getTime() + expires_in * 1000 }
      localStorage.setItem('osu-api-token', JSON.stringify(tokenInfo))

      getProfile()
    })
    .catch(err => (profileElement.innerHTML = 'Error occurred') && console.log(err))
} else {
  getProfile()
}

function getProfile() {
  profileElement.innerHTML = 'Getting user data...'

  fetch(`${process.env.CORS_API_HOST}/https://osu.ppy.sh/api/v2/users/31971539/osu`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenInfo.token}`
    }
  })
    .then(res => res.json())
    .then(userData => {
      const rankHistory = userData.rankHistory.data
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
        <span class='username'>${userData.username}</span>
        <div class='rank'>
          <div>
            <b>Global Ranking</b><br />
            <span>#${userData.statistics.global_rank}</span>
          </div>
          <div>
            <b>Country Ranking</b><br />
            <span>#${userData.statistics.country_rank}</span>
          </div>
        </div>
        <span class='pp'>${userData.statistics.pp}pp</span>
        <div>
          <div><b>Rank History</b></div>
          <div>
            <div>
              <canvas class='graph' height='150'></canvas>
            </div>
          </div>
          <div style='display: flex; justify-content: space-between; align-items: center' class='rank-history'>
            <div>
              <b style='color: red'>Lowest</b> <span>#${lowest}</span>
            </div>
            <div>
              <b style='color: rgb(0, 255, 0); text-shadow: 0 0 white'>Highest</b> <span>#${highest}</span>
            </div>
          </div>
        </div>
      `

      const graph = profileElement.querySelector('.graph')
      const context = graph.getContext('2d')

      graph.width = graph.offsetWidth
      graph.height = graph.offsetHeight

      context.strokeStyle = 'white'
      context.lineWidth = 2

      const previousPos = { x: 0, y: 0 }

      for (let i = 0; i < rankHistory.length; i++) {
        const x = i * ((graph.offsetWidth - 20) / 90) + 10
        const y = 10 + ((rankHistory[i] - highest) / (lowest - highest)) * (graph.height - 20)

        if (i > 0) {
          context.beginPath()
          context.moveTo(previousPos.x, previousPos.y)
          context.lineTo(x, y)
          context.stroke()
        }

        previousPos.x = x
        previousPos.y = y
      }

      let markedLowest = false,
        markedHighest = false

      for (let i = 0; i < rankHistory.length; i++) {
        if (markedLowest && markedHighest) break

        if (rankHistory[i] === lowest || rankHistory[i] === highest) {
          const x = i * ((graph.offsetWidth - 20) / 90) + 10
          const y = 10 + ((rankHistory[i] - highest) / (lowest - highest)) * (graph.height - 20)

          if (rankHistory[i] === lowest) {
            context.fillStyle = 'red'
            markedLowest = true
          } else if (rankHistory[i] === highest) {
            context.fillStyle = 'rgb(0, 255, 0)'
            context.beginPath()
            context.arc(x, y, 3, 0, 2 * Math.PI)
            context.stroke()
            markedHighest = true
          }

          context.beginPath()
          context.arc(x, y, 3, 0, 2 * Math.PI)
          context.fill()
        }
      }

      const avatar = profileElement.querySelector('.avatar')

      avatar.src = userData.avatar_url

      let isOWO = false
      avatar.addEventListener('click', () => {
        if (isOWO) return

        avatar.src = '/assets/bemo_owo.png'
        avatar.animate([{ scale: 1 }, { scale: 1.2 }], { ...animateOptions, duration: 1200 })
        avatar.className = ''
        isOWO = true

        setTimeout(() => {
          isOWO = false
          avatar.src = userData.avatar_url
          avatar.animate([{ scale: 1.2 }, { scale: 1 }], { ...animateOptions, duration: 1200 })
          avatar.className = 'avatar'
        }, 1500)
      })
    })
    .catch(err => (profileElement.innerHTML = 'Error occurred') && console.log(err))
}
