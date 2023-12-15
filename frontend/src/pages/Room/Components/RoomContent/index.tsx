import { socket } from '../../../../providers/socket';

import { MatchRounds } from '../../../../interfaces/iMatch';

import { useContext, useEffect, useState } from 'react';
import { Room } from '../../../../interfaces/iRoom';
import { User } from '../../../../interfaces/iUser';

import { useUser } from '../../../../hooks/useUser';
import { InititalSubmit } from '../InititalSubmit';
import { SentencesToDraw } from '../SentencesToDraw';
import { DrawsToDescribe } from '../DrawsToDescribe';
import { ResultsSession } from '../ResultsSession';
import { UserContext } from '../../../../context/UserContext';

const RoomContent = () => {
    const { logoff } = useUser();
    const { user, room }: { user: User | null; room: Room | null } = useContext(UserContext);

    const [results, setResults] = useState<MatchRounds[]>([]);

    const [showAdm, setShowAdm] = useState(false);

    function emitNext() {
        socket.emit('addShowRound', 'macaco');
    }

    function restartGame() {
        socket.emit('restartGame', 'macaco');
        setShowAdm(false);
        setFirstStart(0);
    }

    const [firstStart, setFirstStart] = useState(0);

    useEffect(() => {
        let isAdm = false;
        if (room && room.room_adm_id === user?.id) {
            isAdm = true;
        } else {
            isAdm = false;
        }

        socket.on('endMatch', () => {
            if (isAdm === true) {
                setShowAdm(true);
            }
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
        <div className="content">
            <InititalSubmit />

            {firstStart === 0 ? null : (
                <div className="object">
                    {results.length === 0 ? (
                        <button onClick={() => restartGame()}>Novo jogo</button>
                    ) : (
                        <button onClick={() => emitNext()}>Mostrar próximo</button>
                    )}
                </div>
            )}

            <SentencesToDraw />

            <DrawsToDescribe />

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

            <ResultsSession />
        </div>
    );
};

export default RoomContent;
