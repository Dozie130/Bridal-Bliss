exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    try {
        const data = JSON.parse(event.body);
        const { name, email, message } = data;

        // For now, just log the data (later we can add email sending or database storage)
        console.log("Form submission:", { name, email, message });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: `Thank you, ${name}! We'll get back to you soon.` }),
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Error processing form submission" }),
        };
    }
};
