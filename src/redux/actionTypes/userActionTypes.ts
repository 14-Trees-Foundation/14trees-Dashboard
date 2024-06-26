const userActionTypes = {
    GET_USERS_REQUESTED: "GET_USERS_REQUESTED",
    GET_USERS_SUCCEEDED: "GET_USERS_SUCCEEDED",
    GET_USERS_FAILED: "GET_USERS_FAILED",

    SEARCH_USERS_REQUESTED: "SEARCH_USERS_REQUESTED",
    SEARCH_USERS_SUCCEEDED: "SEARCH_USERS_SUCCEEDED",
    SEARCH_USERS_FAILED: "SEARCH_USERS_FAILED",

    CREATE_USER_REQUESTED: "CREATE_USER_REQUESTED",
    CREATE_USER_SUCCEEDED: "CREATE_USER_SUCCEEDED",
    CREATE_USER_FAILED: "CREATE_USER_FAILED",

    CREATE_BULK_USERS_REQUESTED: "CREATE_BULK_USERS_REQUESTED",
    CREATE_BULK_USERS_SUCCEEDED: "CREATE_BULK_USERS_SUCCEEDED",
    CREATE_BULK_USERS_FAILED: "CREATE_BULK_USERS_FAILED",

    UPDATE_USER_REQUESTED: "UPDATE_USER_REQUESTED",
    UPDATE_USER_SUCCEEDED: "UPDATE_USER_SUCCEEDED",
    UPDATE_USER_FAILED: "UPDATE_USER_FAILED",

    DELETE_USER_REQUESTED: "DELETE_USER_REQUESTED",
    DELETE_USER_SUCCEEDED: "DELETE_USER_SUCCEEDED",
    DELETE_USER_FAILED: "DELETE_USER_FAILED",
};

export default userActionTypes;