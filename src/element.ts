import {BoundingBox} from 'playcanvas';
import {Serializer} from './serializer';
import {Scene} from './scene';

enum ElementType {
    camera = 'camera',
    model = 'model',
    shadow = 'shadow',
    hotspots = 'hotspots',
    other = 'other'
}

const ElementTypeList = [
    ElementType.camera,
    ElementType.model,
    ElementType.shadow,
    ElementType.hotspots,
    ElementType.other
];

class Element {
    type: ElementType;
    scene: Scene = null;

    constructor(type: ElementType) {
        this.type = type;
    }

    destroy() {
        if (this.scene) {
            this.scene.remove(this);
        }
    }

    add() {}

    remove() {}

    calcBound(result: BoundingBox): boolean {
        return false;
    }

    serialize(serializer: Serializer) {}

    onUpdate(deltaTime: number) {}

    onPostUpdate() {}

    onPreRender() {}

    onPostRender() {}

    onAdded(element: Element) {}

    onRemoved(element: Element) {}
}

export {ElementType, ElementTypeList, Element};
