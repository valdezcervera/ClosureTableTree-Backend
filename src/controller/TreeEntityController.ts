import {Context} from "koa";
import {getManager, Connection} from "typeorm";
import {Category} from "../entity/closuretable";

export async function treeSaveNode(context: Context) {
    const manager = getManager()
    const node = new Category()
    node.name = context.request.body.name
    node.parent = context.request.body.parent
    await manager.save(node)
    context.body = node;
}

export async function getTrees(context: Context) {
    const manager = getManager()
    const trees = await manager.getTreeRepository(Category).findTrees()
    // returns root categories with sub categories inside
    context.body = trees
}

export async function getRoot(context: Context) {
    const manager = getManager()
    const repository = manager.getTreeRepository(Category)
    const rootCategories = await repository.findRoots();
    // returns root categories without sub categories inside
    context.body = rootCategories
}

export async function getChildren(context: Context) {
    const manager = getManager()
    const repository = await manager.getTreeRepository(Category)
    const parentCategory: Category = context.request.body
    const children = await repository.findDescendants(parentCategory)
    context.body = children
}

export async function getChildrenTree(context: Context) {
    const manager = getManager()
    const repository = await manager.getTreeRepository(Category)
    const parentCategory: Category = context.request.body
    const childrenTree = await repository.findDescendantsTree(parentCategory)
    context.body = childrenTree
}

export async function childrenQueryBuilder(context: Context) {
    const manager = getManager()
    const repository = await manager.getTreeRepository(Category)
    const parentCategory: Category = context.request.body
    const children = await repository
        .createDescendantsQueryBuilder('category', 'closuretable', parentCategory)
        .andWhere("category.id >= 5") // condition
        .getMany()
    context.body = children
}

export async function countChildren(context: Context) {
    const manager = getManager()
    const repository = await manager.getTreeRepository(Category)
    const parentCategory: Category = context.request.body
    const childCount = await repository.countDescendants(parentCategory)
    context.body = `${childCount} children found`    
}

export async function getParent(context: Context) {
    const manager = getManager()
    const repository = await manager.getTreeRepository(Category)
    const childCategory = context.request.body
    const parents = await repository.findAncestors(childCategory)
    context.body = parents
}

export async function getParentTree(context: Context) {
    const manager = getManager()
    const repository = await manager.getTreeRepository(Category)
    const childCategory: Category = context.request.body
    const parentTree = await repository.findAncestorsTree(childCategory)
    context.body = parentTree
}

export async function parentQueryBuilder (context: Context) {
    const manager = getManager()
    const repository = await manager.getTreeRepository(Category)
    const childCategory: Category = context.request.body
    const parent = await repository
        .createAncestorsQueryBuilder("category", "categoryClosure", childCategory)
        .andWhere("category.id >= 5")
        .getMany()
    context.body = parent
}

export async function countParents(context: Context) {
    const manager = getManager()
    const repository = await manager.getTreeRepository(Category)
    const childCategory: Category = context.request.body
    const parentCount = await repository.countAncestors(childCategory)
    context.body = `${parentCount} parents found`    
}
