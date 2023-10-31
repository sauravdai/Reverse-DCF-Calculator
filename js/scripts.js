function calculateImpliedGrowthRate() {
    const currentStockPrice = parseFloat(document.getElementById("currentPrice").value);
    const initialCashFlow = parseFloat(document.getElementById("initialCashFlow").value);
    const discountRate = parseFloat(document.getElementById("discountRate").value) / 100;
    const projectionPeriod = parseInt(document.getElementById("projectionPeriod").value);
    const terminalGrowth = parseFloat(document.getElementById("terminalGrowth").value) / 100;

    let impliedGrowthRate = findImpliedGrowthRate(currentStockPrice, initialCashFlow, discountRate, projectionPeriod, terminalGrowth);

    const resultElement = document.getElementById("result");
    if (typeof impliedGrowthRate === "string") {
        resultElement.textContent = impliedGrowthRate;
    } else {
        resultElement.textContent = `Implied Growth Rate: ${impliedGrowthRate.toFixed(2)}%`;
    }
}

function findImpliedGrowthRate(stockPrice, initialCashFlow, discountRate, projectionPeriod, terminalGrowth) {
    let growthRate = -0.5; // Start from -50%
    let increment = 0.001; // Increase by 0.1% in each iteration
    let maxIterations = 10000; // Just in case 
    let currentIteration = 0;
    let tolerance = 0.02 * stockPrice; 
    
    while (currentIteration < maxIterations) {
        let pv = calculatePresentValue(initialCashFlow, discountRate, growthRate, projectionPeriod, terminalGrowth);
        
        if (Math.abs(pv - stockPrice) <= tolerance) {
            return growthRate * 100; 
        }
        
        growthRate += increment;
        currentIteration++;
    }

    return "Growth rate not found within bounds.";
}

function calculatePresentValue(initialCashFlow, discountRate, growthRate, projectionPeriod, terminalGrowth) {
    let pv = 0;
    for (let i = 1; i <= projectionPeriod; i++) {
        pv += initialCashFlow * Math.pow(1 + growthRate, i) / Math.pow(1 + discountRate, i);
    }
    pv += (initialCashFlow * Math.pow(1 + growthRate, projectionPeriod) * (1 + terminalGrowth)) / (discountRate - terminalGrowth) / Math.pow(1 + discountRate, projectionPeriod);
    
    return pv;
}
