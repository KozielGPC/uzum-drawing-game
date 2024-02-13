import { useContext, useEffect, useState } from 'react';

import { socket } from '../../providers/socket';

import { Room, RoomPlayers } from '../../interfaces/iRoom';
import { User } from '../../interfaces/iUser';

import { api } from '../../providers/api';
import { Chat } from '../../components/Chat';
import { RoomInfo } from './Components/RoomInfo';
import UsersList from '../../components/UsersList';
import EmotesList from '../../components/EmotesList';
import { UserContext } from '../../context/UserContext';
import { useHistory } from 'react-router-dom';
import { Col, Layout, Row } from 'antd';
import { RoomContent } from './Components/RoomContent';
export default function RoomPage() {
    const { user, room }: { user: User | null; room: Room | null } = useContext(UserContext);

    const [players, setPlayers] = useState<RoomPlayers | null>(null);

    const [admNick, setAdmNick] = useState('');

    const history = useHistory();

    async function getPlayers() {
        const response = await api.get<RoomPlayers>(`/room/${room?.id}/players`);
        const room_players = response.data;

        setPlayers(room_players);
    }

    useEffect(() => {
        setAdmNick(room?.room_adm?.username ?? '');

        getPlayers();
    }, [room]);

    useEffect(() => {
        socket.on('updatePlayers', async (data) => {
            setPlayers(data);
        });
    }, []);

    // if (room === null || user === null) {
    //     history.push('/');
    // }
    return (
        <Row justify="center" align="middle">
            <Col style={{ width: '100%', padding: '20px' }} span={24}>
                <Row>
                    <Col span={6}>
                        <Layout>
                            <RoomInfo
                                nickname={user?.username ?? 'nickname'}
                                roomCode={room?.room_code ?? 'roomCode'}
                                room_id={room?.id ?? ''}
                                user_id={user?.id ?? ''}
                            />
                            <Chat nickname={user?.username ?? 'nickname'} />
                        </Layout>
                    </Col>
                    <Col span={12}>
                        <RoomContent />
                    </Col>
                    <Col span={6}>
                        <UsersList adm_nick={admNick ?? ''} players={players ?? { users: [], room_adm: user }} />
                        <EmotesList />
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}
