import { useRoom } from '../../../../hooks/useRoom';
import { useUser } from '../../../../hooks/useUser';
import { socket } from '../../../../providers/socket';
import { useHistory } from 'react-router-dom';
import { Button, Card, Flex, Typography, notification } from 'antd';
import { errorHandler } from '../../../../tools/errorHandler';
interface Props {
    nickname: string;
    roomCode: string;
    user_id: string;
    room_id: string;
}

export default function RoomInfo(props: Props) {
    const { exit } = useRoom();
    const { logoff } = useUser();
    const history = useHistory();

    const [notificationApi, contextHolder] = notification.useNotification();

    const handleLogOffButton = () => {
        exit({ room_id: props.room_id ?? '', player_id: props.user_id ?? '' })
            .then(() => logoff({ user_id: props.user_id ?? '' }))
            .then(() => {
                localStorage.clear();
                socket.emit('updateRoomPlayers', props.room_id);
                socket.emit('sendMessage', { text: 'Saiu da sala', author: props.nickname });
                history.push('/');
            })
            .catch((error) => {
                errorHandler(error, notificationApi);
            });
    };

    return (
        <>
            {contextHolder}
            <Card>
                <Flex vertical>
                    <Typography.Text>Nick: {props.nickname}</Typography.Text>
                    <Typography.Text>Room: {props.roomCode}</Typography.Text>
                    <Button
                        type="primary"
                        // loading={loading}
                        onClick={() => handleLogOffButton()}
                    >
                        Logout!
                    </Button>
                </Flex>
            </Card>
        </>
    );
}
