import { Box } from '@radix-ui/themes';
import {Skeleton} from '@/app/component'

const newIssueLodingPage = () => {
   return(
    <Box className='max-w-xl'>
      <Skeleton/>
      <Skeleton height="20rem"/>
    </Box>
   )
}

export default newIssueLodingPage