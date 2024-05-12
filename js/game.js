const table = document.getElementById("table")
const retry = document.getElementById("retry")
const h1 = document.getElementById("h1")
const gridSize = 11
const bombCount = 10
numbers = []
path = []
pathChecked = []

numberOfFlagsRemaining = 10

for (let i = 0; i < gridSize; i++) {
    
    for (let j = 0; j < gridSize; j++) {
        mezo = document.createElement("div")
        mezo.setAttribute("type", 0)
        mezo.setAttribute("onclick", "check(this)")
        mezo.addEventListener("contextmenu", (e) => placeFlag(e), false)
        mezo.id = `${i}-${j}` 
        table.appendChild(mezo)
    }
}

for (let i = 0; i < Math.min(bombCount, gridSize * gridSize); i++) {
    x = Math.round(Math.random() * (gridSize - 1))
    y = Math.round(Math.random() * (gridSize - 1))

    mezo = document.getElementById(`${x}-${y}`)
    if (mezo.getAttribute("type") == 0) {
        mezo.setAttribute("type", 1)
    }
    else {
        i--
    }
}

for (let i = 0; i < gridSize; i++) {
    numbers.push([])
    for (let j = 0; j < gridSize; j++) {
        minesAround = 0
        if (i != 0) minesAround += parseInt(document.getElementById(`${i-1}-${j}`).getAttribute("type"))
        if (j != 0) minesAround += parseInt(document.getElementById(`${i}-${j-1}`).getAttribute("type"))
        if (i != 0 && j != 0) minesAround += parseInt(document.getElementById(`${i-1}-${j-1}`).getAttribute("type"))
        if (i != gridSize - 1) minesAround += parseInt(document.getElementById(`${i+1}-${j}`).getAttribute("type"))
        if (j != gridSize - 1) minesAround += parseInt(document.getElementById(`${i}-${j+1}`).getAttribute("type"))
        if (i != gridSize - 1 && j != gridSize - 1) minesAround += parseInt(document.getElementById(`${i+1}-${j+1}`).getAttribute("type"))
        if (i != 0 && j != gridSize - 1) minesAround += parseInt(document.getElementById(`${i-1}-${j+1}`).getAttribute("type"))
        if (i != gridSize - 1 && j != 0) minesAround += parseInt(document.getElementById(`${i+1}-${j-1}`).getAttribute("type"))
        numbers[i].push(minesAround)
    }
    
}

function check(mezo) {
    if (mezo.classList.contains("flag")) {
        return;
    }

    if (mezo.getAttribute("type") == 1) {
        revealBomb(mezo)
        retry.style.visibility = "visible"
        table.style.pointerEvents = "none"

        let time = 100
        let a = 50

        let bombs = []
        nodes = document.querySelectorAll("div[type = '1']:not(.bomb)").forEach(div => {
            bombs.push(div)
        })

        for (let i = 0; i < bombs.length; i++) {
            setTimeout(() => {
                r = Math.round(Math.random() * (bombs.length -1)) 
                revealBomb(bombs[r])
                bombs.splice(r, 1)
            }, time);
            
            time += a
            a *= 0.97
        }
    }
    else {
        path = [mezo.id]
        pathChecked = [mezo.id]

        while (path.length != 0) {
            path = findNeighbour(path)
        }

        pathChecked.forEach(id => {
           document.getElementById(id).innerHTML = (numbers[parseInt(id.split("-")[0])][parseInt(id.split("-")[1])] == 0 ? " " : numbers[parseInt(id.split("-")[0])][parseInt(id.split("-")[1])])
           document.getElementById(id).classList.add("clicked")
        })

        checkWin()

    }
}

function checkWin() {
    if (document.querySelectorAll("div[type = '0']").length == document.querySelectorAll(".clicked").length) {
        h1.innerHTML = "Nyertél!"
        retry.style.visibility = "visible"
        table.style.pointerEvents = "none"
    }
}

function revealBomb(div) {
    div.style.backgroundColor = "red"
    div.classList.add("bomb")
    div.innerHTML = `<img src = "../images/mine.png">`
}

function placeFlag(e) {
    e.preventDefault()
    let target = e.target

    div = target.tagName == "DIV" ? target : target.parentElement
    if (!target || target.classList.contains("clicked")) {
        return
    }

    if (div.classList.contains("flag")) {
        div.classList.remove("flag")
        div.innerHTML = ""

        numberOfFlagsRemaining++
    } else if (numberOfFlagsRemaining > 0) {
        div.classList.add("flag")
        div.innerHTML = `<img src = "../images/flag.png">`

        numberOfFlagsRemaining--
    }

    return false
}

function findNeighbour(list) {

    let a = []

    for (let i = 0; i < list.length; i++) {
        x = parseInt(list[i].split("-")[0])
        y = parseInt(list[i].split("-")[1])

        if (x != 0 && document.getElementById(`${x-1}-${y}`).getAttribute("type") == 0 && !pathChecked.includes(`${x-1}-${y}`) && numbers[x][y] == 0) {
            a.push(`${x-1}-${y}`)
            pathChecked.push(`${x-1}-${y}`)
        }
        if (y != 0 && document.getElementById(`${x}-${y-1}`).getAttribute("type") == 0 && !pathChecked.includes(`${x}-${y-1}`) && numbers[x][y] == 0) {
            a.push(`${x}-${y-1}`)
            pathChecked.push(`${x}-${y-1}`)
        }
        if (x != gridSize - 1 && document.getElementById(`${x+1}-${y}`).getAttribute("type") == 0 && !pathChecked.includes(`${x+1}-${y}`) && numbers[x][y] == 0) {
            a.push(`${x+1}-${y}`)
            pathChecked.push(`${x+1}-${y}`)
        }
        if (y != gridSize - 1 && document.getElementById(`${x}-${y+1}`).getAttribute("type") == 0 && !pathChecked.includes(`${x}-${y+1}`) && numbers[x][y] == 0) {
            a.push(`${x}-${y+1}`)
            pathChecked.push(`${x}-${y+1}`)
        }
    }

    return a
}

function restart() {
    document.location.reload()
}