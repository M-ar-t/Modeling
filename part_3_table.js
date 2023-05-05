var VTask; //объем памяти задач Vp
var TaskIntervalJob //интервал между подачей задач t1 = 5 с 
var TaskIntervalExecuter = 1 //интервал между обработкой задач 2 c
const WorkingTime = 8640 //время моделирования 86400 с = 1 сутки
var speed //скорость обслуживания задачи 10 байт/с;

var TimeFillTable //время заполнения таблицы 
var id //подсчет порядкового номера задач, поступивших на выполнение
var TaskArr = [] //массив поступивших задач
var ArrTaskInProc = [] //массив задач, находящихся в процессе обработки
var RowId //подсчет порядкового номера строки
var counter_AddTask //переменная для отслеживания интервала между вызовами функции
var counter_TaskExecuter //переменная для отслеживания интервала между вызовами функции
var counter_AddRow
var TaskСompleted //переменная для хранения задачи, для которой время обработки вышло
var index //инициализация переменной времени моделирования
var idDoneTask
//структура массива ОЗУ (свойства: значение сегмента, свободен/занят(по умолчанию свободны))
var VArr = []
var createVarr = function fVArr(value, free) {
    var Arr = {}
    Arr.value = value
    Arr.free = free
    return Arr
}
var i = 0;
const lambda = 0.2;
const m_p = 40;
const sigma = 10;
const pi = Math.PI;
var m = 35 //33...42
let y_max = 20
let y_min = 59
let del_t = 1
let mp1 = 0
let sigma1 = 1
let countMas = 100000
let CountStep = 86400

function FindK_tau() {
    let a = Math.pow(((y_max - y_min) / 6), 2)
    let b = -Math.log(0.05) / (3 * del_t)
    let K_y_tau = []
    for (let tau = 0; tau <= 10; tau++) {
        K_y_tau[tau] = a * Math.exp(-b * tau)
    }
    return K_y_tau
}

let K_y_tau = FindK_tau()


function MiddleSquares(x) {
    let mas = [];
    for (let index = 0; index < countMas; index++) {
        let n = Math.floor((String(x).length - 2) / 2) + 1;
        x = Math.floor((Math.pow(x, 2) * Math.pow(10, n) - Math.floor(Math.pow(x, 2) * Math.pow(10, n))) * Math.pow(10, 10)) / Math.pow(10, 10);
        mas[index] = x;
    }
    return mas
}

function NormalDisFind_y1(mas_x1, mas_x2) {
    let mas_y = [];
    for (let index = 0; index < mas_x1.length; index++) {
        mas_y[index] = sigma1 * Math.cos(2 * pi * mas_x1[index]) * Math.sqrt(-2 * Math.log(mas_x2[index])) + mp1;
    }
    mas_y = mas_y.filter(el => el !== Infinity && el !== -Infinity)
    return mas_y
}

function Congruent() {
    let mas = [];
    let x;
    for (let index = 0; index < countMas; index++) {
        x = Math.floor(Math.random() * Math.pow(10, 10)) / Math.pow(10, 10);
        mas[index] = x;
    }
    return mas
}

function RollingSum() {
    let C0 = 0.612
    let C1 = 1.533
    let C2 = 0.048
    let C3 = 0.227
    let M_y = (y_max + y_min) / 2
    let y = []
    let congruent = Congruent()
    let MiddleSqr = MiddleSquares(0.985)
    let q = NormalDisFind_y1(congruent, MiddleSqr)
    for (let index = 0; index < CountStep; index++) {
        y[index] = C0 * q[index] + C1 * q[index + 1] + C2 * q[index + 2] + C3 * q[index + 3] + M_y
    }
    return y
}
let mas_rollsum0 = RollingSum()
let mas_rollsum = mas_rollsum0.map(el => Math.round(el))

function InInterval(a, b, masIn) {
    let mas = (masIn.map(el => (a + (b - a) * el)))
    return (mas.map(el => Math.round(el)))
}

function IndDisFind_y(mas_x) {
    let mas_y = [];
    for (let index = 0; index < mas_x.length; index++) {
        mas_y[index] = -Math.log(1 - mas_x[index]) / lambda;
    }
    return mas_y
}

function NormalDisFind_y(mas_x1, mas_x2) {
    let mas_y = [];
    for (let index = 0; index < mas_x1.length; index++) {
        mas_y[index] = sigma * Math.cos(2 * pi * mas_x1[index]) * Math.sqrt(-2 * Math.log(mas_x2[index])) + m_p;
    }
    mas_y = mas_y.filter(el => el !== Infinity && el !== -Infinity)
    return mas_y
}
let congruent_x1 = Congruent();
let congruent_x2 = Congruent();
let InInterval_t = InInterval(1, 10, congruent_x1)
let InInterval_V = InInterval(10, 100, congruent_x2)

function CreateTask() {
    this.id = id;
    this.value = VTask;
}

