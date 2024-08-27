import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
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

export type FindgetTodosQueryVariables = Exact<{ [key: string]: never; }>;


export type FindgetTodosQuery = { __typename?: 'Query', getTodos: Array<{ __typename?: 'Todo', id: number, title: string, is_completed: boolean } | null> };


export const FindgetTodosDocument = gql`
    query findgetTodos {
  getTodos {
    id
    title
    is_completed
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    findgetTodos(variables?: FindgetTodosQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<FindgetTodosQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FindgetTodosQuery>(FindgetTodosDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'findgetTodos', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;