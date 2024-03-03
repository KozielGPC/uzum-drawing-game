import { useEffect, useState, useContext } from 'react';
import { ShowDraw } from '../../../../components/ShowDraw';
import { socket } from '../../../../providers/socket';
import { Card, Typography } from 'antd';
import { Room } from '../../../../interfaces/iRoom';
import { User } from '../../../../interfaces/iUser';
import { UserContext } from '../../../../context/UserContext';
import { api } from '../../../../providers/api';
import { Round } from '../../../../interfaces/iMatch';

const { Title } = Typography;

interface Match {
    id: string;
    rounds: Round[];
}

export function ResultsSession() {
    const { isAdmin }: { user: User | null; room: Room | null; isAdmin: boolean } = useContext(UserContext);

    const [activeResult, setActiveResult] = useState(false);
    const [matches, setMatches] = useState<Match[]>([]);
    const [rounds, setRounds] = useState<Round[]>([]);
    const [showAdm, setShowAdm] = useState(false);

    async function getMatchRounds(match_id: string) {
        const response = await api.get<any>(`/match/${match_id}/rounds`);
        const match_rounds = response.data;

        const match: Match = {
            id: match_id,
            rounds: match_rounds,
        };

        const newMatches = [...matches, match];
        setMatches(newMatches);
    }

    function restartGame() {
        socket.emit('restartGame', 'macaco');
        setShowAdm(false);
    }

    function emitNext() {
        socket.emit('addShowRound');
    }

    useEffect(() => {
        socket.on('endMatch', async (match_id: string) => {
            if (isAdmin) {
                setShowAdm(true);
            }
            await getMatchRounds(match_id);
        });

        socket.on('showNext', () => {
            if (matches.length > 0) {
                setActiveResult(true);
                const match = matches[0];
                if (match.rounds.length > 0) {
                    const nextRound = match.rounds.shift();
                    if (nextRound) {
                        setRounds([nextRound]);
                    }
                    setMatches([...matches]); 
                } else {
                    setMatches(matches.slice(1));
                    setRounds([]);
                }
            } else {
                setActiveResult(false);
            }
        });

        return () => {
            socket.off('endMatch');
            socket.off('showNext');
        };
    }, [isAdmin, matches]);

    return (
        <Card title="Results" style={{ margin: '20px' }}>
            {showAdm && (
                <div className="object">
                    <h1>You have {matches.length} game to show</h1>
                    <button onClick={restartGame}>New game</button>
                    <button onClick={emitNext}>Show next</button>
                </div>
            )}
            <div>
                {activeResult &&
                    rounds.map((result, index) => (
                        <div key={index}>
                            {result.type === 'draw' ? (
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
                            )}
                        </div>
                    ))}
            </div>
        </Card>
    );
}
