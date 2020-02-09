import {
    treeSaveNode,
    getTrees,
    getRoot,
    getChildren,
    getChildrenTree,
    childrenQueryBuilder,
    countChildren,
    getParent,
    getParentTree,
    parentQueryBuilder,
    countParents,
    deleteChildrenQueryBuilder,
    deleteNode
} from './controller/TreeEntityController';
import { postListItem, getItemById, getAllListItems, removeListItem } from './controller/ListEntityController';

export const AppRoutes = [
// ==========================ITEM_LIST=============================
    // ======Create Item==========================
    {
        path: '/itemlist',
        method: 'post',
        action: postListItem
    },
    {
        path: '/itemlist/:id',
        method: 'get',
        action: getItemById
    },
    {
        path: '/itemlist',
        method: 'get',
        action: getAllListItems
    },
    {
        path: '/itemlist/:id',
        method: 'del',
        action: removeListItem
    },
// ==========================CLOSURE_TREE=============================

// =========NODE OPERATIONS=======
    // ======Create NODE==========================
    {
        path: '/categories',
        method: 'post',
        action: treeSaveNode
    },
    // ========Get Whole Tree=====================
    {
        path: '/categories',
        method: 'get',
        action: getTrees
    },
    {
        path: '/categories/root',
        method: 'get',
        action: getRoot
    },
// =========CHILDREN========
    // ======Return Children List (no tree)=======
    {
        path: '/categories/children',
        method: 'get',
        action: getChildren
    },
    // ======Return Children Tree=================
    {
        path: '/categories/children/tree',
        method: 'get',
        action: getChildrenTree
    },
    // ======Return Children Query Builder=========
    {
        path: '/query/children',
        method: 'get',
        action: childrenQueryBuilder
    },
    // ======Count Children =======================
    {
        path: '/count/children',
        method: 'get',
        action: countChildren
    },
// =======PARENT============
    // ======Return Parent List (no tree)=======
    {
        path: '/categories/parent',
        method: 'get',
        action: getParent
    },
    // ======Return Parent Tree ================
    {
        path: '/categories/parent/tree',
        method: 'get',
        action: getParentTree
    },
    // ======Parent Query builder ==============
    {
        path: '/query/parent',
        method: 'get',
        action: parentQueryBuilder
    },
    // ======Count Parents ======================
    {
        path: '/count/parents',
        method: 'get',
        action: countParents
    },
// ========CUSTOM NODE OPERATIONS================ TODO: Move subTree
    // ======Delete Children ========================
    {
        path: '/node/delete/children/:id',
        method: 'del',
        action: deleteChildrenQueryBuilder
    },
    // ======Delete Node ============================
    {
        path: '/node/delete/node/:id',
        method: 'del',
        action: deleteNode
    }
];
