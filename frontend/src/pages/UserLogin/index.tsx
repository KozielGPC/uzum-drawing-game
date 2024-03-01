import { useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useRoom } from '../../hooks/useRoom';
import { useUser } from '../../hooks/useUser';
import { socket } from '../../providers/socket';
import { Form, Input, Button, Card, Col, Row, notification, Typography } from 'antd';

import { UserContext } from '../../context/UserContext';
import { errorHandler } from '../../tools/errorHandler';

export function UserLogin() {
    const history = useHistory();
    const [form] = Form.useForm();
    const { setRoom, setUser } = useContext(UserContext);
    const { login } = useUser();
    const { join } = useRoom();

    const [notificationApi, contextHolder] = notification.useNotification();

    const onFinish = async (values: any) => {
        try {
            const user_data = await login({ username: values.nickname });
            const room_data = await join({ room_code: values.roomCode, user_id: user_data.id });

            setUser(user_data);
            setRoom(room_data.room);
            history.push('/play');

            socket.emit('updateRoomPlayers', room_data.room.id);
            socket.emit('sendMessage', { text: 'Entrou na sala', author: values.nickname });
        } catch (error) {
            errorHandler(error, notificationApi);
        }
    };

    return (
        <>
            {contextHolder}
            <Row justify="center" align="middle" style={{ height: '20vh' }}>
                <Col>
                    <Typography.Title>UZUM DRAWING GAME</Typography.Title>
                </Col>
            </Row>
            <Row justify="center" align="middle">
                <Col>
                    <Card title="Login" style={{ width: 350, height: 300, marginTop: 50 }}>
                        <Form form={form} onFinish={onFinish} initialValues={{ nickname: '', roomCode: '' }}>
                            <Form.Item
                                name="nickname"
                                rules={[{ required: true, message: 'Please enter your nickname!' }]}
                            >
                                <Input placeholder="Nickname" />
                            </Form.Item>

                            <Form.Item
                                name="roomCode"
                                rules={[{ required: true, message: 'Please enter the room code!' }]}
                            >
                                <Input placeholder="Room Code" />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" block>
                                    Login
                                </Button>
                            </Form.Item>
                        </Form>

                        <Link to="/instructions">How to play</Link>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
