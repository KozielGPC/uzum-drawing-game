import { useEffect, useState } from 'react';
import { Button, Card, Layout, Typography, Flex } from 'antd';
import { socket } from '../../providers/socket';

interface Message {
    text: string;
    author: string;
}

interface Props {
    nickname: string;
}

function updateScroll() {
    var element: any = document.getElementById('chat');
    element.scrollTop = element.scrollHeight;
}

const { Content } = Layout;
const { Paragraph, Text } = Typography;

export function Chat(props: Props) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        updateScroll();
    }, [messages]);

    useEffect(() => {
        socket.on('messageReceived', async (data: Message) => {
            setMessages((messages: Message[]) => [...messages, data]);
        });
    }, []);

    async function sendMessage(e: any) {
        e.preventDefault();
        if (message.length > 0 && message.length <= 50) {
            socket.emit('sendMessage', { text: message, author: props.nickname });
            setMessage('');
        }
    }

    return (
        <Card title="Game chat">
            <Content id="chat" style={{ width: '150px', overflow: 'auto' }}>
                {messages.map((m, index) => (
                    <Paragraph key={index}>
                        <Text strong>{m.author + ': '}</Text>
                        {m.text}
                    </Paragraph>
                ))}
            </Content>
            <form onSubmit={sendMessage}>
                <Flex vertical>
                    <input
                        style={{ width: '100%', fontSize: '14px' }}
                        maxLength={50}
                        type="text"
                        name="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    ></input>
                    <Button type="primary" onClick={(e) => sendMessage(e)} style={{ marginTop: '10px' }}>
                        Send message
                    </Button>
                </Flex>
            </form>
        </Card>
    );
}
