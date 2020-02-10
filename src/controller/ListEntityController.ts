import { Context } from 'koa';
import { getManager } from 'typeorm';
import { List } from '../entity/list';

export async function postListItem(context: Context) {
    const repository = getManager().getRepository(List);
    const newListItem = repository.create(context.request.body);
    await repository.save(newListItem);
    context.body = newListItem;
}
export async function getItemById(context: Context) {
    const repository = getManager().getRepository(List);
    const item = await repository.findOne(context.params.id);
    if (!item) {
        context.status = 404;
        return;
    }
    context.body = item;
}
export async function getAllListItems(context: Context) {
    const repository = getManager().getRepository(List);
    const itemList = await repository.find();
    context.body = itemList;
}
export async function removeListItem(context: Context) {
    const repository = getManager().getRepository(List);
    const id = context.params.id;
    const item = await repository.findOne(id);
    const removedItem = await repository.remove(item);
    context.body = removedItem;
}