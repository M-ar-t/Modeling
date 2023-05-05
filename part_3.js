let y_max = 15
let y_min = 5
let del_t = 1
let m_p = 0
let sigma = 1
let countMas = 100000
const pi = Math.PI;
let CountStep = 86400
var m = 35 //33...42
var studentTable = [
    [99.9, 99, 98, 95, 90, 80, 70, 60, 50, 40, 30, 20, 10],
    [0.126, 0.253, 0.385, 0.524, 0.674, 0.842, 1.036, 1.282, 1.645, 1.960, 2.330, 2.580, 3.290],
]

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
//console.log(K_y_tau);
const ctx1 = document.getElementById('myChart1').getContext('2d');
const myChart1 = new Chart(ctx1, {
    data: {
        labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [{
            type: 'line',
            data: K_y_tau,
            label: 'K(τ)',
            pointRadius: 0,
            borderWidth: 0.7,
            borderColor: 'black',
            cubicInterpolationMode: 'monotone'
        }]
    },
    options: {
        scales: {
            x: {
                title: 'true',
            },
            y: {
                title: 'true',
            }
        }
    }
});

function MiddleSquares(x) {
    let mas = [];
    for (let index = 0; index < countMas; index++) {
        let n = Math.floor((String(x).length - 2) / 2) + 1;
        x = Math.floor((Math.pow(x, 2) * Math.pow(10, n) - Math.floor(Math.pow(x, 2) * Math.pow(10, n))) * Math.pow(10, 10)) / Math.pow(10, 10);
        mas[index] = x;
    }
    return mas
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

function NormalDisFind_y(mas_x1, mas_x2) {
    let mas_y = [];
    for (let index = 0; index < mas_x1.length; index++) {
        mas_y[index] = sigma * Math.cos(2 * pi * mas_x1[index]) * Math.sqrt(-2 * Math.log(mas_x2[index])) + m_p;
    }
    mas_y = mas_y.filter(el => el !== Infinity && el !== -Infinity)
    return mas_y
}

function RollingSum() {
    let C0 = 0.612
    let C1 = 1.533
    let C2 = 0.048
    let C3 = 0.227
    let M_y = (y_max - y_min) / 2
    let y = []
    let congruent = Congruent()
    let MiddleSqr = MiddleSquares(0.1235)
    let q = NormalDisFind_y(congruent, MiddleSqr)
    for (let index = 0; index < CountStep; index++) {
        y[index] = C0 * q[index] + C1 * q[index + 1] + C2 * q[index + 2] + C3 * q[index + 3] + M_y
    }
    return y
}
 RollingSum()
function combinationXY() {
    let mas = RollingSum()
    let y = []
    let x = []
    for (let index = 0; index < mas.length; index++) {
        if (index % 2 == 0) {
            x.push(mas[index])
        } else {
            y.push(mas[index])
        }
    }
    // console.log('mas',mas);
    // console.log('x',x);
    // console.log('y',y);
    return [x, y]
}
let [x_mas, y_mas] = combinationXY()

function Gistogramma(mas_y) {
    let y = [];
    let N = [];
    let h = [];
    let P = [];
    let Max_y = (Math.max(...mas_y));
    let Min_y = (Math.min(...mas_y));
    let step = (Max_y - Min_y) / m;
    for (let index = 1; index <= m; index++) {
        y[0] = (Min_y);
        y[index] = y[index - 1] + step;
    }
    for (let index = 0; index < m; index++) {
        N[index] = mas_y.filter(el => el < y[index + 1] && el > y[index]).length;
        P[index] = N[index] / mas_y.length;
    }

    for (let index = 0; index < m; index++) {
        h[index] = P[index] / (y[index + 1] - y[index])
    }
    return [y, h, P]
}
let [x_y, x_h, x_P] = Gistogramma(x_mas);
let [y_y, y_h, y_P] = Gistogramma(y_mas);
const ctx2 = document.getElementById('myChart2').getContext('2d');
const myChart2 = new Chart(ctx2, {
    data: {
        labels: x_y,
        datasets: [{
            type: 'bar',
            barPercentage: 1,
            categoryPercentage: 1,
            label: 'h_i',
            data: x_h,
            borderColor: 'black',
            borderWidth: 0.3
        }, ]
    },
    options: {
        scales: {
            x: {
                display: true,
                ticks: {
                    display: false
                }
            },

        }
    }
});
const ctx3 = document.getElementById('myChart3').getContext('2d');
const myChart3 = new Chart(ctx3, {
    data: {
        labels: y_y,
        datasets: [{
            type: 'bar',
            barPercentage: 1,
            categoryPercentage: 1,
            label: 'h_i',
            data: y_h,
            borderColor: 'black',
            borderWidth: 0.3
        }, ]
    },
    options: {
        scales: {
            x: {
                display: true,
                ticks: {
                    display: false
                }
            },

        }
    }
});

function F_ст_xk(P) {
    sum_P = [];
    sum_P[0] = 0;
    for (let index = 1; index < P.length; index++) {
        sum_P[index] = sum_P[index - 1] + P[index - 1];
    }
    return sum_P
}
let F_ст_xkPx = F_ст_xk(x_P)
let F_ст_xkPy = F_ст_xk(y_P)
const ctx4 = document.getElementById('myChart4').getContext('2d');
const myChart4 = new Chart(ctx4, {
    data: {
        labels: x_y,
        datasets: [{
            type: 'bar',
            barPercentage: 1,
            categoryPercentage: 1,
            label: 'h_i',
            data: F_ст_xkPx,
            borderColor: 'black',
            borderWidth: 0.3
        }, ]
    },
    options: {
        scales: {
            x: {
                display: true,
                ticks: {
                    display: false
                }
            },

        }
    }
});
const ctx5 = document.getElementById('myChart5').getContext('2d');
const myChart5 = new Chart(ctx5, {
    data: {
        labels: y_y,
        datasets: [{
            type: 'bar',
            barPercentage: 1,
            categoryPercentage: 1,
            label: 'h_i',
            data: F_ст_xkPy,
            borderColor: 'black',
            borderWidth: 0.3
        }, ]
    },
    options: {
        scales: {
            x: {
                display: true,
                ticks: {
                    display: false
                }
            },

        }
    }
});

function Smirnov(F_ст_xkPx, F_ст_xkPy) {
    let p = 0.7
    let D_mas = [];
    for (let index = 0; index < F_ст_xkPx.length; index++) {
        D_mas[index] = Math.abs(F_ст_xkPx[index] - F_ст_xkPy[index])
    }
    let D = Math.max(...D_mas)
    console.log('D = ', D);
    let N_x = x_mas.length;
    let N_y = y_mas.length;
    for (index = 0.999; index > 0.001; index = index - 0.001) {
       //console.log('log = ',Math.pow(1/2 * Math.abs( Math.log(1 - index) * (1 / N_x + 1 / N_y)*100),1/2));
        if (D <= Math.sqrt(Math.abs( 1/2 * Math.log(1 - index) * (1 / N_x + 1 / N_y)))) {
            p = index
            console.log('Статистическая гипотеза верна с вероятностью не менее, чем p =', p)
            break
        }
    }

    return p
}
//console.log(smirnov);

function Student() {
    let sum1 = 0
    let sum2 = 0
    let sum3 = 0
    let sum4 = 0
    let N_x = x_mas.length;
    let N_y = y_mas.length;
    for (let index = 1; index < N_x - 1; index++) {
        sum1 = sum1 + x_mas[index]
    }
    for (let index = 1; index < N_y - 1; index++) {
        sum2 = sum2 + y_mas[index]
    }
    let m_x = 1 / N_x * sum1
    let m_y = 1 / N_y * sum2
    for (let index = 1; index < N_x; index++) {
        sum3 = sum3 + Math.pow(x_mas[index] - m_x, 2) / (N_x - 1)
    }
    for (let index = 1; index < N_y; index++) {
        sum4 = sum4 + Math.pow(y_mas[index] - m_y, 2) / (N_y - 1)
    }
    let D_x = sum3
    let D_y = sum4
    let D = ((N_x - 1) * D_x + (N_y - 1) * D_y) / (N_x + N_y - 2)
    let t_bet_p = Math.sqrt(Math.pow(m_x - m_y, 2) * N_x * N_y / (D * (N_x + N_y)))
    let index_el;
    for (let index = 0; index < studentTable[1].length - 1; index++) {
        if (t_bet_p < studentTable[1][index]) {
            index_el = index
            break
        }
    }
    let p = studentTable[0][index_el]
    console.log('t_bet_p', t_bet_p);
    console.log('p', p);
    return p
}
//Student()

function Fisher() {
    let sum1 = 0
    let sum2 = 0
    let sum3 = 0
    let sum4 = 0
    let N_x = x_mas.length;
    let N_y = y_mas.length;
    for (let index = 1; index < N_x - 1; index++) {
        sum1 = sum1 + x_mas[index]
    }
    for (let index = 1; index < N_y - 1; index++) {
        sum2 = sum2 + y_mas[index]
    }
    let m_x = 1 / N_x * sum1
    let m_y = 1 / N_y * sum2
    for (let index = 1; index < N_x; index++) {
        sum3 = sum3 + Math.pow(x_mas[index] - m_x, 2) / (N_x - 1)
    }
    for (let index = 1; index < N_y; index++) {
        sum4 = sum4 + Math.pow(y_mas[index] - m_y, 2) / (N_y - 1)
    }
    let D_x = sum3
    let D_y = sum4
    let F
    if (D_y >= D_x) {
        F = D_y / D_x
    } else {
        F = D_x / D_y
    }
    let alpha = 0.05
    let p = 1-alpha
//console.log(F);
return p
}
let smirnov = Smirnov(F_ст_xkPx, F_ст_xkPy)*100
let student = Student()
let fisher = Fisher()*100

document.getElementById("metod1").innerHTML = smirnov;
document.getElementById("metod2").innerHTML = student;
document.getElementById("metod3").innerHTML = fisher;
