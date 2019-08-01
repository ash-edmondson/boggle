
var dice = [
  "AAEEGN", "ABBJOO", "ACHOPS", "AFFKPS",
  "AOOTTW", "CIMOTU", "DEILRX", "DELRVY",
  "DISTTY", "EEGHNW", "EEINSU", "EHRTVW",
  "EIOSST", "ELRTTY", "HIMNQU", "HLNNRZ"
].map(d => d.split(''))

function roll(die){
  var letter = die[Math.floor(Math.random() * die.length)]

  if (letter == 'Q'){
    return 'Qu'
  }
  return letter
}

function shuffle(ar){
  var i = ar.length

  while(i != 0){
    var randIndex = Math.floor(Math.random() * i)
    i--
    var tmp = ar[randIndex]
    ar[randIndex] = ar[i]
    ar[i] = tmp
  }

  return ar
}

var rolled = shuffle(dice).map(roll)

var tray = document.getElementById('tray')
var wordButton = document.getElementById('word')

var buttons = rolled.map(d => {
  var button = document.createElement('button')
  button.innerText = d
  button.className = 'die'

  button.addEventListener('click', function(e){
    wordButton.innerText += e.target.innerText.toUpperCase()
    e.target.disabled = true
  })

  return button
})

var i = 0
for (var row = 0; row < 4; row++){

  var rowDiv = document.createElement('div')

  for (var col = 0; col < 4; col++){
    rowDiv.appendChild(buttons[i])
    i++
  }
  
  tray.appendChild(rowDiv)
}

var timerDiv = document.getElementById('timer')
var timer = {
  running: false,
  seconds: 180
}

setInterval(()=>{
  if(!timer.running){
    return
  }
  if(timer.seconds == 0){
    wordButton.disabled=true
    wordButton.innerText = 'Game Over!'
    buttons.forEach(b=>{
      b.disabled = true
    })
  return
}

  timer.seconds--
  timerDiv.innerText = timer.seconds
}, 1000)

var words = []
var scoreboard = document.querySelector('#scoreboard tbody')

var dict = {}
wordButton.disabled = true
wordButton.innerText = 'Loading...'

fetch('/dict.json').then(r => {
  return r.json()
}).then(j => {
  dict = j
  wordButton.innerText = ''
  wordButton.disabled = false
  timer.running = true
})

wordButton.addEventListener('click', function(e){

  buttons.forEach(b => {
    b.disabled = false
  })

  var word = e.target.innerText.toLowerCase()

  if (word.length < 3){
    wordButton.innerText = ''
    return
  }

  if (!dict[word]){
    wordButton.innerText = ''
    return
  }

  if (!words.includes(word)){
    words.push(word)
  }

  e.target.innerText = ''

  scoreboard.innerHTML = words.map(word => {
    return `<tr>
      <td>${word}</td>
      <td>${score(word)}</td>
    </tr>`
  }).join('')

  var total = words.reduce((a, word) => {
    return a + score(word)
  }, 0)

  scoreboard.innerHTML += `<tr>
    <td>Total:</td>
    <td>${total}</td>
  </tr>`

})

function score(word){
  var score = word.length - 2
  if (score > 6){
    score = 6
  }
  return score
}
