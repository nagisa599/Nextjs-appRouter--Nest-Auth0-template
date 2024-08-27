import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Query = {
  __typename?: 'Query';
  getTodos: Array<Maybe<Todo>>;
};

export type Todo = {
  __typename?: 'Todo';
  id: Scalars['Int']['output'];
  is_completed: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  todo: Array<Todo>;
};

export type GetTodosQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTodosQuery = { __typename?: 'Query', getTodos: Array<{ __typename?: 'Todo', id: number, title: string, is_completed: boolean } | null> };


export const GetTodosDocument = gql`
    query getTodos {
  getTodos {
    id
    title
    is_completed
  }
}
    `;

export function useGetTodosQuery(options?: Omit<Urql.UseQueryArgs<GetTodosQueryVariables>, 'query'>) {
  return Urql.useQuery<GetTodosQuery, GetTodosQueryVariables>({ query: GetTodosDocument, ...options });
};