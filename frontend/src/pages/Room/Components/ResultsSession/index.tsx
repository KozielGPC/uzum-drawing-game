import { useEffect, useState, useContext } from 'react';
import { EndMatch, Round } from '../../../../interfaces/iMatch';
import { ShowDraw } from '../../../../components/ShowDraw';
import { socket } from '../../../../providers/socket';
import { Card, Typography } from 'antd';
import { Room } from '../../../../interfaces/iRoom';
import { User } from '../../../../interfaces/iUser';
import { UserContext } from '../../../../context/UserContext';

const { Title } = Typography;
export function ResultsSession() {
    const { user, room }: { user: User | null; room: Room | null } = useContext(UserContext);

    const [activeResult, setActiveResult] = useState(0);
    const [matches, setMatches] = useState<EndMatch[]>([]);
    const [rounds, setRounds] = useState<Round[]>([]);
    const [showAdm, setShowAdm] = useState(false);

    function restartGame() {
        socket.emit('restartGame', 'macaco');
        setShowAdm(false);
    }

    function emitNext() {
        socket.emit('addShowRound');
    }

    useEffect(() => {
        let isAdm = false;
        if (room && room.room_adm_id === user?.id) {
            isAdm = true;
        } else {
            isAdm = false;
        }

        socket.on('endMatch', (data: EndMatch) => {
            if (isAdm === true) {
                setShowAdm(true);
                setMatches((matches: EndMatch[]) => [...matches, data]);
            }
        });

        socket.on('showNext', () => {
            console.log('Recebeu show next');
            console.log('matches: ', matches);

            if (matches.length !== 0) {
                setActiveResult(1);
                if (rounds.length !== matches[0].rounds.length) {
                    const nextround = matches[0].rounds[rounds.length];
                    setRounds((rounds: Round[]) => [...rounds, nextround]);
                } else {
                    matches.splice(0, 1);
                    setMatches(matches);
                    setRounds([]);
                }
            } else {
                setActiveResult(0);
            }
        });

        // const handleBeforeUnload = (event: any) => {
        //     logoff({ user_id: user?.id ?? '' });
        // };

        // window.addEventListener('beforeunload', handleBeforeUnload);

        // return () => {
        //     window.removeEventListener('beforeunload', handleBeforeUnload);
        // };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Card title="Results" style={{ margin: '20px' }}>
            {showAdm ? (
                <div className="object">
                    <h1>You have {matches.length} game to show</h1>
                    {matches.length === 0 ? (
                        <button onClick={() => restartGame()}>New game</button>
                    ) : (
                        <button onClick={() => emitNext()}>Show next</button>
                    )}
                </div>
            ) : null}
            <div>
                {activeResult === 0
                    ? null
                    : rounds.length > 0
                    ? rounds.map((result) =>
                          result.type === 'draw' ? (
                              <div>
                                  <Title level={2}>{result.sender.username + ': '}</Title>
                                  <ShowDraw draw={result.content} />
                              </div>
                          ) : (
                              <div>
                                  <div>
                                      <Title level={2}>{result.sender.username + ': '}</Title>
                                      <Title level={2}>{result.content}</Title>
                                  </div>
                              </div>
                          ),
                      )
                    : null}
            </div>
        </Card>
    );
}
