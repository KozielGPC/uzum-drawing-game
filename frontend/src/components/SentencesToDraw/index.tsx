import { useContext, useEffect, useState } from 'react';
import { Content, EnumRoundType, ReceivingRound } from '../../interfaces/iRound';
import Draw from '../Draw';
import socket from '../../providers/socket';
import { User } from '../../interfaces/iUser';
import { Typography } from 'antd';
import { UserContext } from '../../context/UserContext';

const { Title } = Typography;
export const SentencesToDraw = () => {
    const { user }: { user: User | null } = useContext(UserContext);
    const [phrases, setPhrases] = useState<Content[]>([]);

    function deleteLastPhrase(id: number) {
        setPhrases(phrases.filter((phrase_filter) => phrase_filter.id !== id));
    }

    useEffect(() => {
        socket.on('receiveRound', async (data: ReceivingRound) => {
            if (data.receiver_id === user?.id) {
                switch (data.type) {
                    case EnumRoundType.PHRASE:
                        setPhrases((phrases) => [
                            ...phrases,
                            { content: data.content, match_id: data.match_id, id: phrases.length },
                        ]);
                        break;
                    default:
                        break;
                }
            }
        });
    }, []);

    return (
        <div>
            <Title level={1}>You have {phrases.length} sentences to draw</Title>
            {phrases.map((phrase) => (
                <div>
                    <Draw
                        sender_id={user?.id ?? ''}
                        phrase={phrase.content}
                        match_id={phrase.match_id}
                        callbackParent={() => deleteLastPhrase(phrase.id)}
                    />
                </div>
            ))}
        </div>
    );
};
