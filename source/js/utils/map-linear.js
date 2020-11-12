// Linear mapping from range <a1, a2> to range <b1, b2>
export default function mapLinear(x, a1, a2, b1, b2) {
    return b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);
}