function TaskInProc(minSeg, task) {
    this.Seg = minSeg;
    this.task = task.id;
    this.time = Math.ceil(VTask / speed) + 1

}
let sel = document.getElementById("selectID")
let inp = document.getElementById("input_id")
document.addEventListener("DOMContentLoaded", inp.focus());
inp.addEventListener('keydown', function (e) {
    if (e.code == "Enter") {
        if (sel.value == 'NSeg' && inp.value !== '') {
            VArr.length = 0
            let div_N = document.getElementById('div_N');
            let new_div_N = document.createElement('div');
            div_N.parentNode.replaceChild(new_div_N, div_N)
            new_div_N.id = 'div_N';
            div_N = document.getElementById('div_N');
            div_N.classList.remove('close');
            let N_Seg = Number(inp.value)
            inp.value = ''
            inp.blur()


            let el = []

            function AddStr(index) {
                el[index] = document.createElement("p");
                el[index].innerHTML = '<span class = "span_N">Размер ' + (index) + ' сегмента </span> <input class = "inp_N" id = "el[' + index + ']">'
                div_N.append(el[index]);
            }
            for (let index = 1; index < N_Seg + 1; index++) {
                AddStr(index)
            }
            let inp_N = []
            for (let index = 1; index < N_Seg + 1; index++) {
                inp_N[index] = document.getElementById('el[' + index + ']');
            }

            inp_N[1].focus()
            for (let index = 1; index < N_Seg + 1; index++) {
                inp_N[index].addEventListener('keydown', function (e) {
                    if (e.code == "Enter" && inp_N[index].value !== '') {
                        VArr.push(createVarr(Number(inp_N[index].value), true))
                        if (index !== N_Seg) {
                            inp_N[index + 1].focus()
                        } else inp_N[index].blur()
                    }
                })
            }

        }

    }

});
//основная функция начала работы системы
function startWork() {
    TimeFillTable = 1 //время заполнения таблицы 
    id = 1 //подсчет порядкового номера задач, поступивших на выполнение
    TaskArr = [] //массив поступивших задач
    ArrTaskInProc = [] //массив задач, находящихся в процессе обработки
    RowId = 1 //подсчет порядкового номера строки
    counter_AddTask = 0 //переменная для отслеживания интервала между вызовами функции
    counter_TaskExecuter = 0 //переменная для отслеживания интервала между вызовами функции
    counter_AddRow = 0
    TaskСompleted //переменная для хранения задачи, для которой время обработки вышло
    index = 0 //инициализация переменной времени моделирования
    idDoneTask = 0
    VArr.map(el => el.free = true)
    let table = document.getElementById("table")
    table.classList.add('open');
    while (index !== WorkingTime) {
        if ((VArr.find(el => el.value > VTask)) == undefined) {
            alert('Нет сегментов для обработки задач такого объема')
            break
        }
        AddTask();
        TaskExecuter();

        if (ArrTaskInProc !== undefined && ArrTaskInProc.length > 0) {
            ArrTaskInProc.map(el => {
                el.time--
            })
            CheckClean(ArrTaskInProc);
        }
        if (index == counter_AddRow + TimeFillTable) {
            counter_AddRow = index
            AddRow()
        }
        index++;
    }
    let productivity = Math.round((idDoneTask / (TaskArr.length + idDoneTask)) * 100)
    let memory_usage = Math.floor(VArr.filter(el => el.value > VTask).length / VArr.length * 100) / 100
    let task_length = TaskArr.length 

    let button_itog = document.getElementById("button_itog_id")
    button_itog.style.visibility = 'visible'
    let form = document.querySelector('#div_itog');

    button_itog.addEventListener('click', function () {
        document.getElementById("productivity").innerHTML = productivity
        document.getElementById("memory_usage").innerHTML = memory_usage
        document.getElementById("task_length").innerHTML = task_length
        form.classList.add('open');
    })
};
let num = 0
let but = document.getElementById("button_id")
but.addEventListener('click', function () {
    console.log(VArr);
    num++
    speed = mas_rollsum[num]
    TaskIntervalJob = InInterval_t[num]
    VTask = InInterval_V[num]
    var value_V_t = document.createElement('div');
    let old_value_V_t = document.getElementById('div_add')
    if (old_value_V_t !== null) {
        value_V_t.innerHTML = '<p class = "p_add"><span class = "span_add">Объем задачи = ' + (VTask) + ' байт</span></p> <p class = "p_add">Интервал между подачей задач = ' + (TaskIntervalJob) + ' с</p><p class = "p_add">Скорость обслуживания задачи = ' + (speed) + ' байт/с</p>'
        old_value_V_t.parentNode.replaceChild(value_V_t, old_value_V_t)
        value_V_t.id = 'div_add'
    } else {
        value_V_t = document.createElement("div");
        value_V_t.id = 'div_add'
        value_V_t.innerHTML = '<p class = "p_add"><span class = "span_add">Объем задачи = ' + (VTask) + ' байт</span></p> <p class = "p_add">Интервал между подачей задач = ' + (TaskIntervalJob) + ' с</p><p class = "p_add">Скорость обслуживания задачи = ' + (speed) + ' байт/с</p>'
    }

    let start_work = document.getElementById("start_work")
    start_work.parentNode.insertBefore(value_V_t, start_work.nextSibling);
    if (VArr.length == 0 || VTask == undefined || TaskIntervalJob == undefined || speed == undefined) {
        alert('Введите данные!')
        return
    }
    var new_tbody = document.createElement('tbody');
    let tbody = document.getElementById('tbody')
    tbody.parentNode.replaceChild(new_tbody, tbody)
    new_tbody.id = 'tbody';
    sel.value = "VTask"
    let div_N = document.querySelector('#div_N');
    div_N.classList.add('close');
    startWork();

})

