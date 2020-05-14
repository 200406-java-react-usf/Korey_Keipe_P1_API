export interface CrudRepository<T> {

    getAll(): Promise<T[]>;
    getById(id: number): Promise<T>;
    save(newObj: T): Promise<T>;
    update(updateOjb: T): Promise<boolean>;
    deleteById(id: number): Promise<boolean>;

}