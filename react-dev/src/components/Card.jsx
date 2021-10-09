import './Card.css';
import {useState} from 'react';

function Card(props) {

    let [link, setLink] = useState({title: '', link: ''});
    let [isClick, setClick] = useState(false);

    function onChange(event) {
        let name = event.target.name;
        let value = event.target.value;

        if (name == "link") {
            setLink(prev => {
                return {
                    title: prev.title,
                    link: value
                }
            })
        } else {
            setLink(prev => {
                return {
                    title: value,
                    link: prev.link
                }
            })
        }
    }

    function update() {
        let inputs = document.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.value = '';
        })
        props.update(link, props.header);
    }

    function click() {
        if (isClick) {
            setClick(false);
        } else {
            setClick(true);
        }
    }

    return (
        <div className="card">
            <h1 className="header">{props.header}</h1>
            <hr></hr>
            {props.links.map((link, i) => {
                return (
                    <h1 className="link-h1">
                        <a key={i} className="link" href={link.link} target="_blank">{link.title}</a>
                    </h1>
                )
            })}
            {props.links.length == 0 ? null : <hr></hr>}
            {/* <Form onChange={onChange} update={update} /> */}

            {!isClick ? <button className="btn btn-primary" onClick={click}>Add Link</button> : <Form onChange={onChange} update={update} cancel={click}/>}
        </div>
    )
}

function Form(props) {
    return (
        <>
            <input className="form-control" autoComplete="off" name="link" onChange={props.onChange} style={{marginBottom: '10px'}} placeholder="Link..."/>
            <input className="form-control" autoComplete="off" name="title" limit="24" onChange={props.onChange} style={{marginBottom: '10px'}} placeholder="Title..."/>
            <button className="btn btn-primary" style={{marginRight: '10px'}} onClick={props.update}>Add Link</button>
            <button class="btn btn-primary" onClick={props.cancel}>Cancel</button>
        </>
    )
}

export default Card;