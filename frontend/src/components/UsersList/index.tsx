import { RoomPlayers } from '../../interfaces/iRoom';
import { List, Card, Layout } from 'antd';
import './styles.css'

interface Props {
    players: RoomPlayers;
    adm_nick: string;
}

const { Content } = Layout;

export function UsersList(props: Props) {
    return (
        <Card title="Users">
            <Content>
                <List 
                    split={false}
                    itemLayout="vertical"
                    dataSource={props.players?.users}
                    renderItem={(item) => (
                        <List.Item key={item.user_id} style={{ padding: '0px'}}> 
                            {props.adm_nick === item.user.username ? (
                                <span className="admin">{item.user.username} </span>
                            ) : (
                                <span className="player">{item.user.username} </span>
                            )}
                        </List.Item>
                    )}
                />
            </Content>
        </Card>
    );
}
