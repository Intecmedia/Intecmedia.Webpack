/**
 * Traverse materials.
 * @param {object} object - input object
 * @param {Function} callback - callback function
 */
export function traverseMaterials(object, callback) {
    object.traverse((node) => {
        if (!node.isMesh) return;
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        materials.forEach(callback);
    });
}

/**
 * Rotate object around axis.
 * @param {object} obj - input object
 * @param {object} around - around object
 * @param {string} axis - axis name
 * @param {number} theta - theta angle
 * @param {boolean} isWorld - is world
 */
export function rotateAround(obj, around, axis, theta, isWorld = false) {
    if (isWorld) {
        obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(around); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(around); // re-add the offset

    if (isWorld) {
        obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}

/**
 * Print node via `console.group` api.
 * @param {object} node - input node
 */
export function printGraph(node) {
    console.group(` <${node.type}> ${node.name}`);
    console.log(node);
    node.children.forEach((child) => printGraph(child));
    console.groupEnd();
}
