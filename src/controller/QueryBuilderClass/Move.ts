/**
 * UNDER DEVELOPMENT
 * this code will eventually  be merged
 * with the QueryBuilder class
 */

import { getManager, EntityManager, EntityRepository, TreeRepository, getRepository } from 'typeorm';
import { Category } from '../../entity/closuretable';

@EntityRepository(Category)
export class QueryRepositoryMove extends TreeRepository<Category> {

    async MoveSubTree(id: string, idTarget, idSource): Promise<any> {
        const result = await getManager().transaction(async (tem: EntityManager) => { // tem= TableEntityManager
            const entity = await tem.findOneOrFail(Category, id, { relations: ['parent'] });

            if (!entity.parent) return 'Nodes without ancestor are not removable'; // Error handling goes here

            // added const repository instead of pointing metadata to .this
            const repository = getRepository(Category);
            const table = repository.metadata.closureJunctionTable.ancestorColumns[0].entityMetadata.tableName;
            const ancestor = repository.metadata.closureJunctionTable.ancestorColumns[0].databasePath;
            const descendant = repository.metadata.closureJunctionTable.descendantColumns[0].databasePath;
            // ==================CREATE LENGTH PROPERTIES============================================
            const manager = await getManager();
            const treeRepository = await manager.getTreeRepository(Category);
            const _id: Category = {id: parseInt(id, 10), name: null, children: null, parent: null};
            const supertreeLength = await treeRepository.countAncestors(_id);
            const subtreeLength = await treeRepository.countDescendants(_id);
            const length = supertreeLength + subtreeLength;
            // =======================================================================================
            const nodes = await tem
                .createQueryBuilder()
                .select(descendant)
                .from(table, 'closure')
                // tslint:disable-next-line: object-literal-shorthand
                .where(`${ancestor} = :id`, { id: id })
                .getRawMany();

            const nodeIds = nodes.map((v) => v[descendant]);

            // delete all the nodes from the closure table
            await tem
                .createQueryBuilder()
                .delete()
                .from(table)
                .where(`${descendant} IN (:...ids)`, { ids: nodeIds })
                .execute();

            // delete the parent foreign key from the queries
            // otherwise we'll get a fk constraint when trying to delete
            await tem
                .createQueryBuilder()
                .relation(Category, 'parent')
                .of(nodeIds)
                .set(null);

                // delete the queries
                await tem.delete(Category, nodeIds);


            // insert tree in new location
            // argument should come in form of: -objec: Category, int, int-
            // {id: int, name: null, children: null, parent: null}, id-target, id-source
            await tem
                .createQueryBuilder()
                .insert()
                .into(table)
                .values(`${idTarget}, ${idSource}, ${length}`)
                .select(`${idTarget}, ${idSource},`) // TODO: get super and subtree
                .from(Category, '¿¿how to add supertree??') // TODO: how to crossJoin
                .where(`id_ancestor = ${idTarget} AND id_descendant = ${idSource}`); // TODO: get super and subtree

                    // TODO: remove this
                    // INSERT INTO category_closure (id_ancestor, id_descendant, ancest+desc)
                    // SELECT
                    // supertree.id_ancestor,
                    // subtree.id_descendant,
                    // supertree.length + subtree.length + 1 AS length
                    // FROM category_closure AS supertree
                    // CROSS JOIN category_closure AS subtree
                    // WHERE supertree.id_descendant = //target ID
                    // AND subtree.id_ancestor = //source ID;

            return nodeIds;
        });

        return { ids_removed: result };
    }
}




