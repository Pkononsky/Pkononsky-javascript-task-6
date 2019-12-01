'use strict';

/**
 * Сделано задание на звездочку.
 * Реализована остановка промиса по таймауту.
 */
const isStar = true;

function getTimeoutPromise(timeout) {
    return new Promise((_, reject) => {
        setTimeout(reject, timeout, new Error('timeout'));
    });
}

function performNextJob(jobs, currentIndex, timeout, addJobResults) {
    Promise.race([jobs[currentIndex](), getTimeoutPromise(timeout)])
        .then((res) => addJobResults(res, currentIndex))
        .catch((res) => addJobResults(res, currentIndex));
}

/**
 * Функция паралелльно запускает указанное число промисов
 *
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum, timeout = 1000) {
    return new Promise((resolve) => {
        if (jobs.length === 0 || parallelNum === 0) {
            resolve([]);
        }
        let currentIndex = -1;
        let jobResults = {};

        while (currentIndex < jobs.length - 1 && parallelNum-- > 0) {
            performNextJob(jobs, ++currentIndex, timeout, addJobResults);
        }

        function addJobResults(result, index) {
            jobResults[index] = result;
            let values = Object.values(jobResults);
            if (values.length === jobs.length) {
                resolve(values);
            } else if (currentIndex < jobs.length - 1) {
                performNextJob(jobs, ++currentIndex, timeout, addJobResults);
            }
        }
    });
}

module.exports = {
    runParallel,
    isStar
};
