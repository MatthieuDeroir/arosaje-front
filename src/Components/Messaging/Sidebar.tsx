import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import '../../Styles/App.css';
import { IConversation } from './Conversation';
import {ConversationContext} from "./ConversationContext";
import { USERS, CONVERSATIONS } from '../../routes';
import { AuthContext } from '../../Contexts/AuthContext';
import { User } from '../../Interfaces/User';
import { Plant } from '../../Interfaces/Plant';
import { conversations } from './mockData';

interface SidebarProps {
    isconversationselected: boolean;
}

const SidebarDiv = styled.div<{ isconversationselected: boolean }>`
    overflow-y: auto;
    padding: 20px;
    @media (min-width: 768px) {
        width: ${props => (props.isconversationselected ? '300px' : '15%')};
    }

    @media (max-width: 767px) {
        width: 100%;
    }
`;

const RecipientPhoto = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
`;

const RecipientName = styled.h2`
    margin: 0;
`;

const RecipientDiv = styled.div<{ isSelected: boolean }>`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    border: ${props => (props.isSelected ? '2px solid red' : '1px solid #ddd')};
    gap: 10px;
`;

const Sidebar: React.FC<SidebarProps> = ({isconversationselected}) => {
    const [selectedConversation_, setSelectedConversation] = useState<IConversation | null>(null);
    const [conversations, setConversations] = useState<IConversation[]>([]);
    const [showBotanistButton, setShowBotanistButton] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
    const context = useContext(ConversationContext);
    const authContext = useContext(AuthContext);

    const BOTANIST_ROLE_ID = 2;
    const BOTANIST_ID = 3;

    useEffect(() => {
        if (authContext && authContext.user) {
            const user: User = authContext.user;

            fetch(USERS.ID(user.id))
                .then(response => response.json())
                .then(data => {
                    if (data.role_id !== BOTANIST_ROLE_ID) {
                        setShowBotanistButton(true);
                    }
                });

            fetch(CONVERSATIONS.SEARCH.findByUser2Id(user.id))
                .then(response => response.json())
                .then(data => setConversations(data));
        }
    }, [authContext]);

    const handleSelectConversation = (conversation: IConversation) => {
        setSelectedConversation(conversation);
        if (context) {
            context.setSelectedConversation(conversation);
        }
    };

    const handleDeleteConversation = (id: number) => {
        const updatedConversations = conversations.filter(conversation => conversation.id !== id);
        setConversations(updatedConversations);
    };

    const handleContactBotanist = (plant: Plant) => {
        if (authContext && authContext.user) {
            const user: User = authContext.user;

            const newConversation = {
                id: 0,
                user1_id: user.id,
                user2_id: BOTANIST_ID,
                messages: [{
                    sender: user.username,
                    content: `Plant Information: ${JSON.stringify(plant)}`,
                    isFromCurrentUser: true,
                }],
            };

            fetch(CONVERSATIONS.URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newConversation),
            });
        }
    };

    const [selectedConversationId, setSelectedConversationId] = useState<number|null> (null);

    const selectedConversation = conversations.find(convo => convo.id === selectedConversationId);
  
    
    return (
        <SidebarDiv isconversationselected={isconversationselected}>
            {showBotanistButton && selectedPlant && (
                <button onClick={() => handleContactBotanist(selectedPlant)}>Contact a Botanist</button>
            )}
            {conversations.length > 0 ? (
                conversations.map((conversation: IConversation) => (
                    <div className="conversations-list">
                        {conversations.map(convo => (
                        <div key={convo.id} onClick={() => setSelectedConversationId(convo.id)}>
                            Conversation {convo.id}
                        </div>
                        ))}
                    </div>
                    // <RecipientDiv
                    //     key={conversation.id}
                    //     onClick={() => handleSelectConversation(conversation)}
                    //     isSelected={selectedConversation?.id === conversation.id}
                    // >
                    //     <RecipientPhoto src={conversation.recipient.photoUrl} alt={conversation.recipient.name}/>
                    //     <RecipientName>{conversation.recipient.name}</RecipientName>
                    //     <button onClick={(e) => {e.stopPropagation(); handleDeleteConversation(conversation.id);}}>Supprimer</button>
                    // </RecipientDiv>
                ))
            ) : (
                <p>Il n'y a pas de conversations</p>
            )}
        </SidebarDiv>
    );
}

export default Sidebar;

//todo Fonctionnalités de base du composant Sidebar
//todo 1. Afficher la liste des conversations
//todo 3. Supprimer une conversatio
//todo 4. Rechercher une conversatin
//todo 5. Filtrer les conversationspar type de message
//todo 6. Filtrer les conversations par date