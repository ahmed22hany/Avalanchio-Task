import RGL, { WidthProvider } from 'react-grid-layout';
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';

const ReactGridLayout = WidthProvider(RGL);

export type Layout = {
    x: number;
    y: number;
    w: number;
    h: number;
    i: string;
    minW?: number;
    minH?: number;
    layout?: Layout[];
};

type LayoutGridProps = {
    layout: Layout[];
    setBaseLayout: (layout: Layout[]) => void;
    itemKey: string;
    isDisabled: boolean;
};

const renderLayout = (
    layout: Layout[],
    isDisabled: boolean,
    setBaseLayout: (layout: Layout[]) => void
) => {
    return layout.map((item) => {
        return (
            <div key={item.i}>
                {item.i.startsWith('grid-') && !!item?.layout?.length && (
                    <>
                        <span>{item.i}</span>
                        <LayoutGrid
                            layout={item.layout}
                            itemKey={item.i}
                            isDisabled={isDisabled}
                            setBaseLayout={setBaseLayout}
                        />
                    </>
                )}
                {!item.i.startsWith('grid-') &&
                    <div>
                        <span className='text'>{item.i}</span>
                        <p>Dummy Text</p>
                    </div>
                }
            </div>
        );
    });
};

function mergeArrays(arr1: Layout[], arr2: Layout[]) {
    if (arr1.length !== arr2.length) {
        throw new Error('Arrays must have the same length.');
    }

    const finalArray = [];

    for (let i = 0; i < arr1.length; i++) {
        const mergedObject = { ...arr1[i], ...arr2[i] };
        finalArray.push(mergedObject);
    }

    return finalArray;
}

export const LayoutGrid = (props: LayoutGridProps) => {
    function onLayoutChange(newLayout: Layout[], itemKey?: string) {
        if (!itemKey) {
            props.setBaseLayout(mergeArrays(props.layout, newLayout));
            return;
        }

        const layout = props.layout;
        const itemIndex = layout.findIndex((item) => item.i === itemKey);

        if (itemIndex !== -1) {
            props.setBaseLayout?.([
                ...layout.slice(0, itemIndex),
                {
                    ...layout[itemIndex],
                    layout: newLayout,
                },
                ...layout.slice(itemIndex + 1),
            ]);
        }
    }

    return (
        <ReactGridLayout
            onDragStart={(a, b, c, d, e) => e.stopPropagation()}
            layout={props.layout}
            onLayoutChange={(newLayout) => onLayoutChange(newLayout, props.itemKey)}
            className='layout'
            rowHeight={30}
            cols={8}
            isResizable={!props.isDisabled}
            isDraggable={!props.isDisabled}
            margin={[5, 5]}
            autoSize
            width={1200}
        >
            {renderLayout(props.layout, props.isDisabled, props.setBaseLayout)}
        </ReactGridLayout>
    );
};