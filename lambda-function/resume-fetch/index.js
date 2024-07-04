const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log("Request event: ", event);
    let response;
    
    switch (event.httpMethod) {
        case 'POST':
            response = await updateData(JSON.parse(event.body));
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
    const params = {
        TableName: "Resumes",
        Item: data
    };

    try {
        await dynamo.put(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Data updated successfully" })
        };
    } catch (error) {
        console.error("Error updating data: ", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to update data" })
        };
    }
}

async function getData(queryParams) {
    const params = {
        TableName: "Resumes",
        Key: {
            "ResumeId": queryParams.id
        }
    };

    try {
        const { Item } = await dynamo.get(params).promise();
        if (Item) {
            return {
                statusCode: 200,
                body: JSON.stringify(Item)
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Resume not found" })
            };
        }
    } catch (error) {
        console.error("Error retrieving data: ", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to retrieve data" })
        };
    }
}