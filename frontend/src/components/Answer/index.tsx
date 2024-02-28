import { useState } from 'react';
import ShowDraw from '../../components/ShowDraw';
import { errorHandler } from '../../tools/errorHandler';
import { socket } from '../../providers/socket';
import { EnumRoundType } from '../../interfaces/iRound';
import { Flex, Layout, notification, Typography, Button } from 'antd';

interface Props {
    draw: string;
    match_id: string;
    callbackParent: any;
    sender_id: string | null;
}

export default function Answer(props: Props) {
    const [phrase, setPhrase] = useState('');
    const [notificationApi, contextHolder] = notification.useNotification();

    async function handleSubmit(e: any) {
        e.preventDefault();
        try {
            if (phrase !== null) {
                const data = {
                    match_id: props.match_id,
                    content: phrase,
                    sender_id: props.sender_id,
                    type: EnumRoundType.PHRASE,
                };

                socket.emit('sendRound', data);
            } else {
                const error = {
                    response: {
                        status: 400,
                        data: {
                            message: 'Please write something',
                        },
                    },
                };
                errorHandler(error, notificationApi);
            }
        } catch (error) {
            errorHandler(error, notificationApi);
        }
    }

    return (
        <>
            {contextHolder}
            <Flex vertical>
                <ShowDraw draw={props.draw} />
                <Flex
                    style={{ marginTop: '20px', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <input
                        type="text"
                        placeholder="What do you think this represents?"
                        name="answer"
                        id="answer"
                        value={phrase}
                        onChange={(e) => setPhrase(e.target.value)}
                        style={{ width: '70%' }}
                    />
                    <Button
                        style={{ width: '20%' }}
                        type="primary"
                        htmlType="submit"
                        onClick={(e) => {
                            handleSubmit(e);
                            props.callbackParent();
                        }}
                    >
                        Send!
                    </Button>
                </Flex>
            </Flex>
        </>
    );
}
