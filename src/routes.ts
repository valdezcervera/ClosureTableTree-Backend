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
    deleteNodeQueryBuilder,
    deleteNode
} from "./controller/TreeEntityController";

export const AppRoutes = [
//==========================CLOSURE_TREE=============================

//=========NODE OPERATIONS=======
    //======Create NODE==========================
    {
        path: "/categories",
        method: "post",
        action: treeSaveNode
    },
    //========Get Whole Tree=====================
    {
        path: "/categories",
        method: "get",
        action: getTrees
    },
    {
        path: "/categories/root",
        method: "get",
        action: getRoot
    },
// =========CHILDREN========
    //======Return Children List (no tree)=======
    {
        path: "/categories/children",
        method: "get",
        action: getChildren
    },
    //======Return Children Tree=================
    {
        path: "/categories/children/tree",
        method: "get",
        action: getChildrenTree
    },
    //======Return Children Query Builder========= TODO: posible custom query on children
    {
        path: "/query/children",
        method: "get",
        action: childrenQueryBuilder
    },
    //======Count Children =======================
    {
        path: "/count/children",
        method: "get",
        action: countChildren
    },
// =======PARENT============
    //======Return Parent List (no tree)=======
    {
        path: "/categories/parent",
        method: "get",
        action: getParent
    },
    //======Return Parent Tree ================
    {
        path: "/categories/parent/tree",
        method: "get",
        action: getParentTree
    },
    //======Parent Query builder ============= TODO: posible custom query on parent
    {
        path: "/query/parent",
        method: "get",
        action: parentQueryBuilder
    },
    //======Count Parents =======================
    {
        path: "/count/parents",
        method: "get",
        action: countParents
    },
// ========CUSTOM NODE OPERATIONS================ TODO: Move subTree
    // ======Delete Children ========================
    {
        path: "/node/delete/children",
        method: "get",
        action: deleteChildrenQueryBuilder
    },
    // ======Delete Node ============================
    {
        path: "/node/delete/node",
        method: "get",
        action: deleteNode
    }
];
