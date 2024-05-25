import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components';
import '../../Styles/Conversation.css';
import {ConversationContext} from "./ConversationContext";
import {MessageService} from "../../Services/MessageService";
import { conversations } from './mockData';
export interface IRecipient {
    name: string;
    photoUrl: string;
}

export interface IMessage {
    sender: string;
    content: string;
    isFromCurrentUser: boolean;
}

export interface IConversation {
    id: number;
    recipient: IRecipient;
    messages: IMessage[];
}

const MessagingApp = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<number|null> (null);

  const selectedConversation = conversations.find(convo => convo.id === selectedConversationId);

  const currentUser = 1;

  return (
    <div className="conversation">
      <div className="conversations-list">
        {conversations.map(convo => (
          <div key={convo.id} onClick={() => setSelectedConversationId(convo.id)}>
            Conversation {convo.id}
          </div>
        ))}
      </div>
      <div className="conversation-window">
        {selectedConversation ? (
          <div className='chatMessage'>
            {selectedConversation.messages.map(message => (
              <div key={message.id} className={message.senderId === currentUser ? "msg msg-currentUser" : "msg msg-contact"}>
                <p className={message.senderId === currentUser ? "chat-currentUser" : "chat-contact"}>{message.content}</p>
                <span className={message.senderId === currentUser ? "time-currentUser" : "time-contact"}>{message.dateSent}</span>
              </div>
            ))}
          </div>
        ) : (
          <p>Select a conversation</p>
        )}
        <form className="chatForm">
          <textarea className='chatInput' placeholder='Votre message...'/>
          <button className='chatButton'>Envoyer</button>
        </form>
      </div>
    </div>
  );
};

export default MessagingApp;



// interface ConversationProps {
//     selectedConversation: IConversation | null;
// }

// const MessageP = styled.p<{ isFromCurrentUser: boolean }>``;

// const Conversation: React.FC = () => {
//     const [selectedConversation, setSelectedConversation] = useState<IConversation | null>(null);
//     const [newMessage, setNewMessage] = useState<string>('');
//     const context = useContext(ConversationContext);

//     useEffect(() => {
//         // Set up WebSocket connection and message receiving
//         MessageService.connect(
//             () => console.log('WebSocket connected'),
//             (message) => {
//                 // Handle received message
//                 // You need to determine if the incoming message belongs to the current conversation
//                 // This is a simplified example
//                 if (selectedConversation && message.conversationId === selectedConversation.id) {
//                     // @ts-ignore
//                     setSelectedConversation((prevConversation) => {
//                         if (prevConversation) {
//                             return {
//                                 ...prevConversation,
//                                 messages: [...prevConversation.messages, message],
//                             };
//                         }
//                         return prevConversation;
//                     });
//                 }
//             }
//         );

//         return () => {
//             MessageService.disconnect();
//         };
//     }, [selectedConversation]);

//     useEffect(() => {
//         if (context) {
//             setSelectedConversation(context.selectedConversation);
//         }
//     }, [context]);

//     const handleNewMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setNewMessage(event.target.value);
//     };

//     const handleNewMessageSubmit = (event: React.FormEvent) => {
//         event.preventDefault();
//         if (selectedConversation) {
//             const message = {
//                 id: 0,
//                 senderId: 0,
//                 content: newMessage,
//                 isFromCurrentUser: true,
//                 conversationId: selectedConversation.id,
//                 createdAt: new Date().toISOString(),
//                 destination: selectedConversation.recipient.name,
//             };

//             // Send the message via WebSocket
//             MessageService.sendMessage("/app/private-message", message);
//             setNewMessage('');
//         }
//     };

//     return (
//         <div className='conversation'>
//             {selectedConversation && selectedConversation.messages ? (
//                 selectedConversation.messages.map((message: IMessage, index: number) => (
//                     <MessageP className='chatMessage' key={index} isFromCurrentUser={message.isFromCurrentUser}>
//                         <strong>{message.sender}:</strong> {message.content}
//                     </MessageP>
//                 ))
//             ) : (
//                 <p>Aucune conversation sélectionnée</p>
//             )}
//             <form className='chatForm' onSubmit={handleNewMessageSubmit}>
//                 <input type="text" value={newMessage} onChange={handleNewMessageChange}/>
//                 <button type="submit">Envoyer</button>
//             </form>
//         </div>
//     );
// }
// export default Conversation;

//todo Fonctionnalités de base du composant conversation
//todo 3. Supprimer un message de la conversation sélectionnée (appuie long sur le message) -- gadget
//todo 4. Modifier un message de la conversation sélectionnée (appuie long sur le message) -- gadget
//todo 5. Supprimer la conversation sélectionnée (menu contextuel en haut a droite de la conversation) -- sidebar
//todo 6. Changer le type de message (texte, image, vidéo, audio, etc.) (a coté du clavier) -- gadget
//todo 7. Ajouter des fonctionnalités de recherche et de filtre pour les messages (menu contextuel en haut a droite de la conversation) -- gadget
