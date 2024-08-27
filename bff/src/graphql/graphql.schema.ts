
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class Todo {
    id: number;
    title: string;
    is_completed: boolean;
}

export class User {
    id: number;
    name: string;
    todo: Todo[];
}

export abstract class IQuery {
    abstract getTodos(): Nullable<Todo>[] | Promise<Nullable<Todo>[]>;
}

type Nullable<T> = T | null;
