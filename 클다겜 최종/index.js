const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')
const scoreEl = document.querySelector('#scoreEl')
const startgameBtn = document.querySelector('#startgameBtn')
const modalEl = document.querySelector('#modalEl')
const bigScoreEl = document.querySelector('#bigScoreEl')

canvas.width = 700
canvas.height = 700

var ctx = canvas.getContext("2d");

class Player { //플레이어
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
}

class Projectile { //총알 이놈이 Bullet
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}
class Enemy { //적
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

const friction = 0.99
class Particle { //적과 총알의 충돌
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }
    draw() {
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }

    update() {
        this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01
    }
}

const x = canvas.width / 2
const y = canvas.height / 2

let player = new Player(x, y, 10, 'skyblue') 
let projectiles = []
let enemies = []
let particles = []
let ProjectilesCnt = 0;

function init() { //플레이어한테 크기, 위치, 색 값 주고 스코어값 적어줌
    player = new Player(x, y, 10, 'skyblue')
    projectiles = []
    enemies = []
    particles = []
    score = 0
    scoreEl.innerHTML = score
    bigScoreEl.innerHTML = score
}

function spawEnemies() {  //적 생성
    setInterval(() => {
        const radius = Math.random() * (30 - 4) + 4
        //랜덤 함수로 적의 크기 지정
        let x
        let y

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }
        const color = 'blue' //적 색깔
        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        enemies.push(new Enemy(x, y, radius, color, velocity));
        //적 위치, 색깔, 크기, 속도 (velocity가 속도 speed임)지정
    }, 1000)
}

let animationId
let score = 0 //스코어 0시작

function animate() {
    animationId = requestAnimationFrame(animate)
    stars = 200;

    c.fillStyle = 'rgba(0, 0, 0, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1)
        } else {
            particle.update()
        }

    })
    projectiles.forEach((projectile, index) => {
        projectile.update()
        //화면 밖으로 나가면 총알 제거
        if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
            ProjectilesCnt--;
        }
    })

    enemies.forEach((enemy, index) => {
        enemy.update()

        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)

        //게임 끝
        if (dist - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId)
            modalEl.style.display = 'flex'
            bigScoreEl.innerHTML = score
        }

        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            // 총알이 적한테 닿을 때
            if (dist - enemy.radius - projectile.radius < 1) {

                for (let i = 0; i < enemy.radius * 2; i++) {
                    particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color, {
                        x: (Math.random() - 0.5) * (Math.random() * 6),
                        y: (Math.random() - 0.5) * (Math.random() * 6),
                    }))
                }
                if (enemy.radius - 10 > 5) {
                    // 100점 오름, 적의 크기를 점점 줄어들게함
                    score += 100
                    scoreEl.innerHTML = score / 10

                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    })
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                    ProjectilesCnt--;
                } else { //적의 크기가 5보다 작아져서 사라짐
                    score += 250 //적을 완전히 제거하면 250점 오름
                    scoreEl.innerHTML = score / 10
                    setTimeout(() => {
                        enemies.splice(index, 1)
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                    ProjectilesCnt--; 
                }
            }
        })
    })
}

addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2)
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }
    if(ProjectilesCnt < 5){ //총알 개수가 5이하여야 총알이 나감
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity))
        ProjectilesCnt++;
        console.log(ProjectilesCnt);
    }
    
})

startgameBtn.addEventListener('click', () => {
    init()
    animate()
    spawEnemies()
    modalEl.style.display = 'none'
    // 스타트 게임 버튼 눌러서 시작. 모든 함수 불러옴
})