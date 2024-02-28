import { useState } from 'react';
import { CompactPicker } from 'react-color';
import { FiTrash, FiArrowLeft } from 'react-icons/fi';

import { socket } from '../../providers/socket';
import { EnumRoundType } from '../../interfaces/iRound';
import { Flex, Layout, notification, Typography, Button } from 'antd';
import { errorHandler } from '../../tools/errorHandler';
import CanvasDraw from 'react-canvas-draw';

const { Content } = Layout;
const { Title } = Typography;

interface Props {
    phrase: string;
    match_id: string;
    callbackParent: any;
    sender_id: string | null;
}

export function Draw(props: Props) {
    const [notificationApi, contextHolder] = notification.useNotification();

    async function handleSubmit(e: any) {
        e.preventDefault();
        try {
            if (canvas.getSaveData() !== null) {
                const data = {
                    match_id: props.match_id,
                    content: canvas.getSaveData(),
                    sender_id: props.sender_id,
                    type: EnumRoundType.DRAW,
                };

                socket.emit('sendRound', data);
            } else {
                const error = {
                    response: {
                        status: 400,
                        data: {
                            message: 'Please draw something',
                        },
                    },
                };
                errorHandler(error, notificationApi);
            }
        } catch (error) {
            errorHandler(error, notificationApi);
        }
    }

    const [selectedColor, setSelectedColor] = useState('#000000');
    const [selectedRadius, setSelectedRadius] = useState(5);
    const [canvas, setCanvas] = useState<any>();
    return (
        <>
            {contextHolder}
            <Content>
                <Title level={3}>Draw: {props.phrase}</Title>
                <div>
                    <CanvasDraw
                        loadTimeOffset={8}
                        brushColor={selectedColor}
                        brushRadius={selectedRadius}
                        lazyRadius={0}
                        canvasWidth={500}
                        canvasHeight={500}
                        hideGrid={false}
                        disabled={false}
                        ref={(canvasDraw) => setCanvas(canvasDraw)}
                    />
                </div>
                <Flex
                    vertical
                    style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '20px' }}
                >
                    <CompactPicker
                        color={selectedColor}
                        onChangeComplete={(color) => {
                            setSelectedColor(color.hex);
                        }}
                    />
                    <input
                        style={{ marginTop: '10px' }}
                        type="number"
                        value={selectedRadius}
                        onChange={(e) => setSelectedRadius(parseInt(e.target.value, 10))}
                    />

                    <Flex
                        style={{
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            width: '100%',
                            marginTop: '10px',
                        }}
                    >
                        <Button
                            type="primary"
                            onClick={() => {
                                canvas.undo();
                            }}
                        >
                            <FiArrowLeft /> Undo
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => {
                                canvas.clear();
                            }}
                        >
                            <FiTrash /> Clear
                        </Button>
                        <Button
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
            </Content>
        </>
    );
}
