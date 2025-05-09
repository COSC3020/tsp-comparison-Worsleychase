// Held-Karp dynamic programming TSP
function tsp_hk(distances) {
    let n = distances.length;
    if (n <= 1) return 0;
    
    // memoization cache
    let memo = new Map();
    
    function hkMinDist(cities, start) {
        // base case
        if (cities.size == 2) {
            let other = Array.from(cities).find(city => city != start);
            return distances[start][other];
        }
        
        let key = Array.from(cities).sort().join(',') + '|' + start;
        if (memo.has(key)) return memo.get(key);
        
        let minDistance = Infinity;
        
        // try each city 
        for (let city of cities) {
            if (city != start) {
                let remaining = new Set(cities);
                remaining.delete(start);
                
                let distance = hkMinDist(remaining, city) + distances[start][city];
                minDistance = Math.min(minDistance, distance);
            }
        }
        memo.set(key, minDistance);
        return minDistance;
    }
    
    // initial set of cities
    let cities = new Set();
    for (let i = 0; i < n; i++) {
        cities.add(i);
    }
    
    // minimum distance starting from each city
    let minTour = Infinity;
    for (let start = 0; start < n; start++) {
        minTour = Math.min(minTour, hkMinDist(cities, start));
    }
    
    return minTour;
}

function tsp_ls(distance_matrix) {
    let n = distance_matrix.length;
    if (n <= 1) return 0;
    
    // calculate total route distance
    function getDistance(route) {
        let distance = 0;
        for (let i = 0; i < route.length - 1; i++) {
            distance += distance_matrix[route[i]][route[i + 1]];
        }
        return distance;
    }
    
    // Helper for 2optSwap
    function twoOpt(route, i, k) {
        let newRoute = route.slice(0, i);
        for (let j = k; j >= i; j--) {
            newRoute.push(route[j]);
        }
        newRoute.push(...route.slice(k + 1));
        return newRoute;
    }
    
    // initial random route
    let currentRoute = Array.from({length: n}, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [currentRoute[i], currentRoute[j]] = [currentRoute[j], currentRoute[i]];
    }
    
    let bestDistance = getDistance(currentRoute);
    let iterations = 0;
    let badCount = 0;
    const MAX_BAD_COUNT = n * 10; // stop after n*10 iterations without improvement. I used n*10 because it is unlikely that a better route isn't found in n*10 attempts
    const MAX_ITER = n * 100;    // limit on total iterations. I used n*100 because it needs a substantially large amount of iterations for each attempt to avoid getting stuck in local minima
    
    while (iterations < MAX_ITER && badCount < MAX_BAD_COUNT) {
        let improved = false;
        
        // make i and k random but different from last iteration
        let i = Math.floor(Math.random() * (n-1)); // randomly choose i to be between 0 and n-2
        let k = i + 1 + Math.floor(Math.random() * (n-i-1)); // randomly choose k to be between i+1 and n-1. Makes sure k is always greater than i
        
        let newRoute = twoOpt(currentRoute, i, k);
        let newDistance = getDistance(newRoute);
        
        if (newDistance < bestDistance) {
            currentRoute = newRoute;
            bestDistance = newDistance;
            improved = true;
            badCount = 0;
        }
        
        if (!improved) badCount++;
        iterations++;
    }
    
    return bestDistance;
}

function runExperimentHeldKarp() {
    const fs = require('fs');
    const path = require('path');
    const matrixDir = 'distance_bank';
    const results = ['n,time,tourLength'];
    const startTime = Date.now();
    const TWO_HOURS = 2 * 60 * 60 * 1000; // milliseconds!

    let n = 2;
    while ((Date.now() - startTime) < TWO_HOURS) {
        const matrixFile = path.join(matrixDir, `n${n}.json`);
        if (!fs.existsSync(matrixFile)) break;
	if (n > 20) break;
        const distances = JSON.parse(fs.readFileSync(matrixFile));
        const iterStart = Date.now();
        const tourLength = tsp_hk(distances);
        const iterTime = Date.now() - iterStart;

        results.push(`${n},${iterTime},${tourLength}`);
        console.log(`HK: n=${n}, time=${iterTime}ms, length=${tourLength}`);
        n++;
    }
    fs.writeFileSync('hk_results.csv', results.join('\n'));
}

function runExperimentLocalSearch() {
    const fs = require('fs');
    const path = require('path');
    const matrixDir = 'distance_bank';
    const results = ['n,time,tourLength'];
    const startTime = Date.now();
    const TWO_HOURS = 2 * 60 * 60 * 1000;
    const nMax = 25000; 

    let n = 2;
    while ((Date.now() - startTime) < TWO_HOURS && n <= nMax) {
        const matrixFile = path.join(matrixDir, `n${n}.json`);
        if (!fs.existsSync(matrixFile)) {
            console.log(`Matrix file not found for n=${n}. Stopping.`);
            break;
        }

        const distances = JSON.parse(fs.readFileSync(matrixFile));
        const iterStart = Date.now();
        const tourLength = tsp_ls(distances);
        const iterTime = Date.now() - iterStart;

        results.push(`${n},${iterTime},${tourLength}`);
        console.log(`LS: n=${n}, time=${iterTime}ms, length=${tourLength}`);

        // Adaptive step logic
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

    fs.writeFileSync('ls_results.csv', results.join('\n'));
}


// Run experiments
console.log("Running Held-Karp experiment...");
runExperimentHeldKarp();

console.log("\nRunning Local Search experiment...");
runExperimentLocalSearch();
