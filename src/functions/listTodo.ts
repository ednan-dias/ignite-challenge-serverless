import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;

  const response = await document
    .scan({
      TableName: "ignite_todo",
      FilterExpression: "user_id = :id",
      ExpressionAttributeValues: {
        ":id": user_id,
      },
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      todos: response.Items,
    }),
    headers: {
      "Content-type": "application/json",
    },
  };
};
