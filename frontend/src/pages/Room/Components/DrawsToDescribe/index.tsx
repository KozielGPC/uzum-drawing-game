import { useContext, useEffect, useState } from 'react';
import { Content, EnumRoundType, ReceivingRound } from '../../../../interfaces/iRound';
import { socket } from '../../../../providers/socket';
import { User } from '../../../../interfaces/iUser';
import Answer from '../../../../components/Answer';
import { Card, Typography } from 'antd';
import { UserContext } from '../../../../context/UserContext';

const { Title } = Typography;
export const DrawsToDescribe = () => {
    const { user }: { user: User | null } = useContext(UserContext);
    const [draws, setDraws] = useState<Content[]>([]);

    function deleteLastDraw(id: number) {
        setDraws(draws.filter((draw_filter) => draw_filter.id !== id));
    }

    useEffect(() => {
        socket.on('receiveRound', async (data: ReceivingRound) => {
            if (data.receiver_id === user?.id) {
                switch (data.type) {
                    case EnumRoundType.DRAW:
                        setDraws((draws) => [
                            ...draws,
                            { content: data.content, match_id: data.match_id, id: draws.length },
                        ]);
                        break;
                    default:
                        break;
                }
            }
        });
    }, []);

    return (
        <Card title="Sentences" style={{ margin: '20px' }}>
            <div style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Title level={1}>You have {draws.length} drawings to describe</Title>
                {draws.map((draw) => (
                    <Answer
                        sender_id={user?.id ?? ''}
                        draw={draw.content}
                        callbackParent={() => deleteLastDraw(draw.id)}
                        match_id={draw.match_id}
                    />
                ))}
            </div>
        </Card>
    );
};