function TaskExecuter() {
    if (index == counter_TaskExecuter + TaskIntervalExecuter) {
        counter_TaskExecuter = index;
        //если в очереди нет задач 
        if (TaskArr.length == 0) {
            //       console.log("Новых задач не обнаружено!")
            return;
        }
        //если нет доступных сегментов
        let minSeg = MinSizeSegm();
        if (minSeg == -1) {
            //    console.log("Нет доступных сегментов!")
            return;
        }
        //иначе
        //   console.log("Доступен сегмент номер: " + minSeg + ' время = ' + index);
        VArr[minSeg].free = false;
        let task = TaskArr.shift();
        // console.log('Задача: ' + task.id + ' ушла на выполнение время = ' + index)
        ArrTaskInProc.push(new TaskInProc(minSeg, task));
        return ArrTaskInProc;
    }
    return ArrTaskInProc;
}

function AddTask() {
    let ind = counter_AddTask + TaskIntervalJob
    if (index == ind) {
        counter_AddTask = index;
        //   console.log('counter_AddTask = ', counter_AddTask);
        //      console.log('Задача поступила, время = ' + counter_AddTask)

        TaskArr.push(new CreateTask());
        //  console.log('Mas = ', TaskArr);
        //      console.log("Количество задач в очереди = " + TaskArr.length + ', время = ' + index)
        id++;
    }
}
//функция MinSizeSegm для нахождения свободного сегмента ОЗУ с наименьшим объемом >V=30 
function MinSizeSegm() {
    let filteredArr = VArr.filter(f => f.value > VTask && f.free); //находим в массиве сегментов свободный и >VTask
    let minValue = filteredArr.find(f => f.value == Math.min(...filteredArr.map(m => m.value)));
    return VArr.findIndex(fi => fi == minValue);
}

function CheckClean(ArrTaskInProc) {
    TaskСompleted = ArrTaskInProc.find(el => el.time == 0)
    if (TaskСompleted == undefined) return
    idDoneTask++
    // console.log('Задача ' + TaskСompleted.task + ' выполнена, время  = ' + index)
    ClearSeg(TaskСompleted)
}
//очистка сегмента после выполнения задачи
function ClearSeg(TaskСompleted) {
    VArr[TaskСompleted.Seg].free = true
    //  console.log("Очищаем сегмент памяти номер " + TaskСompleted.Seg)
}
// //==============================================

function AddRow() {
    let tbody = document.getElementById('tbody');
    let tr = document.createElement("tr");
    //получить текущее состояние:
    // время моделирования
    let TModel = TimeFillTable * RowId
    RowId++
    // кол-во задач в очереди
    let AmountTaskQueue = TaskArr.length
    // кол-во обработанных задач = task.id, т.е. id последней выполненной задачи
    let AmountTaskDone = idDoneTask
    // кол-во обрабатываемых задач 
    let AmountTaskInProcess = FAmountTaskInProcess()
    // Кол-во свободных сегментов
    let AmountFreeSeg = FAmountFreeSeg()
    tr.innerHTML = '<td>' + TModel + '</td> <td>' + AmountTaskQueue + '</td> <td>' + AmountTaskDone + '</td> <td>' + AmountTaskInProcess + ' </td> <td>' + AmountFreeSeg + '</td>';
    tbody.append(tr);
}
//функция заполняющая таблицу в каждую i-ю секунду
//количествот обрабатываемых задач в данныый момент
function FAmountTaskInProcess() {
    let AmountTaskInProcess = VArr.filter(el => el.free == false).length
    //  console.log('Количество обрабатываемых задач: ' + AmountTaskInProcess)
    return AmountTaskInProcess
}
//количество свободных сегментов
function FAmountFreeSeg() {
    let AmountFreeSeg = VArr.filter(el => (el.free == true) && (el.value > VTask)).length
    //console.log('Количество обрабатываемых задач: ' + AmountFreeSeg)
    return AmountFreeSeg
}