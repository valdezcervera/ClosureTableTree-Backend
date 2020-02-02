import { postGetAllAction } from "./controller/PostGetAllAction";
import { postGetByIdAction } from "./controller/PostGetByIdAction";
import { postSaveAction } from "./controller/PostSaveAction";
// ==============================================================//
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
} from "./controller/TreeEntityController";

/**
 * All application routes.
 */
export const AppRoutes = [
    {
        path: "/posts",
        method: "get",
        action: postGetAllAction
    },
    {
        path: "/posts/:id",
        method: "get",
        action: postGetByIdAction
    },
    {
        path: "/posts",
        method: "post",
        action: postSaveAction
    },
    //=============================================================
//===========TREE============
    {
        path: "/categories",
        method: "post",
        action: treeSaveNode
    },
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
    //======Return Children Query Builder========= TODO: implement dinamic query in controller
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
    //======Parent Query builder ============= TODO: implement dinamic query in controller
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
];

// {
//     path: ,
//     method: ,
//     action:
// }