import { Box, Button } from '@chakra-ui/react';
import RGL, { WidthProvider } from 'react-grid-layout';
import { useLayoutContext } from '..';
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
    layout?: Layout[];
    setBaseLayout?: (layout: Layout[]) => void;
    itemKey: string;
    isDisabled: boolean;
};

const renderLayout = (
    layout: Layout[],
    isDisabled: boolean,
    onAddNested: (itemKey: string) => void,
    setBaseLayout?: (layout: Layout[]) => void
) => {
    return layout.map((item) => {
        return (
            <div key={item.i}>
                {!!item.layout?.length && (
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
                {!item.layout?.length && (
                    <Box>
                        <Button onClick={() => onAddNested(item.i)}>Add</Button>
                        <span className='text'>{item.i}</span>
                    </Box>
                )}
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

const findDeep = (array: Layout[], key: string): Layout | undefined => {
    const result = array.find((item) => item.i === key);
    if (result) {
        return result;
    }
    for (const item of array) {
        if (item.layout) {
            const found = findDeep(item.layout, key);
            if (found) {
                return found;
            }
        }
    }
};

const mergeDeep = (
    array: Layout[],
    key: string,
    newObject: Layout
): Layout[] => {
    const result = findDeep(array, key);

    if (result) {
        return array.map((item: Layout) => {
            if (item.i === key) {
                return { ...item, layout: [...(item?.layout ?? []), newObject] };
            }

            if (item.layout) {
                return {
                    ...item,
                    layout: mergeDeep(item.layout, key, newObject),
                };
            }

            return item;
        });
    }

    return array;
};

export const LayoutGrid = (props: LayoutGridProps) => {
    const { baseLayout } = useLayoutContext();

    function onLayoutChange(newLayout: Layout[], itemKey?: string) {
        if (!itemKey) {
            props.setBaseLayout?.(mergeArrays(props?.layout || [], newLayout));
        }
    }

    const onAddNested = (itemKey: string) => {
        const layout = findDeep(baseLayout, itemKey);

        const newLayout = mergeDeep(baseLayout, itemKey, {
            i: `grid-nested-${props.itemKey}-${itemKey}-${layout?.layout?.length || '0'
                }`,
            x: 1,
            y: Infinity,
            w: 1,
            h: 1,
        });

        props?.setBaseLayout?.(newLayout);
    };

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
            width={1200}
            verticalCompact
        >
            {renderLayout(
                props?.layout || [],
                props.isDisabled,
                onAddNested,
                props.setBaseLayout
            )}
        </ReactGridLayout>
    );
};