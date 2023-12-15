import { useContext, useEffect, useState } from 'react';
import { errorHandler } from '../../tools/errorHandler';
import socket from '../../providers/socket';
import { useMatch } from '../../hooks/useMatch';
import { useRound } from '../../hooks/useRound';
import { Button, Input, Layout, notification } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import { EnumRoundType } from '../../interfaces/iRound';

import { Room } from '../../interfaces/iRoom';
import { User } from '../../interfaces/iUser';
import { Match } from '../../interfaces/iMatch';
import { UserContext } from '../../context/UserContext';

export const InititalSubmit = () => {
    const { user, room }: { user: User | null; room: Room | null } = useContext(UserContext);
    
    const [phrase, setPhrase] = useState('');
    const { createMatch } = useMatch();

    const { createRound } = useRound();

    const [notificationApi, contextHolder] = notification.useNotification();

    const [activeInitial, setActiveInitial] = useState(1);

    async function handleCreateGame() {
        try {
            if (phrase.length === 0) {
                alert('frase vazia piá? tá loco né só pode');
            } else {
                createMatch({ room_id: room?.id ?? '', match_adm_id: user?.id ?? '', match_id: uuidv4() })
                    .then((match: Match) => {
                        createRound({
                            content: phrase,
                            match_id: match.id,
                            sender_id: user?.id ?? '',
                            type: EnumRoundType.PHRASE,
                            receiver_id: match.sort.split(',')[1],
                        })
                            .then(() => {
                                socket.emit('sendNextRound', match.id);
                            })
                            .catch((err) => {
                                throw err;
                            });
                    })
                    .then(() => {
                        setActiveInitial(0);
                        setPhrase('');
                    })
                    .catch((err) => {
                        throw err;
                    });
            }
        } catch (error) {
            errorHandler(error, notificationApi);
        }
    }

    useEffect(() => {
        socket.on('restartGame', () => {
            setActiveInitial(1);
        });
    }, []);

    return (
        <>
            {contextHolder}
            <Layout style={activeInitial === 0 ? { display: 'none' } : { display: 'flex' }}>
                <Input
                    type="text"
                    placeholder="Write a random sentence, for example, a red dog skateboarding"
                    name="phrase"
                    id="phrase"
                    onChange={(e) => setPhrase(e.target.value)}
                    value={phrase}
                />
                <Button onClick={() => handleCreateGame()} >Submit</Button>
            </Layout>
        </>
    );
};
