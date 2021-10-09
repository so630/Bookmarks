import './Card.css';
import {useState} from 'react';

function Card(props) {

    let [link, setLink] = useState({title: '', link: ''});

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
        props.update(link, props.header);
    }

    return (
        <div className="card">
            <h1 className="header">{props.header}</h1>
            <hr></hr>
            {props.links.map((link, i) => {
                return (
                    <h1 className="link-h1">
                        <a key={i} className="link" href={link.link}>{link.title}</a>
                    </h1>
                )
            })}
            {props.links.length == 0 ? null : <hr></hr>}
            <input className="form-control" autoComplete="off" name="link" onChange={onChange} style={{marginBottom: '10px'}} placeholder="Link..."/>
            <input className="form-control" autoComplete="off" name="title" onChange={onChange} style={{marginBottom: '10px'}} placeholder="Title..."/>
            <button className="btn btn-primary" onClick={update}>Add Link</button>
        </div>
    )
}

export default Card;