import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { useState } from 'react';

type Props = {
    onAddNewItem: (width: string, height: string, noOfChildren: string) => void;
};

export const Form = ({ onAddNewItem }: Props) => {
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [noOfChildren, setNoOfChildren] = useState('');

    const onSubmit = () => {
        onAddNewItem(width, height, noOfChildren);
    };

    return (
        <Box padding={2}>
            <Text pb={2}>Add new Item</Text>
            <Flex align='center' justifyContent='space-between'>
                <Input
                    placeholder='Width'
                    onChange={(e) => setWidth(e.target.value)}
                    mx={1}
                />
                <Input
                    placeholder='Height'
                    onChange={(e) => setHeight(e.target.value)}
                    mx={1}
                />
                <Input
                    placeholder='No of children'
                    onChange={(e) => setNoOfChildren(e.target.value)}
                    mx={1}
                />
                <Button
                    variant='solid'
                    onClick={onSubmit}
                    minW='120px'
                    colorScheme='green'
                >
                    Submit
                </Button>
            </Flex>
        </Box>
    );
};