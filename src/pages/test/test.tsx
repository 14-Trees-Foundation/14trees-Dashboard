import Collapsible from './Collapsible';
import { TestUser } from './TestUser';
import { TestTree } from './TestTree';
import { TestPlot } from './TestPlot';
import { TestPond } from './TestPond';
//import { TestTreeType } from './TestTreeType';

export const Test = () => {

    return (
        <>
            <br />
            <Collapsible title='User' ><TestUser/></Collapsible>
            <br />
            <Collapsible title='Tree' ><TestTree/></Collapsible>
            <br />
          {/*  <Collapsible title='TreeType' ><TestTreeType/></Collapsible> */}
            <br />
            <Collapsible title='Pond' ><TestPond/></Collapsible>
            <br />
            <Collapsible title='Plot' ><TestPlot/></Collapsible>
            <br />

        </>
    );
}
