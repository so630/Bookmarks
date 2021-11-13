import './Card.css';
import {useState} from 'react';

function Card(props) {

    let [link, setLink] = useState({title: '', link: ''});
    let [isClick, setClick] = useState(false);
    let [header, setHeader] = useState(props.header);

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

    function del(event) {
        // make the button first
        let title = event.target.parentNode.parentNode.childNodes[0].textContent;
        // let link = event.target.parentNode.parentNode.childNodes[0].href;
        let index = -1;
        props.links.forEach((link, i) => {
            if (link.title == title) {
                index = i;
            }
        })
        let c = window.confirm("Are you sure you want to delete this link?")
        if (!c) {
            return;
        }
        props.setEdit(false)
        props.del(index, props.header);
    }

    function update() {
        let inputs = document.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.value = '';
        })
        props.update(link, props.header);
    }

    function delc() {
        let c = window.confirm("Are you sure you want to delete this category?")
        if (!c) {
            return;
        }
        props.setEdit(false)
        props.delc(props.header);
    }

    

    function click() {
        if (isClick) {
            setClick(false);
        } else {
            setClick(true);
        }
    }

    function handleChange(event) {
        setHeader(event.target.value);
        props.change(props.header, header);
    }

    return (
        <div className="card">
            {props.isEdit ? <a className="delete category" style={{color: '#dc3545'}} onClick={delc}><i class="fas fa-times"></i></a> : null}
            <i class="fas fa-bookmark" style={{position: 'absolute', top: '0', left: '15px'}}></i>
            {!props.isEdit ? <h1 className="header">{header}</h1> : <input type="text" defaultValue={header} onChange={handleChange} className="header-input" />}
            <hr></hr>
            {props.links.map((link, i) => {
                return (
                    <h1 className="link-h1">
                        <a key={i} className="link" href={link.link} target="_blank">{link.title}</a>
                        {props.isEdit ? <a key={i} className="delete" onClick={del}><i class="far fa-trash-alt"></i></a> : null}
                    </h1>
                )
            })}
            {props.links.length == 0 ? null : <hr></hr>}

            {!isClick ? <button className="btn btn-secondary" onClick={click}>Add Link</button> : <Form onChange={onChange} update={update} cancel={click}/>}
        </div>
    )
}

function Form(props) {
    return (
        <>
            <input className="form-control" autoComplete="off" name="link" onChange={props.onChange} style={{marginBottom: '10px'}} placeholder="Link..."/>
            <input className="form-control" autoComplete="off" name="title" limit="24" onChange={props.onChange} style={{marginBottom: '10px'}} placeholder="Title..."/>
            <button className="btn btn-secondary" style={{marginRight: '10px'}} onClick={props.update}>Add Link</button>
            <button class="btn btn-secondary" onClick={props.cancel}>Cancel</button>
        </>
    )
}

export default Card;