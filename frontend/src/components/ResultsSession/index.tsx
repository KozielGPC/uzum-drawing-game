import { useEffect, useState } from 'react';
import { EndMatch, MatchRounds, Round } from '../../interfaces/iMatch';
import ShowDraw from '../ShowDraw';
import socket from '../../providers/socket';
import { Typography } from 'antd';

const { Title } = Typography;
export const ResultsSession = () => {
    const [activeResult, setActiveResult] = useState(0);
    const [results, setResults] = useState<MatchRounds[]>([]);
    const [secondaryResults, setSecondaryResults] = useState<Round[]>([]);

    const [cu, setCu] = useState<string[]>([]);

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
        socket.on('endMatch', (data: EndMatch) => {
            setResults((results: MatchRounds[]) => [...results, data.rounds]);
        });

        socket.on('showNext', (data: any) => {
            setActiveResult(1);
            setCu([...cu, 'macaco']);
        });
    }, []);

    return (
        <div>
            {activeResult === 0
                ? null
                : secondaryResults.length > 0
                ? secondaryResults.map((result) =>
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
    );
};
