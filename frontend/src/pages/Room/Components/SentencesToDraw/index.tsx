import { useContext, useEffect, useState } from 'react';
import { Content, EnumRoundType, ReceivingRound } from '../../../../interfaces/iRound';
import Draw from '../../../../components/Draw';
import { socket } from '../../../../providers/socket';
import { User } from '../../../../interfaces/iUser';
import { Card, Typography } from 'antd';
import { UserContext } from '../../../../context/UserContext';

const { Title } = Typography;
export const SentencesToDraw = () => {
    const { user }: { user: User | null } = useContext(UserContext);
    const [phrases, setPhrases] = useState<Content[]>([
        {
            content: 'first phrase',
            id: 0,
            match_id: '1d7a5852-bc0e-4fd2-a651-fa1ab14c99bd',
        },
    ]);

    function deleteLastPhrase(id: number) {
        setPhrases(phrases.filter((phrase_filter) => phrase_filter.id !== id));
    }

    useEffect(() => {
        console.log('phrases', phrases);
    }, [phrases]);

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
        <Card title="Draws" style={{ margin: '20px' }}>
            <div style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Title level={1}>You have {phrases.length} sentences to draw</Title>
                {phrases.map((phrase) => (
                    <Draw
                        sender_id={user?.id ?? ''}
                        phrase={phrase.content}
                        match_id={phrase.match_id}
                        callbackParent={() => deleteLastPhrase(phrase.id)}
                    />
                ))}
            </div>
        </Card>
    );
};
