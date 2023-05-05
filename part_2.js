var i = 0;
const lambda = 0.2;
const m_p = 40;
const sigma = 10;
const pi = Math.PI;
var m = 35 //33...42
var countMas = m * 1000;
var pirsonTable = [
    [0.99, 0.98, 0.95, 0.9, 0.8, 0.7, 0.5, 0.3, 0.2, 0.1, 0.05, 0.02, 0.01],
    [14.9535, 16.7908, 18.4927, 20.5992, 23.3641, 25.5078, 29.336, 33.5302, 36.2502, 40.256, 43.773, 46.9792, 50.8922],
    [15.6555, 17.5387, 19.2806, 21.4336, 24.2551, 26.4397, 30.3359, 34.5981, 37.3591, 41.4217, 44.9853, 48.2319, 52.1914],
    [16.3622, 18.2908, 20.0719, 22.2706, 25.1478, 27.3728, 31.3359, 35.6649, 38.4663, 42.5847, 46.1943, 49.4804, 53.4858],
    [17.0735, 19.0467, 20.8665, 23.1102, 26.0422, 28.3069, 32.3358, 36.7307, 39.5718, 43.7452, 47.3999, 50.7251, 54.7755],
    [17.7891, 19.8063, 21.6643, 23.9523, 26.9383, 29.2421, 33.3357, 37.7954, 40.6756, 44.9032, 48.6024, 51.966, 56.0609],
    [18.5089, 20.5694, 22.465, 24.7967, 27.8359, 30.1782, 34.3356, 38.8591, 41.778, 46.0588, 49.8018, 53.2033, 57.3421],
    [19.2327, 21.3359, 23.2686, 25.6433, 28.735, 31.1152, 35.3356, 39.922, 42.8788, 47.2122, 50.9985, 54.4373, 58.6192],
    [19.9602, 22.1056, 24.0749, 26.4921, 29.6355, 32.0532, 36.3355, 40.9839, 43.9782, 48.3634, 52.1923, 55.668, 59.8925],
    [20.6914, 22.8785, 24.8839, 27.343, 30.5373, 32.9919, 37.3355, 42.0451, 45.0763, 49.5126, 53.3835, 56.8955, 61.1621],
    [21.4262, 23.6543, 25.6954, 28.1958, 31.4405, 33.9315, 38.3354, 43.1053, 46.173, 50.6598, 54.5722, 58.1201, 62.4281],
    [22.1643, 24.433, 26.5093, 29.0505, 32.345, 34.8719, 39.3353, 44.1649, 47.2685, 51.8051, 55.7585, 59.3417, 63.6907]
]

function MiddleSquares(x) {
    let mas = [];
    for (let index = 0; index < countMas; index++) {
        let n = Math.floor((String(x).length - 2) / 2) + 1;
        x = Math.floor((Math.pow(x, 2) * Math.pow(10, n) - Math.floor(Math.pow(x, 2) * Math.pow(10, n))) * Math.pow(10, 10)) / Math.pow(10, 10);
        mas[index] = x;
    }
    return mas
}

