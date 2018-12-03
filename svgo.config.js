class SvgIdPrefix {
    constructor(counter) {
        this.counter = counter;
    }

    toString() {
        this.counter += 1;
        return `svg${this.counter}-`;
    }
}

module.exports = {
    plugins: [
        {
            cleanupIDs: {
                remove: false,
                prefix: new SvgIdPrefix(0),
            },
        },
        { convertShapeToPath: false },
        { removeViewBox: false },
    ],
};
