import { actionType } from "./types";
import queryActions from "./query-actions";
import authorizeActions from "./authorize-actions";

const actionDispatcher = (action: `${string}-${actionType}`) => {
  const [actionName, actionType] = action.split("-");

  switch (actionType) {
    case "authorize":
      return authorizeActions[actionName];
    case "query":
      return queryActions[actionName];
    default:
      return null;
  }
};

export default actionDispatcher;
