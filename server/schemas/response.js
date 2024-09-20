exports.responseTypeDefs = `#graphql

interface Response {
    statusCode: String!
    message: String
    error: String
}

type UserMongoResponse implements Response {
    statusCode: String!
    message: String
    error: String
    data: [UserResponse]
}

type UserRegisterResponse implements Response {
    statusCode: String!
    message: String
    error: String
    data: UserResponse
}

type PostMongoResponse implements Response {
    statusCode: String!
    message: String
    error: String
    data: [PostResponse]
}

type PostMongoOneResponse implements Response {
    statusCode: String!
    message: String
    error: String
    data: PostResponse
}

type UserLoginResponse implements Response {
    statusCode: String!
    message: String
    error: String
    token: String
}

type UserSpecResponse implements Response {
    statusCode: String!
    message: String
    error: String
    user: UserResponse
}

type FollowMongoResponse implements Response {
    statusCode: String!
    message: String
    error: String
    data: [FollowResponse]
}

type FollowMutation implements Response {
    statusCode: String!
    message: String
    error: String
}
`;

