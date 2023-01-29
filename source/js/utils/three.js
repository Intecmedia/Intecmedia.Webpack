export function traverseMaterials(object, callback) {
    object.traverse((node) => {
        if (!node.isMesh) return;
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        materials.forEach(callback);
    });
}

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

export function printGraph(node) {
    // eslint-disable-next-line compat/compat -- allowed for debug functions
    console.group(` <${node.type}> ${node.name}`);
    console.log(node);
    node.children.forEach((child) => printGraph(child));
    // eslint-disable-next-line compat/compat -- allowed for debug functions
    console.groupEnd();
}
