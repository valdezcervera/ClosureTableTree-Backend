import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Category } from '../entity/closuretable';
import { QueryRepository } from './QueryBuilderClass/Delete';

export async function treeSaveNode(context: Context) {
    const manager = getManager();
    const node = new Category();
    node.name = context.request.body.name;
    node.parent = context.request.body.parent;
    await manager.save(node);
    context.body = node;
}

export async function getTrees(context: Context) {
    const manager = getManager();
    const trees = await manager.getTreeRepository(Category).findTrees();
    // returns root categories with sub categories inside
    context.body = trees;
}

export async function getRoot(context: Context) {
    const manager = getManager();
    const repository = manager.getTreeRepository(Category);
    const rootCategories = await repository.findRoots();
    // returns root categories without sub categories inside
    context.body = rootCategories;
}

export async function getChildren(context: Context) {
    const manager = getManager();
    const repository = await manager.getTreeRepository(Category);
    const parentCategory: Category = context.request.body;
    const children = await repository.findDescendants(parentCategory);
    context.body = children;
}

export async function getChildrenTree(context: Context) {
    const manager = getManager();
    const repository = await manager.getTreeRepository(Category);
    const parentCategory: Category = context.request.body;
    const childrenTree = await repository.findDescendantsTree(parentCategory);
    context.body = childrenTree;
}

export async function childrenQueryBuilder(context: Context) {
    const manager = getManager();
    const repository = await manager.getTreeRepository(Category);
    const parentCategory: Category = context.request.body;
    const children = await repository
        .createDescendantsQueryBuilder('category', 'closuretable', parentCategory)
        .andWhere('category.id >= 5') // dummy condition
        .getMany();
    context.body = children;
}

export async function countChildren(context: Context) {
    const manager = getManager();
    const repository = await manager.getTreeRepository(Category);
    const parentCategory: Category = context.request.body;
    const childCount = await repository.countDescendants(parentCategory);
    context.body = `${childCount} children found`;
}

export async function getParent(context: Context) {
    const manager = getManager();
    const repository = await manager.getTreeRepository(Category);
    const childCategory = context.request.body;
    const parents = await repository.findAncestors(childCategory);
    context.body = parents;
}

export async function getParentTree(context: Context) {
    const manager = getManager();
    const repository = await manager.getTreeRepository(Category);
    const childCategory: Category = context.request.body;
    const parentTree = await repository.findAncestorsTree(childCategory);
    context.body = parentTree;
}

export async function parentQueryBuilder (context: Context) {
    const manager = getManager();
    const repository = await manager.getTreeRepository(Category);
    const childCategory: Category = context.request.body;
    const parent = await repository
        .createAncestorsQueryBuilder('category', 'categoryClosure', childCategory)
        .andWhere('category.id >= 5') // dummy condition
        .getMany();
    context.body = parent;
}

export async function countParents(context: Context) {
    const manager = getManager();
    const repository = await manager.getTreeRepository(Category);
    const childCategory: Category = context.request.body;
    const parentCount = await repository.countAncestors(childCategory);
    context.body = `${parentCount} parents found.`;
}

// Be aware that a node is it's own child/parent
export async function deleteChildrenQueryBuilder (context: Context) {
    const manager = getManager();
    const repository = await manager.getTreeRepository(Category);
    const node: Category = context.params;
    const operation = await repository
        .createDescendantsQueryBuilder('category', 'closuretable', node) // Alias is what you are selecting --> category.
        .where(`id_descendant = ${node.id}`)
        .delete()
        .from('category_closure')
        .execute();
    context.body = operation;
}
// method 1 (first implementation from docs)
export async function deleteNodeQueryBuilder (context: Context) {
    const manager = getManager();
    const repository = await manager.getTreeRepository(Category);
    const node: Category = context.request.body;
    const operation = await repository
        .createQueryBuilder('category')
        .where(`id_ancestor = ${node.id}`)
        .delete()
        .from('category_closure')
        .execute();
    context.body = operation;
}
// method 2
// instance of QueryRepository, implementation by Shane Husson https://github.com/shusson
export async function deleteNode (context: Context) {
    const instance = await new QueryRepository();
        // get Manager to coonect to treeRepo and get descendants...
    const manager = getManager();
    const repository = await manager.getTreeRepository(Category);
    const node: Category = context.params;
        // return children in context if you want to insert deleted data
        // into the List entity from your front end.
    const children = await repository.findDescendants(node);
        // return result of instance.delete in context if you want to get a report instead.
    await instance.delete(`${node.id}`);
    context.body = children;
}
