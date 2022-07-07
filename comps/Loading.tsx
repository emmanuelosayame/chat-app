import { Flex} from "@chakra-ui/react";
import {SpinnerDotted} from 'spinners-react'


const Loading = () => {
    return (
      <Flex h='100vh' w='full' align='center' justify='center' >
        <SpinnerDotted color="orange" />
      </Flex>
    );
}

export default Loading;