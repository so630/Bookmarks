import './App.css';
import Card from './components/Card';
import {useEffect, useState} from 'react';
import CategoryForm from './components/CategoryForm';
import Cookies from 'universal-cookie';
import ReactToPrint from 'react-to-print';

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
    let [isEdit, setEdit] = useState(false);
    useEffect(() => {
        if (isEdit) {
            document.addEventListener('keydown', (k) => {
                if (k.code == 13) {
                    let r = window.confirm('Are you sure you want to confirm this edit?')
                    if (r) {
                        setEdit(false)
                    }
                }
            })
        } else {
            document.addEventListener('keydown', () => {});
        }
    }, [isEdit])

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

    function del(index, header) {
        setLinks(prev => {
            let arr = prev;
            arr.forEach(obj => {
                if (obj.title == header) {
                    obj.links.splice(index, 1);
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

    function delc(header) {
        setLinks(prev => {
            let arr = prev;
            arr.forEach((obj, i) => {
                if (obj.title == header) {
                    arr.splice(i, 1);
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

    function changeHead(first, second) {
        setLinks(prev => {
            let arr = prev;
            arr.forEach((obj, i) => {
                if (obj.title === first) {
                    obj.title = second;
                }
            })

            fetch('/update', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username: username, data: [...arr]})
            })

            return [...arr];
        })
    }

    return (
        <>
            <h1 style={{fontSize: '40px', textAlign: 'center', display: 'block', float: 'center', fontFamily: "'McLaren', cursive", fontSize: '45px'}}><em>Bookmarks</em></h1>
            <Gallery links={links} update={update} del={del} setEdit={setEdit} isEdit={isEdit} delc={delc} changeHeader={changeHead} />
            <div style={{position: 'fixed', bottom: '15px', left: '10px', display: 'inline-flex'}}>
                {/* <div style={{display: 'inline-flex'}}> */}
                    {!isClick ? <button class="btn btn-success" onClick={onClick}>Add Category</button> : <CategoryForm cancel={cancel} submit={submit} />}
                {/* </div> */}
                <button class="btn btn-danger edit" onClick={() => isEdit ? setEdit(false) : setEdit(true)}>{isEdit ? <i class="fas fa-times"></i> : 'Edit'}</button>
            </div>
        </>
    )
}

function Gallery({links, update, del, setEdit, isEdit, delc, changeHeader}) {
    return (
        <div style={{display: 'block', width: '100%'}}>
            <div style={{display: 'flex', alignItems: 'start', flexWrap: 'wrap'}}>
                {links.map(link => {
                    return <Card links={link.links} header={link.title} change={changeHeader} update={update} del={del} setEdit={setEdit} isEdit={isEdit} delc={delc}/>
                })}
            </div>
        </div>
    )
}

export default App;