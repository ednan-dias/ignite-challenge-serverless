import { APIGatewayProxyHandler } from "aws-lambda";
import * as dayjs from "dayjs";
import { document } from "../utils/dynamodbClient";

interface IRequest {
  id: string;
  title: string;
  deadline: string;
}

export const handle: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;
  const { id, title, deadline } = JSON.parse(event.body) as IRequest;

  const response = await document
    .query({
      TableName: "ignite_todo",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    })
    .promise();

  const userTodo = response.Items[0];

  if (userTodo) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "Todo already exists!",
      }),
      headers: {
        "Content-type": "application/json",
      },
    };
  }

  await document
    .put({
      TableName: "ignite_todo",
      Item: {
        id,
        user_id,
        title,
        done: false,
        deadline: dayjs(deadline).format("DD/MM/YYYY"),
      },
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Todo created!",
    }),
    headers: {
      "Content-type": "application/json",
    },
  };
};
