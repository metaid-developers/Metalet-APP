import { ActionType } from "./types";
import { ComponentType, ReactNode } from "react";
import queryActions from "./query-actions";
import authorizeActions from "./authorize-actions";

export interface QueryAction {
  process: Function;
}

export interface AuthorizeAction {
  name: string;
  title: string;
  process: Function;
  estimate: Function;
  descriptions: string[];
  closeAfterProcess: boolean;
  component: ComponentType<{ params: object; children: ReactNode }>;
}

type ActionDispatcherReturnType<T extends ActionType> =
  T extends ActionType.Query
    ? QueryAction
    : T extends ActionType.Authorize
      ? AuthorizeAction
      : never;

const actionDispatcher = <T extends ActionType>(
  actionName: string,
  actionType: T
): ActionDispatcherReturnType<T> => {
  if (actionType === ActionType.Query) {
    return queryActions[actionName] as ActionDispatcherReturnType<T>;
  } else if (actionType === ActionType.Authorize) {
    return authorizeActions[actionName] as ActionDispatcherReturnType<T>;
  } else {
    throw new Error("Unknown action type");
  }
};

export default actionDispatcher;
