import {Asset, AssetRegistry, StandardMaterial, TEXTURETYPE_RGBP} from 'playcanvas';
import {Model} from './model';
import {Env} from './env';

interface ModelLoadRequest {
    url?: string;
    contents?: ArrayBuffer;
    filename?: string;
    maxAnisotropy?: number;
}

interface EnvLoadRequest {
    url: string;
    filename?: string;
}

// handles loading gltf container assets
class AssetLoader {
    registry: AssetRegistry;
    defaultAnisotropy: number;

    constructor(registry: AssetRegistry, defaultAnisotropy?: number) {
        this.registry = registry;
        this.defaultAnisotropy = defaultAnisotropy || 1;
    }

    loadModel(loadRequest: ModelLoadRequest) {
        const registry = this.registry;

        return new Promise<Model>((resolve, reject) => {
            const gemMaterials = new Set<StandardMaterial>();

            const containerAsset = new Asset(
                loadRequest.filename || loadRequest.url,
                'container',
                {
                    url: loadRequest.url,
                    contents: loadRequest.contents
                },
                null,
                {
                    image: {
                        postprocess: (gltfImage: any, textureAsset: Asset) => {
                            textureAsset.resource.anisotropy = loadRequest.maxAnisotropy || this.defaultAnisotropy;
                        }
                    },
                    material: {
                        postprocess: (gltfMaterial: any, materialAsset: StandardMaterial) => {
                            // keep tabs on materials with SNAP gemstone extension
                            if (gltfMaterial?.extensions?.SNAP_materials_gemstone) {
                                gemMaterials.add(materialAsset);
                            }
                        }
                    }
                } as any
            );
            containerAsset.on('load', () => {
                resolve(new Model(containerAsset, gemMaterials));
            });
            containerAsset.on('error', (err: string) => {
                reject(err);
            });

            registry.add(containerAsset);
            registry.load(containerAsset);
        });
    }

    loadEnv(loadRequest: EnvLoadRequest) {
        const registry = this.registry;
        return new Promise<Env>((resolve, reject) => {
            const textureAsset = new Asset('skybox_equi', 'texture', loadRequest, {
                mipmaps: false,
                type: TEXTURETYPE_RGBP
            });
            textureAsset.ready(() => resolve(new Env(textureAsset)));
            textureAsset.on('error', (err: string) => reject(err));
            registry.add(textureAsset);
            registry.load(textureAsset);
        });
    }
}

export {AssetLoader};
