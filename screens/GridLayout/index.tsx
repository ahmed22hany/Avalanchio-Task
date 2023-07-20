import { Box, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { Form } from './components/Form';
import { Layout, LayoutGrid } from './components/Grid';

const generateChildrenLayout = (noOfChildren: string) => {
    return new Array(Number(noOfChildren)).fill(0).map((_, index) => ({
        i: `${index}`,
        x: (index * 2) % 12,
        y: Infinity,
        w: 2,
        h: 2,
    }));
};

export default function GridLayout() {
    const [baseLayout, setBaseLayout] = useState<Layout[]>([]);
    const [isDisabled, setDisabled] = useState(false);
    const [count, setCount] = useState(0);

    const onAddNewItem = (
        width: string,
        height: string,
        noOfChildren: string
    ) => {
        setCount(count + 1);
        const childrenLayout =
            Number(noOfChildren) > 0 ? generateChildrenLayout(noOfChildren) : [];
        setBaseLayout([
            ...baseLayout,
            {
                i: `${childrenLayout.length ? 'grid-' : ''}${count}`,
                x: (baseLayout.length * 2) % 12,
                y: 0,
                w: Number(width) / 97,
                h: Number(height) / 30,
                minW: Number(width) / 97,
                minH: Number(height) / 30,
                layout: childrenLayout,
            },
        ]);
    };

    return (
        <Box>
            <Form onAddNewItem={onAddNewItem} />
            <Button
                onClick={() => setDisabled((isDisabled) => !isDisabled)}
                margin={2}
            >
                {isDisabled ? 'Enable Edit' : 'Disable Edit'}
            </Button>
            <Button onClick={() => setBaseLayout([])} margin={2} colorScheme='red'>
                Clear
            </Button>
            <LayoutGrid
                layout={baseLayout}
                itemKey={''}
                setBaseLayout={setBaseLayout}
                isDisabled={isDisabled}
            />
        </Box>
    );
}