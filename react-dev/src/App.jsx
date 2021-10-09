import './App.css';
import Card from './components/Card';
import {useEffect, useState} from 'react';
import CategoryForm from './components/CategoryForm';
import Cookies from 'universal-cookie';

const cookie = new Cookies();

function App() {
    let username = cookie.get('username')
    let data = []
    useEffect(() => {
        fetch('/data', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: username})
        }).then((res) => {
            res.json().then((json) => {data = json; console.log(json)}).then(() => {
                setLinks(data);
            });
        })
    }, [])
    let [isClick, setClick] = useState(false);
    let [links, setLinks] = useState(data);

    function onClick() {
        setClick(true)
    }

    function cancel() {
        setClick(false)
    }

    function submit(title) {
        setLinks(prev => {
            fetch('/update', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username: username, data: [...prev, {title: title, links: []}]})
            }).then((res) => {
                console.log('req sent')
            })
            return [...prev, {title: title, links: []}]
        })
    }

    function update(link, title) {
        setLinks(prev => {
            let arr = prev;
            arr.forEach(category => {
                if (category.title == title) {
                    category.links.push(link);
                }
            })

            fetch('/update', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username: username, data: [...arr]})
            }).then((res) => {
                console.log('req sent')
            })

            return [...arr];
        })
    }

    return (
        <>
            <h1 style={{fontSize: '40px', textAlign: 'center'}}>Bookmarks</h1>
            {links.map(link => {
                return <Card links={link.links} header={link.title} update={update}/>
            })}
            {!isClick ? <button class="add-category" onClick={onClick}>Add Category</button> : <CategoryForm cancel={cancel} submit={submit} />}
        </>
    )
}

export default App;