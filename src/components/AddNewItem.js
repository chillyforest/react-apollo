import React, { useRef, useState } from 'react';

const AddNewItem = (props) => {
    const formRef = useRef(null);

    const [hasError, setErrorFlag] = useState(false);
    const [errMsg, setErrorMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const dname = e.target.dname.value;
        const calories = +e.target.calories.value;
        const fat = +e.target.fat.value;
        const carbs = +e.target.carbs.value;
        const protein = +e.target.protein.value;

        props.addMutation({variables: {dname, calories, fat, carbs, protein}})
            .then((data) => {
                console.log(data)
                formRef.current.reset();
                props.setAddMode(false);
                props.refetchQuery();
            })
            .catch((err) => {
                console.log(err);
                setErrorFlag(true);
                setErrorMessage(err);
            });
    }

    const labelStyle = "code db mh4 mv1 b";
    const inputStyle = "code db mh4 mv1";
    
    return (
        <div className="pv2 bg-light-gray w-100">
            <div className="mh2 mv3 pv2 bg-white flex flex-column">
                <div className="mh4 mv3 pv2 bg-yellow white code f4 b tc">
                    Please fill all details before you submit
                </div>
                <div
                    hidden={!hasError}
                    className="mh4 code light-yellow bg-dark-red">
                        {"Error in adding new values: " + errMsg}
                </div>
                <form
                    ref={formRef} 
                    className="flex flex-column mv3"
                    onFocus={() => {
                        setErrorFlag(false);
                        setErrorMessage("");
                    }}
                    onSubmit={handleSubmit}
                >
                    <label htmlFor="dname" className={labelStyle}>Dessert Name*</label>
                    <input type="text" name="dname" className={inputStyle} required />
                    <label htmlFor="calories" className={labelStyle} >Calories*</label>
                    <input type="number" name="calories" className={inputStyle} required />
                    <label htmlFor="fat" className={labelStyle} >Fat*</label>
                    <input type="number" name="fat" className={inputStyle} required />
                    <label htmlFor="carbs" className={labelStyle} >Carbs*</label>
                    <input type="number" name="carbs" className={inputStyle} required />
                    <label htmlFor="protein" className={labelStyle} >Protein*</label>
                    <input type="number" name="protein" className={inputStyle} required />
                    <input
                        type="submit"
                        className="code db ph1 pv2 mh4 mv1 b white bg-dark-green br2"
                        value="SUBMIT"
                    />
                </form>
                <button className="code db ph1 pv2 mh4 mb2" onClick={() => props.setAddMode(false)}>CANCEL</button>
            </div>
            
        </div>
    )
}

export default AddNewItem;