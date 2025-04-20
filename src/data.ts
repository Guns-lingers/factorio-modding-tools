import { getModName } from './utils/utils';

export interface PrototypeFields {
    [field: string]: string;
}

const modName = getModName() ?? 'DEFAULT_MOD_NAME';;

const replaceModNamePlaceholders = (obj: PrototypeFields) => 
    Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
            key, 
            value.replace(/{modName}/g, modName)
        ])
    );

export const prototypeFields: Record<string, PrototypeFields> = {
    item: {
        ...replaceModNamePlaceholders({
            name: '"${1:name}"',
            icon: '"${2:__{modName}__/graphics/icons/item.png}"',
            icon_size: '${3:64}',
            subgroup: '"${4:raw-resource}"',
            order: '"${5:a[b]-c[d]}"',
            stack_size: '${6:100}'
        })
    },
    recipe: {
        ...replaceModNamePlaceholders({
            name: '"${1:name}"',
            category: '"${2:crafting}"',
            energy_required: '${3:1}',
            ingredients: '${4:{ type = "item", name = "iron-plate", amount = 1 }}',
            results: '${5:{ type = "item", name = "product", amount = 1 }}'
        })
    },
    container: {
        ...replaceModNamePlaceholders({
            name: '"${1:name}"',
            icon: '"${2:__{modName}__/graphics/icons/container.png}"',
            icon_size: '${3:64}',
            flags: '${4:{ "placeable-neutral", "player-creation" }}',
            minable: '${5:{ mining_time = 0.2, result = "name" }}',
            max_health: '${6:100}',
            collision_box: '${7:{{-0.35, -0.35}, {0.35, 0.35}}}',
            selection_box: '${8:{{-0.5, -0.5}, {0.5, 0.5}}}',
            inventory_size: '${9:16}',
            picture: '${10:{ filename = "__{modName}__/graphics/entity/entity/entity.png", priority = "extra-high", width = 64, height = 64, shift = {0, 0} }}'
        })
    },
    technology: {
        ...replaceModNamePlaceholders({
            name: '"${1:name}"',
            icon: '"${2:__{modName}__/graphics/icons/technology.png}"',
            icon_size: '${3:64}',
            prerequisites: '${4:{"automation", "steel-processing"}}',
            unit: '${5:{ count = 100, ingredients = {{"automation-science-pack",1}}, time = 30 }}',
            effects: '${6:{{ type = "unlock-recipe", recipe = "recipe-name" }}}',
            order: '"${7:c-a}"'
        })
    }
};

export const allTypes = Object.keys(prototypeFields);