function IterNum(ch) {
    let mas = [];
    let x;
    for (let index = 0; index < countMas; index++) {
        x = Math.floor((ch * i - Math.floor(ch * i)) * Math.pow(10, 10)) / Math.pow(10, 10);
        i++;
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

function InInterval(a, b, masIn) {
    return (masIn.map(el => (a + (b - a) * el)))
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

function IndDisFind_f_y(y) {
    let f_y = [];
    for (let index = 0; index < y.length; index++) {
        f_y[index] = lambda * Math.exp(-lambda * y[index]);
    }
    return f_y;
}

function NormalDisFind_f_y(y) {
    let f_y = [];
    for (let index = 0; index < y.length; index++) {
        f_y[index] = (1 / (sigma * Math.sqrt(2 * pi))) * Math.exp(-(Math.pow(y[index] - m_p, 2)) / (2 * Math.pow(sigma, 2)));
    }
    return f_y;
}

//let middleSquares_x1_Interval = InInterval(5, 15, middleSquares_x1);
//console.log('mas_out= ', middleSquares_x1_Interval);

let middleSquares_x1 = MiddleSquares(0.1297);
let middleSquares_x2 = MiddleSquares(0.577651);
let iterNum_x1 = IterNum(0.7841);
let iterNum_x2 = IterNum(0.3439);
let congruent_x1 = Congruent();
let congruent_x2 = Congruent();

let MidSqrIndDis_y1 = IndDisFind_y(middleSquares_x1);
let [y1, h1, P1] = Gistogramma(MidSqrIndDis_y1);
let MidSqrNormDis_y1 = NormalDisFind_y(middleSquares_x1, middleSquares_x2);
let [y2, h2, P2] = Gistogramma(MidSqrNormDis_y1);

let IterNumIndDis_y1 = IndDisFind_y(iterNum_x1);
let [y3, h3, P3] = Gistogramma(IterNumIndDis_y1);
let IterNumNormDis_y1 = NormalDisFind_y(iterNum_x1, iterNum_x2);
let [y4, h4, P4] = Gistogramma(IterNumNormDis_y1);

let CongruentIndDis_y1 = IndDisFind_y(congruent_x1);
let [y5, h5, P5] = Gistogramma(CongruentIndDis_y1);
let CongruentNormDis_y1 = NormalDisFind_y(congruent_x1, congruent_x2);
let [y6, h6, P6] = Gistogramma(CongruentNormDis_y1);

let f_x1 = IndDisFind_f_y(y1);
let f_x2 = NormalDisFind_f_y(y2);
let f_x3 = IndDisFind_f_y(y3);
let f_x4 = NormalDisFind_f_y(y4);
let f_x5 = IndDisFind_f_y(y5);
let f_x6 = NormalDisFind_f_y(y6);

const ctx1 = document.getElementById('myChart1').getContext('2d');
const myChart1 = new Chart(ctx1, {
    data: {
        labels: y1,
        datasets: [{
                type: 'bar',
                barPercentage: 1,
                categoryPercentage: 1,
                label: 'h_i',
                data: h1,
                borderColor: 'black',
                borderWidth: 0.3
            },
            {
                type: 'line',
                data: f_x1,
                label: 'f(x)',
                pointRadius: 0,
                borderWidth: 0.7,
                borderColor: 'red',
                cubicInterpolationMode: 'monotone'
            }
        ]
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
const ctx2 = document.getElementById('myChart2').getContext('2d');
const myChart2 = new Chart(ctx2, {
    data: {
        labels: y2,
        datasets: [{
                type: 'bar',
                barPercentage: 1,
                categoryPercentage: 1,
                label: 'h_i',
                data: h2,
                borderColor: [
                    'black'
                ],
                borderWidth: 0.3
            },
            {
                type: 'line',
                data: f_x2,
                label: 'f(x)',
                pointRadius: 0,
                borderWidth: 0.7,
                borderColor: 'red',
                cubicInterpolationMode: 'monotone'
            }
        ]
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
    type: 'bar',
    data: {
        labels: y3,
        datasets: [{
                type: 'bar',
                barPercentage: 1,
                categoryPercentage: 1,
                label: 'h_i',
                data: h3,
                borderColor: 'black',
                borderWidth: 0.3
            },
            {
                type: 'line',
                data: f_x3,
                label: 'f(x)',
                pointRadius: 0,
                borderWidth: 0.7,
                borderColor: 'red',
                cubicInterpolationMode: 'monotone'
            }
        ]
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
const ctx4 = document.getElementById('myChart4').getContext('2d');
const myChart4 = new Chart(ctx4, {
    data: {
        labels: y4,
        datasets: [{
                type: 'bar',
                barPercentage: 1,
                categoryPercentage: 1,
                label: 'h_i',
                data: h4,
                borderColor: 'black',
                borderWidth: 0.3
            },
            {
                type: 'line',
                data: f_x4,
                label: 'f(x)',
                pointRadius: 0,
                borderWidth: 0.7,
                borderColor: 'red',
                cubicInterpolationMode: 'monotone'
            }
        ]
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
        labels: y5,
        datasets: [{
                type: 'bar',
                barPercentage: 1,
                categoryPercentage: 1,
                label: 'h_i',
                data: h5,
                borderColor: 'black',
                borderWidth: 0.3
            },
            {
                type: 'line',
                data: f_x5,
                label: 'f(x)',
                pointRadius: 0,
                borderWidth: 0.7,
                borderColor: 'red',
                cubicInterpolationMode: 'monotone'
            }
        ]
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
const ctx6 = document.getElementById('myChart6').getContext('2d');
const myChart6 = new Chart(ctx6, {
    data: {
        labels: y6,
        datasets: [{
                type: 'bar',
                barPercentage: 1,
                categoryPercentage: 1,
                label: 'h_i',
                data: h6,
                borderColor: 'black',
                borderWidth: 0.3
            },
            {
                type: 'line',
                data: f_x6,
                label: 'f(x)',
                pointRadius: 0,
                borderWidth: 0.7,
                borderColor: 'red',
                cubicInterpolationMode: 'monotone'
            }
        ]
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
////////////////////////////////////////////////////////////////
function F_ст_xk(P) {
    sum_P = [];
    sum_P[0] = 0;
    for (let index = 1; index < P.length; index++) {
        sum_P[index] = sum_P[index - 1] + P[index - 1];
    }
    return sum_P
}

function IndDisF_x(mas_y) {
    f_y = [];
    for (let index = 0; index < mas_y.length - 1; index++) {
        f_y[index] = 1 - Math.exp(-lambda * mas_y[index]);
    }
    let betta = m - 2
    return [f_y, betta]
}

function NormalDisF_x(mas_y) {
    let f_y = [];
    for (let index = 0; index < mas_y.length; index++) {
        let erf_x = (mas_y[index] - m_p) / (sigma * Math.sqrt(2))
        let t = 1 / (1 + 0.5 * Math.abs(erf_x))
        tau = t * Math.exp(-Math.pow(erf_x, 2) - 1.26551223 + 1.00002368 * t + 0.37409196 * Math.pow(t, 2) + 0.09678418 * Math.pow(t, 3) - 0.18628806 * Math.pow(t, 4) + 0.27886807 * Math.pow(t, 5) - 1.13520398 * Math.pow(t, 6) + 1.48851587 * Math.pow(t, 7) - 0.82215223 * Math.pow(t, 8) + 0.17087277 * Math.pow(t, 9))
        if (erf_x >= 0) {
            erf = 1 - tau
        }
        if (erf_x < 0) {
            erf = tau - 1
        }
        f_y[index] = 1 / 2 * (1 + erf)
    }
    let betta = m - 3;
    return [f_y, betta]
}

function Kolgmogorov(F_ст_xk, F_x) {
    let D_mas = [];
    for (let index = 0; index < F_ст_xk.length; index++) {
        D_mas[index] = Math.abs(F_ст_xk[index] - F_x[index])
    }
    let D = Math.max(...D_mas)
    let l = D * Math.sqrt(countMas)
    let sum = 0
    for (let k = -1000000; k < 1000000; k++) {
        sum = sum + Math.pow(-1, k) * Math.exp(-2 * Math.pow(k, 2) * Math.pow(l, 2))
    }
    let p_l = 1 - sum
    return p_l
}


function Pirson(P_ст, F_x, betta) {
    let sum = 0;
    let P = [];
    for (let index = 0; index < F_x.length - 1; index++) {
        P[index] = F_x[index + 1] - F_x[index]
    }
    for (let index = 0; index < m - 1; index++) {
        sum = sum + Math.pow(P_ст[index] - P[index], 2) / P[index]
    }
    let pirson = countMas * sum

    for (let index = 0; index < pirsonTable[betta - 29].length - 1; index++) {
        if (pirson < pirsonTable[betta - 29][index]) {
            index_el = index
            break
        }
    }
    let tpirson = pirsonTable[betta - 29][index_el]
    let p_pirson = pirsonTable[0][index_el]
    return p_pirson
}

function CorrelationMoment(mas_y) {
    let p = 0.7
    let tau = 100
    let sum = []
    for (let index = 1; index <= 5; index++) {
        sum[index] = 0
    }

    for (let index = 1; index < (countMas - tau); index++) {
        sum[1] = sum[1] + mas_y[index] * mas_y[index + tau];
    }
    for (let index = 1; index < (countMas - tau); index++) {
        sum[2] = sum[2] + mas_y[index];
    }
    for (let index = 1; index < (countMas - tau); index++) {
        sum[3] = sum[3] + mas_y[index + tau];
    }

    for (let index = 1; index < (countMas - tau); index++) {
        sum[4] = sum[4] + Math.pow(mas_y[index], 2);
    }
    for (let index = 1; index < (countMas - tau); index++) {
        sum[5] = sum[5] + Math.pow(mas_y[index + tau], 2);
    }
    let K_tau = 1 / (countMas - tau) * sum[1] - 1 / (Math.pow((countMas - tau), 2)) * sum[2] * sum[3]
    let D_x = 1 / (countMas - tau) * sum[4] - 1 / (Math.pow((countMas - tau), 2)) * Math.pow(sum[2], 2)
    let D_y = 1 / (countMas - tau) * sum[5] - 1 / (Math.pow((countMas - tau), 2)) * Math.pow(sum[3], 2)
    let p_tau = K_tau / (Math.sqrt(D_x * D_y))
    console.log('K_tau', K_tau)
    console.log('sqrt(D_x * D_y)', (Math.sqrt(D_x * D_y)))
    console.log('p_tau', p_tau)
    console.log('Эл', (1 - p) * Math.sqrt(1 / countMas))
    // console.log('p-эл', p_tau - ((1-p)*Math.sqrt(1/countMas)))
    for (index = 0.999; index > 0.000001; index = index - 0.000001) {
        if (Math.abs(p_tau) <= (1 - index) * Math.sqrt(1 / countMas)) {
            p = index
            console.log('Элементы последовательности независимы с вероятностью >=', p)
            break
        }
    }

    return p
}

let p1 = Math.round(CorrelationMoment(middleSquares_x1)*100)
let p2 = Math.round(CorrelationMoment(middleSquares_x2)*100)
let p3 = Math.round(CorrelationMoment(iterNum_x1)*100)
let p4 = Math.round(CorrelationMoment(iterNum_x2)*100)
let p5 = Math.round(CorrelationMoment(congruent_x1)*100)
let p6 = Math.round(CorrelationMoment(congruent_x2)*100)

let F_ст_xk_P1 = F_ст_xk(P1);
let F_ст_xk_P2 = F_ст_xk(P2);
let F_ст_xk_P3 = F_ст_xk(P3);
let F_ст_xk_P4 = F_ст_xk(P4);
let F_ст_xk_P5 = F_ст_xk(P5);
let F_ст_xk_P6 = F_ст_xk(P6);
let [IndDisF_x1, betta1] = IndDisF_x(y1);
let [NormalDisF_x2, betta2] = NormalDisF_x(y2);
let [IndDisF_x3, betta3] = IndDisF_x(y3);
let [NormalDisF_x4, betta4] = NormalDisF_x(y4);
let [IndDisF_x5, betta5] = IndDisF_x(y5);
let [NormalDisF_x6, betta6] = NormalDisF_x(y6);
let pirson1 = Math.round(Pirson(P1, IndDisF_x1, betta1)*100)
let pirson2 = Math.round(Pirson(P2, NormalDisF_x2, betta2)*100)
let pirson3 = Math.round(Pirson(P3, IndDisF_x3, betta3)*100)
let pirson4 = Math.round(Pirson(P4, NormalDisF_x4, betta4)*100)
let pirson5 = Math.round(Pirson(P5, IndDisF_x5, betta5)*100)
let pirson6 = Math.round(Pirson(P6, NormalDisF_x6, betta6)*100)

let p_lambda_1 = Math.round(Kolgmogorov(F_ст_xk_P1, IndDisF_x1)*100)
let p_lambda_2 = Math.round(Kolgmogorov(F_ст_xk_P2, NormalDisF_x2)*100)
let p_lambda_3 = Math.round(Kolgmogorov(F_ст_xk_P3, IndDisF_x3)*100)
let p_lambda_4 = Math.round(Kolgmogorov(F_ст_xk_P4, NormalDisF_x4)*100)
let p_lambda_5 = Math.round(Kolgmogorov(F_ст_xk_P5, IndDisF_x5)*100)
let p_lambda_6 = Math.round(Kolgmogorov(F_ст_xk_P6, NormalDisF_x6)*100)

document.getElementById("1_metod1").innerHTML = p_lambda_1;
document.getElementById("1_metod2").innerHTML = pirson1;
document.getElementById("1_metod3").innerHTML = p1;
document.getElementById("2_metod1").innerHTML = p_lambda_2;
document.getElementById("2_metod2").innerHTML = pirson2;
document.getElementById("2_metod3").innerHTML = p2;
document.getElementById("3_metod1").innerHTML = p_lambda_3;
document.getElementById("3_metod2").innerHTML = pirson3;
document.getElementById("3_metod3").innerHTML = p3;
document.getElementById("4_metod1").innerHTML = p_lambda_4;
document.getElementById("4_metod2").innerHTML = pirson4;
document.getElementById("4_metod3").innerHTML = p4;
document.getElementById("5_metod1").innerHTML = p_lambda_5;
document.getElementById("5_metod2").innerHTML = pirson5;
document.getElementById("5_metod3").innerHTML = p5;
document.getElementById("6_metod1").innerHTML = p_lambda_6;
document.getElementById("6_metod2").innerHTML = pirson6;
document.getElementById("6_metod3").innerHTML = p6;
const ctx7 = document.getElementById('myChart7').getContext('2d');
const myChart7 = new Chart(ctx7, {
    data: {
        labels: y1,
        datasets: [{
                type: 'bar',
                barPercentage: 1,
                categoryPercentage: 1,
                label: 'Fст(x_k)',
                data: F_ст_xk_P1,
                borderColor: 'black',
                borderWidth: 0.3,
                pointRadius: 0,
                borderWidth: 0.7,
                borderColor: 'black',
                // cubicInterpolationMode: 'monotone'
            },
            {
                type: 'line',
                data: IndDisF_x1,
                label: 'F(x)',
                pointRadius: 0,
                borderWidth: 0.7,
                borderColor: 'red',
                cubicInterpolationMode: 'monotone'
            }
        ]
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
const ctx8 = document.getElementById('myChart8').getContext('2d');
const myChart8 = new Chart(ctx8, {
    data: {
        labels: y2,
        datasets: [{
                type: 'bar',
                barPercentage: 1,
                categoryPercentage: 1,
                label: 'Fст(x_k)',
                data: F_ст_xk_P2,
                borderColor: 'black',
                borderWidth: 0.3,
                pointRadius: 0,
                borderWidth: 0.7,
                borderColor: 'black',
                // cubicInterpolationMode: 'monotone'
            },
            {
                type: 'line',
                data: NormalDisF_x2,
                label: 'F(x)',
                pointRadius: 0,
                borderWidth: 0.7,
                borderColor: 'red',
                cubicInterpolationMode: 'monotone'
            }
        ]
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
const ctx9 = document.getElementById('myChart9').getContext('2d');
const myChart9 = new Chart(ctx9, {
    data: {
        labels: y3,
        datasets: [{
                type: 'bar',
                barPercentage: 1,
                categoryPercentage: 1,
                label: 'Fст(x_k)',
                data: F_ст_xk_P3,
                borderColor: 'black',
                borderWidth: 0.3,
                pointRadius: 0,
                borderWidth: 0.7,
                borderColor: 'black',
                // cubicInterpolationMode: 'monotone'
            },
            {
                type: 'line',
                data: IndDisF_x3,
                label: 'F(x)',
                pointRadius: 0,
                borderWidth: 0.7,
                borderColor: 'red',
                cubicInterpolationMode: 'monotone'
            }
        ]
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
const ctx10 = document.getElementById('myChart10').getContext('2d');
const myChart10 = new Chart(ctx10, {
    data: {
        labels: y4,
        datasets: [{
                type: 'bar',
                barPercentage: 1,
                categoryPercentage: 1,
                label: 'Fст(x_k)',
                data: F_ст_xk_P4,
                borderColor: 'black',
                borderWidth: 0.3,
                pointRadius: 0,
                borderWidth: 0.7,
                borderColor: 'black',
                // cubicInterpolationMode: 'monotone'
            },
            {
                type: 'line',
                data: NormalDisF_x4,
                label: 'F(x)',
                pointRadius: 0,
                borderWidth: 0.7,
                borderColor: 'red',
                cubicInterpolationMode: 'monotone'
            }
        ]
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
const ctx11 = document.getElementById('myChart11').getContext('2d');
const myChart11 = new Chart(ctx11, {
    data: {
        labels: y5,
        datasets: [{
                type: 'bar',
                barPercentage: 1,
                categoryPercentage: 1,
                label: 'Fст(x_k)',
                data: F_ст_xk_P5,
                borderColor: 'black',
                borderWidth: 0.3,
                pointRadius: 0,
                borderWidth: 0.7,
                borderColor: 'black',
                // cubicInterpolationMode: 'monotone'
            },
            {
                type: 'line',
                data: IndDisF_x5,
                label: 'F(x)',
                pointRadius: 0,
                borderWidth: 0.7,
                borderColor: 'red',
                cubicInterpolationMode: 'monotone'
            }
        ]
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
const ctx12 = document.getElementById('myChart12').getContext('2d');
const myChart12 = new Chart(ctx12, {
    data: {
        labels: y6,
        datasets: [{
                type: 'bar',
                barPercentage: 1,
                categoryPercentage: 1,
                label: 'Fст(x_k)',
                data: F_ст_xk_P6,
                borderColor: 'black',
                borderWidth: 0.3,
                pointRadius: 0,
                borderWidth: 0.7,
                borderColor: 'black',
                // cubicInterpolationMode: 'monotone'
            },
            {
                type: 'line',
                data: NormalDisF_x6,
                label: 'F(x)',
                pointRadius: 0,
                borderWidth: 0.7,
                borderColor: 'red',
                cubicInterpolationMode: 'monotone'
            }
        ]
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
