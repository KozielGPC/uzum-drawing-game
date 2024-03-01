import { Link } from 'react-router-dom';
import { Card, Col, Row, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export function Instructions() {
    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
            <Col>
                <Card title="Instructions" style={{ width: 600, height: 400, position: 'relative' }}>
                    <Title level={3}>How to Play</Title>
                    <Text>
                        <ol>
                            <li>Choose a nickname, join a room and start a game</li>
                            <li>
                                In the first round, all the players write random sentences and send them to each other
                            </li>
                            <li>After that, each one receives a sentence and draws what is written</li>
                            <li>
                                After sending the drawing, the player can receive either a sentence or a drawing. If
                                they receive a drawing, they write what they think it could be. If they receive a
                                sentence, they draw what is written
                            </li>
                            <li>
                                This continues until the final round, where the players can display the entire sequence
                                created and see what has changed in each one
                            </li>
                        </ol>
                    </Text>

                    <Link to="/" style={{ position: 'absolute', left: 20, bottom: 10 }}>
                        <ArrowLeftOutlined /> Home
                    </Link>
                </Card>
            </Col>
        </Row>
    );
}
