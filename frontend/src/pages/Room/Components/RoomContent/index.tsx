import { Layout } from 'antd';
import { InititalSubmit } from '../InititalSubmit';
import { SentencesToDraw } from '../SentencesToDraw';
import { DrawsToDescribe } from '../DrawsToDescribe';
import { ResultsSession } from '../ResultsSession';

const { Content } = Layout;

export const RoomContent = () => {
    return (
        <Content style={{ width: '100%', padding: '0px 20px' }}>
            <InititalSubmit />

            {/* {firstStart === 0 ? null : (
                <div className="object">
                    {results.length === 0 ? (
                        <button onClick={() => restartGame()}>Novo jogo</button>
                    ) : (
                        <button onClick={() => emitNext()}>Mostrar próximo</button>
                    )}
                </div>
            )} */}

            <SentencesToDraw />

            <DrawsToDescribe />

            <ResultsSession />
        </Content>
    );
};
