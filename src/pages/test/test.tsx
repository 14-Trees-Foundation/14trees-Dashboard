import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
// import AddUser from './AddUser';
import * as userActionCreators from '../../redux/actions/userActions';
import * as treeTypeActionCreators from '../../redux/actions/treeTypeActions';
import * as plotActionCreators from '../../redux/actions/plotActions';
import * as treeActionCreators from '../../redux/actions/treeActions';
import * as pondActionCreators from '../../redux/actions/pondActions';
import {bindActionCreators} from 'redux';
import {useAppDispatch, useAppSelector} from '../../redux/store/hooks';
import { RootState } from '../../redux/store/store';
import { User } from '../../types/user';
import { Button, Input } from '@mui/material';
import { Pond } from '../../types/pond';
import Collapsible from './Collapsible';
import { TestUser } from './TestUser';
import { TestTree } from './TestTree';
import { TestPlot } from './TestPlot';
import { TestPond } from './TestPond';
import { TestTreeType } from './TestTreeType';

export const Test = () => {

    return (
        <>
            <br />
            <Collapsible title='User' ><TestUser/></Collapsible>
            <br />
            <Collapsible title='Tree' ><TestTree/></Collapsible>
            <br />
            <Collapsible title='TreeType' ><TestTreeType/></Collapsible>
            <br />
            <Collapsible title='Pond' ><TestPond/></Collapsible>
            <br />
            <Collapsible title='Plot' ><TestPlot/></Collapsible>
            <br />

        </>
    );
}
