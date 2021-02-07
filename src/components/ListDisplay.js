import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

import AddNewItem from './AddNewItem';

export const GET_DESSERT_DATA = gql`
    query getDesserts {
        desserts {
        id
        dname
        calories
        fat
        carbs
        protein
        }
    }
`;

export const ADD_DESSERT_MUTATION = gql`
    mutation CreateDessert(
        $dname: String!
        $calories: Int!
        $fat: Int!
        $carbs: Int!
        $protein: Int!
    ) {
        createDessert (
            dname: $dname
            calories: $calories
            fat: $fat
            carbs: $carbs
            protein: $protein
        ) {
            id
        }
    }
`;

export const REMOVE_DESSERT_MUTATION = gql`
    mutation RemoveDessert(
        $ids: [ID!]
    ) {
        deleteDessert (
            ids: $ids
        )
    }
`;


const ListDisplay = () => {
    const dessertsData = useQuery(GET_DESSERT_DATA) || {};
    const { 
        data: {
            desserts = []
    } = {},
        loading = false,
        refetch
    } = dessertsData;

    const [
        { isCheckedAll, isChecked },
        toggleCheck
    ] = useState({
        isCheckedAll: false,
        isChecked: []
    });

    const [dessertsTable, setDessertsTable] = useState([]);

    useEffect(() => {
        setDessertsTable([...desserts]);
        toggleCheck({
            isCheckedAll: false,
            isChecked: new Array(desserts.length).fill(false)
        });
    }, [desserts])
    // loading variable is not always updated
    
    const [isAddMode, setAddMode] = useState(false);
    const [hasError, setErrorFlag] = useState(false);
    const [errMsg, setErrorMessage] = useState("");


    const clickSelectAll = () => {
        toggleCheck(prevState => {
            let isCheckedUpdated = prevState.isChecked;
            // isCheckedUpdated.forEach((e, index) => isCheckedUpdated[index] = !prevState.isCheckedAll);
            return {
                isChecked: isCheckedUpdated.map(() => !prevState.isCheckedAll) || [],
                isCheckedAll: !prevState.isCheckedAll || false,
            }
        });
    }

    const clickSelectElem = (i) => {
        toggleCheck(prevState => {
            let isCheckedUpdated = prevState.isChecked;
            isCheckedUpdated[i] = !isCheckedUpdated[i];
            return {
                isChecked: isCheckedUpdated,
                isCheckedAll: isCheckedUpdated[i] && isCheckedUpdated.every(e => e == true)
            };
        })
    }

    const sortTable = (fieldName) => {
        let sortedDessertsTable = [...dessertsTable];
        
        sortedDessertsTable.sort((a, b) => {
            if (a[fieldName] > b[fieldName]) {
                return 1;
            } else if (a[fieldName] < b[fieldName]) {
                return -1;
            }
            return 0;
        })
        setDessertsTable(sortedDessertsTable);
    }

    const [addMutation] = useMutation(ADD_DESSERT_MUTATION);
    const [removeMutation] = useMutation(REMOVE_DESSERT_MUTATION);
    
    const RemoveItems = () => {
        removeMutation({
            variables: {
                ids: desserts
                    .filter((item, index) => isChecked[index])
                    .map(item => item.id)
            }
        }).then((data) => {
            // console.log(data, 'removed mutation');
            if (data && !data.deleteDessert) {
                throw new Error("Some selected value(s) does not exist!");
            }
            refetch();
        })
        .catch((err) => {
            console.log(err);
            setErrorFlag(true);
            setErrorMessage(err);
        });   
    }

    return (
        <div className="mh2 mv3 bg-light-gray">
            <div className="w-100">
                <h2 className="dib code normal lh-copy w-auto pl2">Nutrition List</h2>
                <button 
                    className="absolute mt3 mr3 ph1 pv2 dib code right-0 white bg-dark-green br2"
                    onClick={() => refetch()}>
                        RESET DATA
                </button>
            </div>
            <div hidden={!isAddMode}>
                <AddNewItem
                    setAddMode={setAddMode}
                    addMutation={addMutation}
                    refetchQuery={() => refetch()}
                />
            </div>
            <div className="bg-light-pink mh2" hidden={isAddMode}>
                <h4 className="dib code lh-copy dark-pink mh2">
                    {isChecked.filter(e => e).length} selected
                </h4>
                <div className="absolute dib relative right-1">
                    <button className="mt3 mr3 ph1 pv2 dib code br2"
                        onClick={RemoveItems}
                    >
                        DELETE</button>
                    <button className="mt3 mr3 ph1 pv2 dib code br2"
                        onClick={() => setAddMode(true)}>
                            ADD NEW
                    </button>
                </div>
                <div className="panel-body bg-light-blue">
                    <table
                        id="data-table"
                        onClick={() => {
                            setErrorFlag(false);
                            setErrorMessage("");
                        }}
                        className="code w-100 collapse">
                        <thead>
                            <tr className="flex bg-lightest-blue bb b--silver">
                                <th className="flex-auto w-5">
                                    <input 
                                        name="selectAll"
                                        type="checkbox"
                                        checked={isCheckedAll}
                                        onChange={clickSelectAll}
                                    />
                                </th>
                                <th className="flex-auto w-10">
                                    <button
                                        className="w-100 h2 f6 bw0 bg-transparent"
                                        onClick={() => sortTable("dname")}>
                                            Dessert(100g serving)
                                    </button>
                                </th>
                                <th className="flex-auto w-10">
                                    <button
                                        className="w-100 h2 f6 bw0 bg-transparent"
                                        onClick={() => sortTable("calories")}>
                                            Calories
                                    </button>
                                </th>
                                <th className="flex-auto w-10">
                                    <button
                                        className="w-100 h2 f6 bw0 bg-transparent"
                                        onClick={() => sortTable("fat")}>
                                            Fat (g)
                                    </button>
                                </th>
                                <th className="flex-auto w-10">
                                    <button
                                        className="w-100 h2 f6 bw0 bg-transparent"
                                        onClick={() => sortTable("carbs")}>
                                            Carbs (g)
                                    </button>
                                </th>
                                <th className="flex-auto w-10">
                                    <button
                                        className="w-100 h2 f6 bw0 bg-transparent"
                                        onClick={() => sortTable("protein")}>
                                            Protein (g)
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {dessertsTable && dessertsTable.map((item, index) => (
                                <tr key={item.id} className="flex bb b--silver">
                                    <td className="flex-auto w-5 tc">
                                        <input 
                                            id={item.id}
                                            type="checkbox"
                                            checked={isChecked[index] || false}
                                            onChange={() => clickSelectElem(index)}
                                        /></td>
                                    <td className="flex-auto w-10">{item.dname}</td>
                                    <td className="flex-auto w-10">{item.calories}</td>
                                    <td className="flex-auto w-10">{item.fat}</td>
                                    <td className="flex-auto w-10">{item.carbs}</td>
                                    <td className="flex-auto w-10">{item.protein}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div
                    hidden={!hasError}
                    className="code light-yellow bg-dark-red">
                        {"Error message: " + errMsg}
                </div>
            </div>
        </div>
    )
}

export default ListDisplay;