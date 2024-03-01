import CanvasDraw from 'react-canvas-draw';

interface Props {
    draw: string;
}

export function ShowDraw(props: Props) {
    return (
        <div>
            <div>
                <CanvasDraw
                    canvasWidth={538}
                    canvasHeight={538}
                    disabled={true}
                    hideGrid={true}
                    brushRadius={0.01}
                    lazyRadius={0}
                    saveData={props.draw}
                    immediateLoading={true}
                    brushColor={'#FFFFFF'}
                    hideInterface={true}
                />
            </div>
        </div>
    );
}
