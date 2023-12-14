import socket from '../../providers/socket';
import { useMatch } from '../../hooks/useMatch';
import { useRound } from '../../hooks/useRound';
import Draw from '../../components/Draw';
import Answer from '../../components/Answer';
import ShowDraw from '../../components/ShowDraw';
import { v4 as uuidv4 } from 'uuid';

import { Match } from '../../interfaces/iMatch';
import { EndMatch, MatchRounds, Round } from '../../interfaces/iMatch';
import { Content, EnumRoundType, ReceivingRound } from '../../interfaces/iRound';

import React, { useEffect, useState } from 'react';
import { errorHandler } from '../../tools/errorHandler';
import { notification } from 'antd';
import { Room } from '../../interfaces/iRoom';
import { User } from '../../interfaces/iUser';

import { useUser } from '../../hooks/useUser';
interface Props {
    room: Room | null;
    user: User | null;
}

const RoomContent = ({ room, user }: Props) => {
    const { createMatch } = useMatch();
    const { createRound } = useRound();
    const { logoff } = useUser();

    const [phrases, setPhrases] = useState<Content[]>([]);

    const [draws, setDraws] = useState<Content[]>([]);

    const [results, setResults] = useState<MatchRounds[]>([]);
    const [secondaryResults, setSecondaryResults] = useState<Round[]>([]);

    const [showAdm, setShowAdm] = useState(false);

    function deleteLastPhrase(id: number) {
        setPhrases(phrases.filter((phrase_filter) => phrase_filter.id !== id));
    }

    function deleteLastDraw(id: number) {
        setDraws(draws.filter((draw_filter) => draw_filter.id !== id));
    }

    function emitNext() {
        socket.emit('addShowRound', 'macaco');
    }

    function restartGame() {
        socket.emit('restartGame', 'macaco');
        setShowAdm(false);
        setFirstStart(0);
    }

    const [phrase, setPhrase] = useState('');

    const [activeInitial, setActiveInitial] = useState(1);
    const [activeResult, setActiveResult] = useState(0);

    const [firstStart, setFirstStart] = useState(0);

    const [notificationApi, contextHolder] = notification.useNotification();

    const [cu, setCu] = useState<string[]>([]);

    async function handleCreateGame() {
        try {
            if (phrase.length === 0) {
                alert('frase vazia piá? tá loco né só pode');
            } else {
                return Promise.resolve(
                    createMatch({ room_id: room?.id ?? '', match_adm_id: user?.id ?? '', match_id: uuidv4() }),
                )
                    .then(async (match: Match) => {
                        await createRound({
                            content: phrase,
                            match_id: match.id,
                            sender_id: user?.id ?? '',
                            type: EnumRoundType.PHRASE,
                            receiver_id: match.sort.split(',')[1],
                        });
                        socket.emit('sendNextRound', match.id);
                    })
                    .then(() => {
                        setActiveInitial(0);
                        setPhrase('');
                    })
                    .catch((err) => {
                        throw err;
                    });
            }
        } catch (error) {
            errorHandler(error, notificationApi);
        }
    }

    // logic to show game sequence
    useEffect(() => {
        if (results.length !== 0) {
            setActiveResult(1);
            if (secondaryResults.length !== results[0].rounds.length) {
                const nextround = results[0].rounds[secondaryResults.length];
                setSecondaryResults((secondaryResults: Round[]) => [...secondaryResults, nextround]);
            } else {
                results.splice(0, 1);
                setResults(results);
                setSecondaryResults([]);
                if (results.length === 0) {
                    setActiveResult(0);
                }
            }
        }
    }, [cu]);

    useEffect(() => {
        let isAdm = false;
        if (room && room.room_adm_id === user?.id) {
            isAdm = true;
        } else {
            isAdm = false;
        }
        socket.on('receiveRound', async (data: ReceivingRound) => {
            if (data.receiver_id === user?.id) {
                switch (data.type) {
                    case EnumRoundType.PHRASE:
                        setPhrases((phrases) => [
                            ...phrases,
                            { content: data.content, match_id: data.match_id, id: phrases.length },
                        ]);
                        break;

                    case EnumRoundType.DRAW:
                        setDraws((draws) => [
                            ...draws,
                            { content: data.content, match_id: data.match_id, id: phrases.length },
                        ]);
                        break;
                    default:
                        break;
                }
            }
        });

        socket.on('endMatch', (data: EndMatch) => {
            setResults((results: MatchRounds[]) => [...results, data.rounds]);

            if (isAdm === true) {
                setShowAdm(true);
            }
        });

        socket.on('showNext', (data: any) => {
            setActiveResult(1);
            setCu([...cu, 'macaco']);
        });

        socket.on('restartGame', (data: any) => {
            setActiveInitial(1);
        });

        const handleBeforeUnload = (event: any) => {
            logoff({ user_id: user?.id ?? '' });
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return (
        <>
            {contextHolder}
            <div className="content">
                <div className="object" style={activeInitial === 0 ? { display: 'none' } : { display: 'flex' }}>
                    <input
                        type="text"
                        placeholder="Write a random sentence, for example, a red dog skateboarding"
                        name="phrase"
                        id="phrase"
                        onChange={(e) => setPhrase(e.target.value)}
                        value={phrase}
                    />
                    <button type="submit" onClick={() => handleCreateGame()}>
                        Submit
                    </button>
                </div>

                {firstStart === 0 ? null : (
                    <div className="object">
                        {results.length === 0 ? (
                            <button onClick={() => restartGame()}>Novo jogo</button>
                        ) : (
                            <button onClick={() => emitNext()}>Mostrar próximo</button>
                        )}
                    </div>
                )}

                <h1>You have {phrases.length} sentences to draw</h1>
                {phrases.map((phrase) => (
                    <div className="object">
                        <Draw
                            sender_id={user?.id ?? ''}
                            phrase={phrase.content}
                            match_id={phrase.match_id}
                            callbackParent={() => deleteLastPhrase(phrase.id)}
                        />
                    </div>
                ))}

                <h1>You have {draws.length} drawings to describe</h1>
                {draws.map((draw) => (
                    <div className="object">
                        <Answer
                            sender_id={user?.id ?? ''}
                            draw={draw.content}
                            callbackParent={() => deleteLastDraw(draw.id)}
                            match_id={draw.match_id}
                        />
                    </div>
                ))}

                {showAdm ? (
                    <div className="object">
                        <h1>You have {results.length} game to show</h1>
                        {results.length === 0 ? (
                            <button onClick={() => restartGame()}>New game</button>
                        ) : (
                            <button onClick={() => emitNext()}>Show next</button>
                        )}
                    </div>
                ) : null}

                <div className="show-result">
                    {activeResult === 0
                        ? null
                        : secondaryResults.length > 0
                        ? secondaryResults.map((result) =>
                              result.type === 'draw' ? (
                                  <div className="render">
                                      <h2 className="name">{result.sender.username + ': '}</h2>
                                      <ShowDraw draw={result.content} />
                                  </div>
                              ) : (
                                  <div className="render">
                                      <div className="inline">
                                          <h2 className="name">{result.sender.username + ': '}</h2>
                                          <h2 className="phrase-content">{result.content}</h2>
                                      </div>
                                  </div>
                              ),
                          )
                        : null}
                </div>
            </div>
        </>
    );
};

export default RoomContent;
