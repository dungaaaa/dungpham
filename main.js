$ = document.querySelector.bind(document)
$$ = document.querySelectorAll.bind(document)
const iconHeart = $('.ti-heart')
const iconPhone = $('.ti-headphone')
const html = $('.bg-music')
const cd = $('.img')
// lấy element và load ra bài đầu tiên 
const headerText = $('.text h1')
const headerTextp = $('.text p')
const cdImg = $('.img')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
//  4 cái 
// nút play
const playBtn = $('.icon-bg')
// xử lý play pause
const togglePlay = $('.icon-bg ')
const player = $('.player')
// get thanh chạy thời gian
const inputRange = $('.input-range')
// get thời gian chạy nhạc
const href = $('.a-href')
// get tổng số thời gian 
const musicDuration = $('.a-hreff')
// next bài hát 
const nextBtn = $('.ti-control-forward')
//pre bài hát 
const preBtn = $('.ti-control-backward')
//random 
const randomBtn = $('.ti-control-shuffle')
//reload 
const reloadBtn = $('.ti-reload')
//next load background
const clicklist = $('.bg-music')

iconHeart.onclick = function () {
    iconHeart.classList.toggle('red')
}
iconPhone.onclick = function () {
    iconPhone.classList.toggle('red')
}

const app = {
    currenIndex: 0,
    isplaying: false,
    israndom: false,
    isreload: false,
    songs: [
        {
            name: 'Summer',
            singger: 'marshmello',
            path: './acsset/css/music/song6.mp3',
            img: './acsset/css/img/song1.jpg'
        },
        {
            name: 'Play',
            singger: 'K-319',
            path: './acsset/css/music/song2.mp3',
            img: './acsset/css/img/song2.jpg'
        },
        {
            name: 'ALONE',
            singger: 'marshmello',
            path: './acsset/css/music/song3.mp3',
            img: './acsset/css/img/song3.jpg'
        },
        {
            name: 'Moving On',
            singger: 'marshmello',
            path: './acsset/css/music/song4.mp3',
            img: './acsset/css/img/song4.jpg'
        },
        {
            name: 'Keep It Mello',
            singger: 'marshmello',
            path: './acsset/css/music/song5.mp3',
            img: './acsset/css/img/song5.jpg'
        }
    ],
    definepro: function () {
        Object.defineProperty(this, 'curensong', {
            get: function () {
                return this.songs[this.currenIndex]
            }
        })

    },
    render: function () {

        const htmls = this.songs.map(function (song, index) {
           
            return `      
           <div class="list-music ${index == app.currenIndex ? 'background': ''}"data ="${index}">
               <div>
               <img class="img-music" src="${song.img}" alt="">
               </div>
               <div class='text-h1'>
               <h2 class="text-h">${song.name}</h2>
               <p class="text-p">${song.singger}</p>             
               </div>
               <div>
               <i class="ti-more-alt"></i>
               </div>
           </div>      
            `
        })
        html.innerHTML = htmls.join(' ')

        
    },
    handerEvents: function () {
        const newcd = cd.offsetWidth // lấy ra kích thước hiện tại của cd 
        //xử lý cd quay   
        const cdAnimage = cdImg.animate({ transform: 'rotate(360deg)' }, {
            duration: 10000, // thời gian
            iterations: Infinity, // lặp vô hạn 
            fill: "backwards"
        })
        cdAnimage.pause()
        document.onscroll = function () {
            const scroll = window.scrollY || document.documentElement.scrollTop // bắt độ lăn chuột
            const newwidth = newcd - scroll // kích thước - độ lăn chuột
            cd.style.width = Math.floor(newwidth) > 0 ? Math.floor(newwidth) + 'px' : 0 //chọc vào style lấy width bằng kích thước cũ - độ lăn chuột
            cd.style.opacity = newwidth / newcd
        },
            //chạy nhạc khi play  và pause
            playBtn.onclick = function () {
                if (app.isplaying) {

                    audio.pause()

                } else {

                    audio.play()
                }
            }
        // sự kiên onplay chạy thì bật nhạc
        audio.onplay = function () {
            app.isplaying = true
            player.classList.add('pp')
            cdAnimage.play() // chạy thì quanh cd
           
        }
        //  sự kiện pause bấm thì tắt nhạc 
        audio.onpause = function () {
            app.isplaying = false
            player.classList.remove('pp')
            cdAnimage.pause() // pause thì dừng cd
           
        }
        //  tiến độ phát nhạc 
        audio.ontimeupdate = function (e) {
            if (audio.duration) {
                // thanh chạy phát nhạc
                const inputRangeCurren = Math.floor(audio.currentTime / audio.duration * 100)
                inputRange.value = inputRangeCurren
                // chạy giây phát nhạc 
                let curremin = Math.floor(e.target.currentTime / 60)
                let curresec = Math.floor(e.target.currentTime % 60)
                if (curresec < 10) {
                    curresec = `0 ${curresec}`
                }
                href.innerHTML = `${curremin}:${curresec}`
                //  tổng số thời gian nhạc phát 
                const audioDuration = audio.duration
                const totalMin = Math.floor(audioDuration / 60)
                const totalsec = Math.floor(audioDuration % 60)
                musicDuration.innerText = `${totalMin}:${totalsec}`

            }

        }
        // xử lý khi tua thanh chạy nhạc
        inputRange.onclick = function (e) {
            const inputWidth = inputRange.offsetWidth
            const clickOffsetX = e.offsetX
            const inputSeek = audio.duration
            audio.currentTime = (clickOffsetX / inputWidth) * inputSeek
        }
        // nút nextxong
        nextBtn.onclick = function () {
            //khi random
            if (app.israndom) {
                app.random()
            } else {

                app.nextsong()
            }
            audio.play()
            app.render() // render lai khi chuyen bai
            app.scrollview() // khi bấm next thì view nhảy 
        }
        //nút presong
        preBtn.onclick = function () {
            //khi random pre
            if (app.israndom) {
                app.random()
            } else {
                app.presong()

            }
            audio.play()
            app.render() // render lai giao dien khi chuyen bai
            app.scrollview() // khi bấm next thì view nhảy 
        }
        //tự next khi hết bài 
        audio.onended = function () {
            //reload 
            if (app.isreload) {
                audio.play
            } else {

                app.nextsong()
            }
            audio.play()
        }
        // random 
        randomBtn.onclick = function () {
            app.israndom = !app.israndom
            randomBtn.classList.toggle('active', app.israndom)

        }
        //reload
        reloadBtn.onclick = function () {
            app.isreload = !app.isreload
            reloadBtn.classList.toggle('active', app.isreload)
        }
        //lắng nghe sự kiện click vào playlist
        clicklist.onclick = function(e){
            const a = e.target.closest('.list-music:not(.background)')
           if(a || e.target.closest('.ti-more-alt')){
                if(a){
                    app.currenIndex =  a.getAttribute('data')
                    app.loadCurrensong()
                    app.render()
                    audio.play()
                }
           }
        }
      
    },
    scrollview: function(){
        setTimeout(() => {
          $('.list-music.background').scrollIntoView({
                 behavior  :"smooth",
                 block :'end',
             })
            
            
        }, 100);
    },
    nextsong: function () {
        this.currenIndex++
        if (this.currenIndex >= this.songs.length) {
            this.currenIndex = 0
        }
        this.loadCurrensong()
    },
    presong: function () {
        this.currenIndex--
        if (this.currenIndex < 0) {
            this.currenIndex = this.songs.length - 1
        }
        this.loadCurrensong()
    },
    random: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currenIndex);
        this.currenIndex = newIndex
        this.loadCurrensong()
    },
    loadCurrensong: function () {
        headerText.textContent = this.curensong.name // nhúng tên 
        headerTextp.textContent = this.curensong.singger // nhúng tác giả 
        cdImg.style.backgroundImage = `url('${this.curensong.img}')`// nhúng ảnh 
        audio.src = this.curensong.path // nhúng link   


    },

    start: function () {
        // LẮNG NGHE CÁC SỰ KIỆN DOM EVENTS
        this.handerEvents()
        //  ĐỊNH NGHĨA CÁC THUỘC TÍNH CHO OBJ
        this.definepro()
        // HÀM TẢI BÀI HÁT HIỆN TẠI
        this.loadCurrensong()
        // RENDER RA HTML
        this.render()
        this.nextsong()
        this.presong()
        this.random()
        app.scrollview()
    }
}
app.start()

anime.timeline({loop: true})
  .add({
    targets: '.ml5 .line',
    opacity: [0.5,1],
    scaleX: [0, 1],
    easing: "easeInOutExpo",
    duration: 700
  }).add({
    targets: '.ml5 .line',
    duration: 600,
    easing: "easeOutExpo",
    translateY: (el, i) => (-0.625 + 0.625*2*i) + "em"
  }).add({
    targets: '.ml5 .ampersand',
    opacity: [0,1],
    scaleY: [0.5, 1],
    easing: "easeOutExpo",
    duration: 600,
    offset: '-=600'
  }).add({
    targets: '.ml5 .letters-left',
    opacity: [0,1],
    translateX: ["0.5em", 0],
    easing: "easeOutExpo",
    duration: 600,
    offset: '-=300'
  }).add({
    targets: '.ml5 .letters-right',
    opacity: [0,1],
    translateX: ["-0.5em", 0],
    easing: "easeOutExpo",
    duration: 600,
    offset: '-=600'
  }).add({
    targets: '.ml5',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });
