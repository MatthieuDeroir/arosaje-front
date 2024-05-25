// mockData.js
export const conversations = [
    {
      id: 1,
      senderId: 1,
      receiverId: 2,
      messages: [
        {
          id: 1,
          senderId: 1,
          receiverId: 2,
          content: "Hello!",
          dateSent: "2024-05-25T10:00:00Z"
        },
        {
          id: 2,
          senderId: 2,
          receiverId: 1,
          content: "Hi, how are you?",
          dateSent: "2024-05-25T10:05:00Z"
        }
      ]
    },
    {
      id: 2,
      senderId: 3,
      receiverId: 1,
      messages: [
        {
          id: 1,
          senderId: 3,
          receiverId: 1,
          content: "Hey, are you coming to the party?",
          dateSent: "2024-05-24T18:00:00Z"
        }
      ]
    }
  ];
  