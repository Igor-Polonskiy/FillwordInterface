import {
    renderCheckPanel,
    getCheckPanelElements,
    checkingAnswerReset
} from "../../_common_files/common_scripts.js";

/*(() => {
    //уникальный Id тренажера
    const taskId = 'task-1'
    //size - количество клеток поля по горизонтали и вертикали
    const size = 5;

    const data = [
          {
              word: 'король',
              path: [1, 2, 3, 8, 13, 18]
          },
          {
              word: 'ладья',
              path: [7, 6, 11, 16, 21]
          },
          {
              word: 'ферзь',
              path: [12, 17, 22, 23, 24]
          },
          {
              word: 'пешка',
              path: [25, 20, 19, 14, 15]
          },
          {
              word: 'конь',
              path: [4, 9, 10, 5]
          },
    ]

    renderFillword(taskId, data, size)

})();*/

const taskId = 'task-1'
const size = 5;
renderFillword(taskId, size)



function renderFillword(taskId, size,) {
    const taskWrapper = document.querySelector(`#${taskId}`);

    const gameField = taskWrapper.querySelector('.fillword_field')

    const fieldSize = 50 * size
    let isMousedown = false
    let currentCell = null
    const input = taskWrapper.querySelector('.input')
    const list = taskWrapper.querySelector('ol')
    const addWord = taskWrapper.querySelector(".addWord")
    const generate = taskWrapper.querySelector('.generate')
    const textarea = taskWrapper.querySelector('.textarea')
    let word = ''
    let object = []

    gameField.style.width = `${fieldSize}px`

    addWord.addEventListener('click', (e) => {
        word = input.value

        if (input.value) {
            let li = document.createElement('li')
            li.innerHTML = `<span>${input.value}</span>`
            let btn = document.createElement('button')
            btn.innerHTML = "удалить"
            btn.addEventListener('click', deleteWord)
            li.append(btn)
            list.append(li)
            input.value = ''
            input.disabled = true
        }
        gameField.addEventListener('pointerdown', onPointerdown)
    })

    function deleteWord(e) {
        
        object.forEach((item,index) => {
            console.log(item.word,`"${e.target.parentElement.children[0].innerText}"`)
            if (item.word ===e.target.parentElement.children[0].innerText){
                item.path.forEach(item=>{
                    cells[item-1].classList.remove('fillword_color', 'fillword_buzy')
                    cells[item-1].style.backgroundColor = ''
                    cells[item-1].innerHTML = ''
                })

                object.splice(index,1) 

            }
        })
        e.target.parentElement.remove()
    }

    fillField()
    let cells = taskWrapper.querySelectorAll('.fillword_cell')

    renderCheckPanel(taskWrapper, true);
    const { btnReset, btnTest, controlsBox, infoBox } =
        getCheckPanelElements(taskWrapper);

    btnTest.classList.add('noDisplayElement')

    btnReset.addEventListener('click', onReloadBtnClick)

    generate.addEventListener('click', () => {
        console.log(object)
        textarea.innerHTML =  JSON.stringify(object);
    })

   

    function fillField() {
        for (let i = 0; i < (size * size); i++) {
            const cell = document.createElement('div')
            cell.classList.add('fillword_cell')
            cell.id = i + 1
            gameField.append(cell)
        }
    }

    function onReloadBtnClick() {
        checkingAnswerReset(controlsBox, infoBox)
        cells.forEach(item => {
            item.classList.remove('fillword_color', 'fillword_buzy')
            item.style.backgroundColor = ''
            item.innerHTML = ''
            list.innerHTML = ''
            word = ''
            object = []
            input.value = ''
            input.disabled = false
            textarea.innerHTML = ''
        })
    }

    function onPointerdown(e) {
        if (!e.target.classList.contains('fillword_buzy')) {
            let color = '#' + (Math.random().toString(16) + '000000').substring(2, 8).toUpperCase()
            let count = 0
            let wordCells = []
            if (e.target.classList.contains('cell')) {
                isMousedown = true
                currentCell = (e.target)
                currentCell.classList.add('color')
                wordCells.push(+currentCell.id)

            }

            gameField.addEventListener('pointermove', onMousemove)
            gameField.addEventListener('pointerup', onMouseup)
            gameField.addEventListener('pointerleave', onMouseleave)

            let elemBelow
            function onMousemove(e) {
                if (count < word.length) {
                    elemBelow = document.elementFromPoint(e.clientX, e.clientY);
                    if (elemBelow.classList.contains('fillword_cell')) {
                        if (currentCell !== elemBelow) {
                            if (elemBelow.id !== wordCells.find(el => el === elemBelow.id) && !elemBelow.classList.contains('fillword_buzy')) {
                                currentCell = elemBelow
                                currentCell.classList.add('fillword_color')
                                wordCells.push(+currentCell.id)
                                currentCell.append(word[count])
                                count++
                            }
                            else if (elemBelow.id === wordCells[wordCells.length - 2]) {
                                currentCell.classList.remove('fillword_color')
                                currentCell.innerHTML = ''
                                wordCells.pop()
                                count--
                                currentCell = (elemBelow)
                            } else {
                                onMouseup()
                            }
                        }
                    }
                } else onMouseup()

            }

            function onMouseup() {
                isMousedown = false
                gameField.removeEventListener('pointermove', onMousemove)
                gameField.removeEventListener('pointerdown', onPointerdown)
                gameField.removeEventListener('pointerup', onMouseup)
                gameField.removeEventListener('pointerleave', onMouseleave)

                if (wordCells.length === word.length) {
                    console.log(wordCells)
                    wordCells.forEach(item => {
                        cells[item - 1].classList.add('fillword_buzy')
                        cells[item - 1].style.backgroundColor = color
                    })
                    input.disabled = false
                    object.push({word:`${word}`,path:[...wordCells]})
                    console.log(object)
                } else {
                    gameField.addEventListener('pointerdown', onPointerdown)
                    console.log(wordCells)
                    wordCells.forEach(item => {
                        cells[item - 1].classList.remove('fillword_color')
                        cells[item - 1].innerHTML = ''
                    })
                }

            }

            function onMouseleave() {
                onMouseup()
                gameField.removeEventListener('pointerup', onMouseup)
                gameField.removeEventListener('pointerleave', onMouseleave)
            }
        }
    }

}
