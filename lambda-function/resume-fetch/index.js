// const AWS = require('aws-sdk');
// const dynamo = new AWS.DynamoDB.DocumentClient();

// exports.handler = async (event) => {
//     console.log("Request event: ", event);
//     let response;
    
//     switch (event.httpMethod) {
//         case 'POST':
//             response = await updateData(JSON.parse(event.body));
//             break;
//         case 'GET':
//             response = await getData(event.queryStringParameters);
//             break;
//         default:
//             response = {
//                 statusCode: 405,
//                 body: JSON.stringify({ message: "Method Not Allowed" })
//             };
//     }
    
//     return response;
// };

// async function updateData(data) {
//     const params = {
//         TableName: "Resumes",
//         Item: data
//     };

//     try {
//         await dynamo.put(params).promise();
//         return {
//             statusCode: 200,
//             body: JSON.stringify({ message: "Data updated successfully" })
//         };
//     } catch (error) {
//         console.error("Error updating data: ", error);
//         return {
//             statusCode: 500,
//             body: JSON.stringify({ message: "Failed to update data" })
//         };
//     }
// }

// async function getData(queryParams) {
//     const params = {
//         TableName: "Resumes",
//         Key: {
//             "ResumeId": queryParams.id
//         }
//     };

//     try {
//         const { Item } = await dynamo.get(params).promise();
//         if (Item) {
//             return {
//                 statusCode: 200,
//                 body: JSON.stringify(Item)
//             };
//         } else {
//             return {
//                 statusCode: 404,
//                 body: JSON.stringify({ message: "Resume not found" })
//             };
//         }
//     } catch (error) {
//         console.error("Error retrieving data: ", error);
//         return {
//             statusCode: 500,
//             body: JSON.stringify({ message: "Failed to retrieve data" })
//         };
//     }
// }


const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const { unmarshall } = AWS.DynamoDB.Converter;

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));
    let response;
    
    switch (event.httpMethod) {
        case 'POST':
            response = await updateData(event.body);
            break;
        case 'GET':
            response = await getData(event.queryStringParameters);
            break;
        default:
            response = {
                statusCode: 405,
                body: JSON.stringify({ message: "Method Not Allowed" })
            };
    }
    
    return response;
};

async function updateData(data) {
    console.log("Data to update:", JSON.stringify(data, null, 2));
    const params = {
        TableName: "Resumes",
        Item: data
    };

    try {
        await dynamo.put(params).promise();
        console.log("Data updated successfully");
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Data updated successfully" })
        };
    } catch (error) {
        console.error("Error updating data:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to update data" })
        };
    }
}

async function getData(queryParams) {
    console.log("Query parameters:", JSON.stringify(queryParams, null, 2));
    if (!queryParams.id) {
        console.log("Missing required query parameter 'id'");
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing required query parameter 'id'" })
        };
    }

    const params = {
        TableName: "Resumes",
        Key: {
            "ResumeId": queryParams.id
        }
    };

    console.log("Querying DynamoDB with params:", JSON.stringify(params, null, 2));

    try {
        const result = await dynamo.get(params).promise();
        console.log("DynamoDB response:", JSON.stringify(result, null, 2));
        if (result.Item) {
            // Convert DynamoDB response to a more user-friendly format
            console.log("I am here checking the response" )
            const unmarshalledItem = unmarshall(result.Item);
            console.log("Unmarshalled item", JSON.stringify(unmarshalledItem))
            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(unmarshalledItem)
            };
        } else {
            console.log("Resume not found");
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Resume not found" })
            };
        }
    } catch (error) {
        console.error("Error retrieving data:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to retrieve data" })
        };
    }
}