'use strict';

/**
 * Сделано задание на звездочку.
 * Реализована остановка промиса по таймауту.
 */
const isStar = true;

function getTimeoutPromise(timeout) {
    return new Promise((_, reject) => {
        setTimeout(reject, timeout, new Error('Promise timeout'));
    });
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
        if (!jobs.length) {
            resolve([]);
        }
        let currentIndex = 0;
        let jobResults = [];

        while (currentIndex < jobs.length && parallelNum-- > 0) {
            performNextJob(currentIndex++);
        }

        function resolveCheck() {
            if (jobResults.length === jobs.length) {
                resolve(jobResults);
            } else if (currentIndex < jobs.length) {
                performNextJob(currentIndex++);
            }
        }

        function performNextJob(index) {
            const addResultHelper = res => {
                jobResults[index] = res;
            };
            Promise.race([jobs[index](), getTimeoutPromise(timeout)])
                .then(addResultHelper)
                .catch(addResultHelper)
                .then(() => resolveCheck());
        }
    });
}

module.exports = {
    runParallel,
    isStar
};
