import queryActions from "./query-actions";
import authorizeActions from "./authorize-actions";

type actionType = "authorize" | "query" | "event" | "inscribe";

const actionDispatcher = (action: `${actionType}-${string}`) => {
  const [actionType, actionName] = action.split("-");
  switch (actionType) {
    case "authorize":
      return authorizeActions[actionName];
    case "query":
      return queryActions[actionName];
    default:
      return null;
  }
};
