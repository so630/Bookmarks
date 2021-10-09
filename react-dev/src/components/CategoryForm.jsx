import './Card.css';
import {useState} from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();


function CategoryForm(props) {
    let [title, setTitle] = useState('')

    function onChange(event) {
        setTitle(event.target.value);
    }

    function submit(event) {
        props.submit(title)
    }

    return (
        <div className="card-form">
            <input className="form-control" style={{marginBottom: '10px'}} onChange={onChange} placeholder="Enter the title..." type="text"/>
            <button className="btn btn-primary" onClick={submit} style={{float: 'right', padding: '6px 14px'}}>+</button>
            <button className="cancel" onClick={props.cancel} style={{float: 'left'}}>Cancel</button> 
        </div>
    )
}

export default CategoryForm;