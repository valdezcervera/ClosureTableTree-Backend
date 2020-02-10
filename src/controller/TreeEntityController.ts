import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Category } from '../entity/closuretable';
import { QueryBuilder } from './QueryBuilderClass/QueryBuilder';

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

export async function childrenQuery(context: Context) {
    const instance = await new QueryBuilder();
    const parentCategory: Category = context.request.body;
    const children = await instance.childrenQueryBuilder(parentCategory);
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

export async function parentQuery (context: Context) {
    const instance = await new QueryBuilder();
    const childCategory: Category = context.request.body;
    const parents = await instance.parentQueryBuilder(childCategory);
    context.body = parents;
}

export async function countParents(context: Context) {
    const manager = getManager();
    const repository = await manager.getTreeRepository(Category);
    const childCategory: Category = context.request.body;
    const parentCount = await repository.countAncestors(childCategory);
    context.body = `${parentCount} parents found.`;
}

// Be aware that a node is it's own child/parent
export async function deleteChildren (context: Context) {
    const instance = await new QueryBuilder();
    const id = context.params.id;
    const children = await instance.deleteChildren(id);
    context.body = children;
}

// instance of QueryBuilder, modified implementation by Shane Husson https://github.com/shusson
export async function deleteNode (context: Context) {
    const instance = await new QueryBuilder();
        // get node descendants from treeRepo
    const repository = getManager().getTreeRepository(Category);
    const node: Category = context.params;
    const children = await repository.findDescendants(node);
        // send the deleted node/nodes if you want to handle them further
        // save the result of instance.delete if you want to send a report instead.
    await instance.delete(`${node.id}`);
    context.body = children;
}
