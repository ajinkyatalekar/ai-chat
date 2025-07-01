export const getMessagesForResponse = async (chat_id: number | undefined) => {
    const response = await fetch(`/api/db/message?chat_id=${chat_id}`);
    if (!chat_id) {
        throw new Error("Chat ID is required");
    }
    if (!response.ok) {
        throw new Error("Failed to fetch messages");
    }
    const data = await response.json();
    return data;
}