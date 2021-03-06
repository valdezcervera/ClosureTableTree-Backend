import { getManager, EntityManager, EntityRepository, TreeRepository, getRepository } from 'typeorm';
import { Category } from '../../entity/closuretable';

@EntityRepository(Category)
export class QueryBuilder extends TreeRepository<Category> {

    async delete(id: string): Promise<any> {
        const result = await getManager().transaction(async (tem: EntityManager) => {
            const entity = await tem.findOneOrFail(Category, id, { relations: ['parent'] });

            if (!entity.parent) return 'Nodes without ancestor are not removable'; // Error handling goes here

            // added const repository instead of pointing metadata to .this
            const repository = getRepository(Category);
            const table = repository.metadata.closureJunctionTable.ancestorColumns[0].entityMetadata.tableName;
            const ancestor = repository.metadata.closureJunctionTable.ancestorColumns[0].databasePath;
            const descendant = repository.metadata.closureJunctionTable.descendantColumns[0].databasePath;

            const nodes = await tem // tem: table entity manager
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

            return nodeIds;
        });

        return { ids_removed: result };
    }
    async deleteChildren (id) {
        const operation = await getManager().getTreeRepository(Category)
            .createDescendantsQueryBuilder('category', 'closuretable', id) // Alias is what you are selecting --> category.
            .where(`id_descendant = ${id}`)
            .delete()
            .from('category_closure')
            .execute();
        return operation;
    }
    async parentQueryBuilder (childNode) {
        const operation = await getManager().getTreeRepository(Category)
            .createAncestorsQueryBuilder('category', 'closuretable', childNode)
            .andWhere('category.id >= 5') // dummy condition: return all parents >= id:5
            .getMany();
        return operation;
    }
    async childrenQueryBuilder(parentNode) {
        const operation = await getManager().getTreeRepository(Category)
            .createDescendantsQueryBuilder('category', 'closuretable', parentNode)
            .andWhere('category.id >= 5') // dummy condition
            .getMany();
        return operation;
    }
}