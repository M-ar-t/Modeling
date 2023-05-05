var VArr = []
var createVarr = function fVArr(value, free) {
    var Arr = {}
    Arr.value = value
    Arr.free = free
    return Arr
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
let but = document.getElementById("button_id")
but.addEventListener('click', function () {
    var VTask
    var TaskIntervalJob
    var speed
    var t1 = [1, 2, 3, 2, 5, 1, 7, 8, 2, 1, 1, 2, 3, 4, 5, 6, 1, 8, 2, 10]
    var Vp = [10, 12, 15, 17, 20, 25, 30, 36, 45, 48, 52, 55, 62, 67, 70, 77, 80, 85, 92, 99]
    var Vs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    var TaskIntervalExecuter = 1
    const WorkingTime = 8640
    var id //подсчет порядкового номера задач, поступивших на выполнение
    var TaskArr = [] //массив поступивших задач
    var ArrTaskInProc = [] //массив задач, находящихся в процессе обработки
    var counter_AddTask //переменная для отслеживания интервала между вызовами функции
    var counter_TaskExecuter //переменная для отслеживания интервала между вызовами функции
    var TaskСompleted //переменная для хранения задачи, для которой время обработки вышло
    var index //инициализация переменной времени моделирования
    var idDoneTask
    var i = 0;

    function CreateTask() {
        this.id = id;
        this.value = VTask;
    }

    function TaskInProc(minSeg, task) {
        this.Seg = minSeg;
        this.task = task.id;
        this.time = Math.ceil(VTask / speed) + 1

    }
    var Obj = []

    function NewObj(VTask, TaskIntervalJob, speed) {
        this.VTask = VTask,
            this.TaskIntervalJob = TaskIntervalJob,
            this.speed = speed
    }

    let tbody = document.createElement('tbody');
    let old_tbody = document.getElementById('tbody')
    old_tbody.parentNode.replaceChild(tbody, old_tbody)
    tbody.id = 'tbody';

    for (let num = 0; num < Vp.length; num++) {
        VTask = Vp[num]
        TaskIntervalJob = t1[num]
        speed = Vs[num]
        Obj[num] = (new NewObj(Vp[num], t1[num], Vs[num]));
        if (VArr.length == 0 || VTask == undefined || TaskIntervalJob == undefined || speed == undefined) {
            alert('Введите данные!')
            return
        }

        //основная функция начала работы системы
        function startWork() {
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

            while (index !== WorkingTime) {
                // if ((VArr.find(el => el.value > VTask)) == undefined) {
                //     alert('Нет сегментов для обработки задач такого объема')
                //     break
                // }
                AddTask();
                TaskExecuter();

                if (ArrTaskInProc !== undefined && ArrTaskInProc.length > 0) {
                    ArrTaskInProc.map(el => {
                        el.time--
                    })
                    CheckClean(ArrTaskInProc);
                }
                index++;
            }
        };


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
        startWork();
        Obj[num].productivity = Math.round((idDoneTask / (TaskArr.length + idDoneTask)) * 100)
        Obj[num].memory_usage = Math.floor(VArr.filter(el => el.value > VTask).length / VArr.length * 100) / 100
        Obj[num].task_length = TaskArr.length


        let tr = document.createElement("tr");
        let numexp = 1 + num
        tr.innerHTML = '<td>' + numexp + '</td><td>' + Obj[num].VTask + '</td> <td>' + Obj[num].TaskIntervalJob + '</td> <td>' + Obj[num].speed + '</td> <td>' + Obj[num].productivity + ' </td> <td>' + Obj[num].memory_usage + '</td><td>' + Obj[num].task_length + '</td>';
        tbody.append(tr);
    }
    let table1 = document.getElementById('table1')
    table1.classList.add('open');

    function ParetoOpt() {

        for (let num = 0; num < Obj.length; num++) {
            for (let num1 = 0; num1 < Obj.length; num1++) {
                if (Obj[num] !== null && Obj[num1] !== null && num !== num1 && Obj[num].productivity <= Obj[num1].productivity && Obj[num].memory_usage <= Obj[num1].memory_usage && Obj[num].task_length >= Obj[num1].task_length) {
                    if (!(Obj[num].productivity == Obj[num1].productivity == Obj[num].memory_usage == Obj[num1].memory_usage && Obj[num].task_length >= Obj[num1].task_length)) {
                        Obj[num] = null
                        break
                    }
                } else if (Obj[num] !== null && Obj[num1] !== null && num !== num1 && Obj[num].productivity >= Obj[num1].productivity && Obj[num].memory_usage >= Obj[num1].memory_usage && Obj[num].task_length <= Obj[num1].task_length) {
                    if (!(Obj[num].productivity == Obj[num1].productivity == Obj[num].memory_usage == Obj[num1].memory_usage && Obj[num].task_length >= Obj[num1].task_length)) {
                        Obj[num1] = null
                        break
                    }
                }
            }
        }
    }
    ParetoOpt()
    let ObjFilter = Obj.filter(el => el !== null)

    let compromis = document.createElement("div");
    compromis.id = 'compromis'

    if (document.getElementById('tablecompr') !== null) {
        document.getElementById('tablecompr').remove()
    }
    compromis.innerHTML = '<table class="table table-bordered tableContent" id="tablecompr"><thead> <tr><th colspan="7">Таблица компромисных решений</th></tr><tr><th rowspan="2">Номер эксперимента</th> <th colspan="3">Значения варьируемых параметров</th><th colspan="3">Значения показателей качества модели</th> </tr><tr><th>V<sub>p</sub></th><th>t<sub>1</sub></th><th>V<sub>s</sub></th><th>Производительность</th><th>Коэф. использования памяти</th><th>Длина очереди задач</th></tr> </thead> <tbody id="tbody_compr"></tbody>'
    div_N.parentNode.insertBefore(compromis, div_N.nextSibling);

    let tbody_compr = document.getElementById('tbody_compr');

    for (let num = 0; num < ObjFilter.length; num++) {
        let tr = document.createElement("tr");
        let numexp = num + 1
        tr.innerHTML = '<td>' + numexp + '</td><td>' + ObjFilter[num].VTask + '</td> <td>' + ObjFilter[num].TaskIntervalJob + '</td> <td>' + ObjFilter[num].speed + '</td> <td>' + ObjFilter[num].productivity + ' </td> <td>' + ObjFilter[num].memory_usage + '</td><td>' + ObjFilter[num].task_length + '</td>';
        tbody_compr.append(tr);
    }

})