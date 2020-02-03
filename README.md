# Example how to use Koa and TypeORM with TypeScript

### NOTE:
This example has been modified from the original repo to use the closure table pattern, this pattern is used for 
data represented as a tree, and it enables blazing fast reads and writes.  
Repo forked from:  
https://github.com/typeorm/typescript-koa-example.git  
by Umed Khudoiberdiev

### Steps
1. clone repository 
2. run `npm i`
3. edit `ormconfig.json` and change your database configuration (you can also change a database type, but don't forget to install specific database drivers)
3. if you wish, you can use the supplied docker-compose file to use with postgreSQL,
if so, leave `ormconfig.json` as is an run docker-compose up (dont forget to install docker and 
the postgreSQL container!). 
5. run `npm start` (the script compiles ts files and runs nodemon)
6. open `http://localhost:3000/categories` and you'll get an empty array.
7. use curl, postman or other tools to send http requests to test your typeorm-based API
8. to create a new node, the endpoint post:/categories recieves a JSON with the following
structure:  
            {name: string} creates a root node  
            {name: string, parent{id: int}} creates children from parent, 
            where id: is the parent id:

### Available endpoints:
/categories:  
get  
-returns the whole tree structure.
post  
-creates a new node.

/categories/root  
get  
return the root node.

/categories/children  
get  
list of all children from parent node. 

/categories/children/tree  
get  
list of all children from parent node in
a tree representation.

/count/children  
get  
count's how many children go from parent node to
leaf.   
Important Note!:  
Closure tables count the node as a children/parent of
itself!, be aware that a count of 6 children includes
the parent node as well!.

/categories/parent  
get  
list of all the parents from child node.

/categories/parent/tree  
get  
list of all parents from the child node in 
a tree representation.

/count/parents  
get  
count's how many parents go from child node
to root.
Please read node on count/children!

/node/delete  
get  
remove node. It only aplies to leaves.

### Custom controllers
/query/children && /query/parent implement a QueryBuilder on the
controller, for the moment it only contains a hard coded dummy query, go ahead and tweek them!

## How to use CLI?

1. install `typeorm` globally: `npm i -g typeorm`
2. run `typeorm -h` to show list of available commands
