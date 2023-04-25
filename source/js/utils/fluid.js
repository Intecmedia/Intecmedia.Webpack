export function fluidValue(value, minValue, maxValue, minRange, maxRange) {
    let result = minValue;
    if (value <= minRange) {
        result = minValue + ((maxValue - minValue) * (value - minRange)) / (maxRange - minRange);
    }
    if (value >= maxRange) {
        result = maxValue;
    }
    return result;
}

export function fluidWidth(minValue, maxValue, minRange = 320, maxRange = 1200) {
    return fluidValue(window.innerWidth, minValue, maxValue, minRange, maxRange);
}

export function fluidHeight(minValue, maxValue, minRange = 320, maxRange = 480) {
    return fluidValue(window.innerHeight, minValue, maxValue, minRange, maxRange);
}

export default fluidValue;
