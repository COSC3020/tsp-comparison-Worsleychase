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
const nMax = 3000;
const matrixDir = 'distance_bank';

if (!fs.existsSync(matrixDir)) fs.mkdirSync(matrixDir);

for (let n = 4; n <= nMax; n++) {
    const mat = generateDistanceMatrix(n);
    const fname = path.join(matrixDir, `n${n}.json`);
    fs.writeFileSync(fname, JSON.stringify(mat));
    if (n % 25 === 0) console.log(`Saved matrix for n=${n}`);
}
console.log("Done - all matrices generated.");