const fs = require('fs');
const path = require('path');

function generateDistanceMatrix(n) {
    const mat = [];
    for (let i = 0; i < n; i++) {
        mat[i] = [];
        for (let j = 0; j < n; j++) {
            mat[i][j] = i === j ? 0 : Math.floor(Math.random() * 100) + 1;
        }
    }
    return mat;
}

// Create ~3000 matrices to compare lengths of Help-Karp vs Local-Search. 3000 is very likely overkill, I just would rather be safe
const nMax = 25000;
const matrixDir = 'distance_bank';

if (!fs.existsSync(matrixDir)) fs.mkdirSync(matrixDir);

let n = 2;
while (n <= nMax) {
    const mat = generateDistanceMatrix(n);
    const fname = path.join(matrixDir, `n${n}.json`);
    fs.writeFileSync(fname, JSON.stringify(mat));
    if (n % 500 === 0) console.log(`Saved matrix for n=${n}`);

    if (n < 50) {
        n += 1;
    } else if (n < 100) {
        n += 3;
    } else if (n < 500) {
        n += 5;
    } else if (n < 1000) {
        n += 10;
    } else if (n < 3000) {
        n += 25;
    } else if (n < 6000) {
        n += 50;
    } else {
        n += 100;
    }
}

console.log("Done - all matrices generated.");
